import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReminders, createReminder, updateReminder, deleteReminder } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReminder, setNewReminder] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadReminders();
    }
  }, [user]);

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

  const handleAddReminder = async (e) => {
    e.preventDefault();
    
    if (!newReminder.trim()) {
      toast.error('Please enter a reminder');
      return;
    }

    if (!reminderDate) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      const reminderData = {
        user_id: user.id,
        title: newReminder.trim(),
        remind_at: new Date(reminderDate).toISOString(),
        completed: false,
        created_at: new Date().toISOString()
      };

      const { data, error } = await createReminder(reminderData);

      if (error) {
        toast.error('Failed to create reminder');
        console.error('Error creating reminder:', error);
      } else {
        toast.success('Reminder created successfully!');
        setReminders([data, ...reminders]);
        setNewReminder('');
        setReminderDate('');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error:', error);
    }
  };

  const handleCompleteReminder = async (id) => {
    try {
      const { data, error } = await updateReminder(id, { completed: true });

      if (error) {
        toast.error('Failed to update reminder');
        console.error('Error updating reminder:', error);
      } else {
        toast.success('Reminder marked as completed!');
        setReminders(reminders.map(reminder => 
          reminder.id === id ? { ...reminder, completed: true } : reminder
        ));
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error:', error);
    }
  };

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
        setReminders(reminders.filter(reminder => reminder.id !== id));
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
      // Navigate to profile page - you can implement routing here
      toast.info('Profile page - coming soon!');
    } else if (action === 'settings') {
      // Navigate to settings page - you can implement routing here
      toast.info('Settings page - coming soon!');
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
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
              </div>
              {/* Profile Icon */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-[#5046E4] hover:bg-[#4036D4] text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Add Reminder Form */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Reminder</h2>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="What do you want to be reminded about?"
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4]"
                />
              </div>
              <div>
                <input
                  type="text" placeholder="Select date and time"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-200"
              >
                Add Reminder
              </button>
            </form>
          </div>

          {/* Reminders List */}
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
              ) : reminders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reminders yet. Add your first reminder above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`p-4 border rounded-lg ${
                        reminder.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {reminder.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(reminder.remind_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {!reminder.completed && (
                            <button
                              onClick={() => handleCompleteReminder(reminder.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
