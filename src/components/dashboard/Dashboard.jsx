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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RemindMe Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

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
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#5046E4] hover:bg-[#4036D4] text-white font-bold py-2 px-4 rounded"
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
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