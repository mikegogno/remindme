import React, { useState, useEffect } from 'react';
import { format, startOfDay, endOfDay, isSameDay, parseISO, addDays, isAfter } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { getReminders, deleteReminder, updateReminder } from '../../lib/storageAdapter';
import toast from 'react-hot-toast';

import MapAppSelector from '../MapAppSelector';
import CalendarView from './CalendarView';
import FilterTabs from './FilterTabs';
import ReminderForm from '../reminders/ReminderForm';
import ReminderModal from '../reminders/ReminderModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [userProfile, setUserProfile] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isViewingReminder, setIsViewingReminder] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);

  useEffect(() => {
    if (user) {
      loadReminders();
    }
    // Load user profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, [user]);

  useEffect(() => {
    if (reminders.length > 0) {
      filterReminders();
    } else {
      setFilteredReminders([]);
    }
  }, [activeFilter, reminders]);

  const filterReminders = () => {
    const today = startOfDay(new Date());
    const tomorrow = endOfDay(addDays(today, 1));

    switch (activeFilter) {
      case 'today':
        setFilteredReminders(
          reminders.filter(reminder => {
            const reminderDate = parseISO(reminder.remind_at);
            return isSameDay(reminderDate, today);
          })
        );
        break;
      case 'upcoming':
        setFilteredReminders(
          reminders.filter(reminder => {
            const reminderDate = parseISO(reminder.remind_at);
            return isAfter(reminderDate, tomorrow) && !reminder.completed;
          })
        );
        break;
      case 'completed':
        setFilteredReminders(
          reminders.filter(reminder => reminder.completed)
        );
        break;
      default:
        setFilteredReminders(reminders);
    }
  };

  const loadReminders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getReminders(user.id);
      
      if (error) {
        toast.error('Failed to load reminders');
        console.error('Error loading reminders:', error);
      } else {
        setReminders(data || []);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open the reminder form for creating a new reminder
  const handleOpenReminderForm = () => {
    setReminderToEdit(null);
    setIsReminderFormOpen(true);
  };

  // Open the reminder form for editing an existing reminder
  const handleEditReminder = (reminder) => {
    setReminderToEdit(reminder);
    setIsReminderFormOpen(true);
    setIsViewingReminder(false);
  };

  // Handle save of a new or updated reminder
  const handleSaveReminder = (savedReminder) => {
    if (reminderToEdit) {
      // Update existing reminder in the list
      setReminders(reminders.map(r => 
        r.id === savedReminder.id ? savedReminder : r
      ));
    } else {
      // Add new reminder to the list
      setReminders([savedReminder, ...reminders]);
    }

    // Close the form
    setIsReminderFormOpen(false);
    setReminderToEdit(null);
  };

  // Open the reminder detail modal
  const handleViewReminder = (reminder) => {
    setSelectedReminder(reminder);
    setIsViewingReminder(true);
  };

  // Handle marking a reminder as complete
  const handleCompleteReminder = async (id) => {
    try {
      const reminderToUpdate = reminders.find(r => r.id === id);
      if (!reminderToUpdate) return;

      // Call the updateReminder function from the storage adapter
      const { error } = await updateReminder(id, { completed: true });

      if (error) {
        toast.error('Failed to update reminder');
        console.error('Error updating reminder:', error);
      } else {
        toast.success('Reminder marked as completed!');
        
        // Update the reminders list
        setReminders(reminders.map(reminder => 
          reminder.id === id ? { ...reminder, completed: true } : reminder
        ));

        // If this reminder is currently being viewed, update the selected reminder as well
        if (selectedReminder && selectedReminder.id === id) {
          setSelectedReminder({ ...selectedReminder, completed: true });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error:', error);
    }
  };

  // Handle deleting a reminder
  const handleDeleteReminder = async (id) => {
    if (!confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    try {
      const { error } = await deleteReminder(id);

      if (error) {
        toast.error('Failed to delete reminder');
        console.error('Error deleting reminder:', error);
      } else {
        toast.success('Reminder deleted successfully!');
        
        // Remove from reminders list
        setReminders(reminders.filter(reminder => reminder.id !== id));
        
        // Close the modal if we're viewing the deleted reminder
        if (selectedReminder && selectedReminder.id === id) {
          setIsViewingReminder(false);
          setSelectedReminder(null);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error:', error);
    }
  };

  const handleDrawerItemClick = (action) => {
    setIsDrawerOpen(false);
    if (action === 'logout') {
      logout();
    } else if (action === 'profile') {
      toast.info('Profile page - coming soon!');
    } else if (action === 'settings') {
      toast.info('Settings page - coming soon!');
    }
  };



  const handleCalendarSelectDate = (date, dateReminders) => {
    // Switch to the today filter and set state if there are reminders for the selected date
    if (dateReminders && dateReminders.length > 0) {
      const today = new Date();
      if (isSameDay(date, today)) {
        setActiveFilter('today');
      } else {
        // If selecting another date with reminders, we could switch to a custom view or keep 'all'
        setActiveFilter('all');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {/* Bell Icon */}
              <div className="flex items-center mr-4">
                <svg className="w-8 h-8 text-[#5046E4]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                <span className="ml-2 text-2xl font-bold text-gray-900">RemindMe</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Switcher - Pill Button Design */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-[#5046E4] text-white shadow-lg'
                        : 'bg-white text-[#5046E4] border-2 border-[#5046E4] hover:bg-[#5046E4] hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>List View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      viewMode === 'calendar'
                        ? 'bg-[#5046E4] text-white shadow-lg'
                        : 'bg-white text-[#5046E4] border-2 border-[#5046E4] hover:bg-[#5046E4] hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Calendar View</span>
                  </button>
                </div>
                
                <button 
                  onClick={handleOpenReminderForm}
                  className="flex items-center space-x-2 bg-[#5046E4] text-white px-6 py-3 rounded-full font-medium hover:bg-[#4338CA] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Reminder</span>
                </button>
              </div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">Your Reminders</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
              </div>
              {/* Profile Menu Icon */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5046E4] hover:border-[#4338CA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:ring-offset-2"
              >
                {userProfile?.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#5046E4] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Right Drawer */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleDrawerItemClick('profile')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Profile</span>
                </button>
                
                <button
                  onClick={() => handleDrawerItemClick('settings')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span className="text-gray-700">Settings</span>
                </button>
                
                <button
                  onClick={() => handleDrawerItemClick('logout')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span className="text-red-600">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Map App Selector Modal */}
      {selectedAddress && (
        <MapAppSelector
          address={selectedAddress.address}
          lat={selectedAddress.lat}
          lng={selectedAddress.lng}
          onClose={() => setSelectedAddress(null)}
        />
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Banner with Gradient */}
          <div className="bg-gradient-to-r from-[#5046E4] to-[#5046E4] rounded-xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-lg font-medium">{format(new Date(), 'EEEE, MMMM d')}</span>
                </div>
                <p className="text-lg opacity-90">
                  You have {filteredReminders.filter(r => !r.completed).length} upcoming reminders
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-[#5046E4]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
                  <p className="text-sm text-gray-500">Total Reminders</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{reminders.filter(r => r.completed).length}</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{reminders.filter(r => !r.completed && new Date(r.remind_at) > new Date()).length}</p>
                  <p className="text-sm text-gray-500">Upcoming</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{reminders.filter(r => !r.completed && new Date(r.remind_at) < new Date()).length}</p>
                  <p className="text-sm text-gray-500">Overdue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reminder Form Modal */}
          {isReminderFormOpen && (
            <ReminderForm 
              initialData={reminderToEdit}
              onClose={() => {
                setIsReminderFormOpen(false);
                setReminderToEdit(null);
              }}
              onSave={handleSaveReminder}
            />
          )}

          {/* Reminder Detail Modal */}
          {isViewingReminder && selectedReminder && (
            <ReminderModal 
              reminder={selectedReminder}
              onClose={() => {
                setIsViewingReminder(false);
                setSelectedReminder(null);
              }}
              onEdit={() => handleEditReminder(selectedReminder)}
              onDelete={() => handleDeleteReminder(selectedReminder.id)}
            />
          )}

          {/* Filter Tabs */}
          <FilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          
          {/* View Switcher Content */}
          {viewMode === 'calendar' ? (
            <CalendarView 
              reminders={reminders} 
              onSelectDate={handleCalendarSelectDate}
              onViewReminder={handleViewReminder}
            />
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Reminders</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5046E4] mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading reminders...</p>
                  </div>
                ) : filteredReminders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders found</h3>
                    <p className="text-gray-500">
                      {activeFilter === 'all' 
                        ? 'Create your first reminder to get started!'
                        : `No reminders in the "${activeFilter}" category`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReminders.map((reminder) => {
                      let locationData = null;
                      if (reminder.location) {
                        try {
                          locationData = typeof reminder.location === 'string' 
                            ? JSON.parse(reminder.location) 
                            : reminder.location;
                        } catch (e) {
                          locationData = { address: reminder.location };
                        }
                      }
                      
                      const reminderDate = new Date(reminder.remind_at);
                      const isUpcoming = reminderDate > new Date() && !reminder.completed;
                      const isPastDue = reminderDate < new Date() && !reminder.completed;
                      
                      return (
                        <div
                          key={reminder.id}
                          className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                            reminder.completed 
                              ? 'bg-green-50 border-green-200' 
                              : isPastDue
                                ? 'bg-red-50 border-red-200'
                                : 'bg-white border-gray-200'
                          }`}
                          onClick={() => handleViewReminder(reminder)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className={`font-medium ${
                                  reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                  {reminder.title}
                                </h3>
                                
                                {/* Priority indicator */}
                                {reminder.priority && (
                                  <span className={`inline-flex rounded-full h-2 w-2 ${
                                    reminder.priority === 'high' ? 'bg-red-500' :
                                    reminder.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}></span>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-500 mt-1">
                                📅 {reminderDate.toLocaleString()}
                              </p>
                              
                              {locationData && locationData.address && (
                                <div className="text-sm text-[#5046E4] mt-1 flex items-center space-x-1">
                                  <span>📍</span>
                                  <span className="truncate">{locationData.address}</span>
                                </div>
                              )}
                              
                              {/* Reminder status badges */}
                              <div className="flex mt-2 space-x-2">
                                {isPastDue && (
                                  <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                    Past Due
                                  </span>
                                )}
                                {isUpcoming && (
                                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                    Upcoming
                                  </span>
                                )}
                                {reminder.completed && (
                                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Quick action buttons */}
                            <div className="flex flex-col space-y-2 ml-4">
                              {!reminder.completed && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteReminder(reminder.id);
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                                  title="Mark as Complete"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditReminder(reminder);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                                title="Edit Reminder"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteReminder(reminder.id);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                                title="Delete Reminder"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;