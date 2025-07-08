import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageAdapter } from '../lib/storageAdapter';
import toast from 'react-hot-toast';

const RemindersContext = createContext();

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};

export const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Load reminders on mount
  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await storageAdapter.getReminders();
      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async (reminderData) => {
    try {
      const newReminder = {
        id: Date.now().toString(),
        ...reminderData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const savedReminder = await storageAdapter.createReminder(newReminder);
      setReminders(prev => [savedReminder, ...prev]);
      toast.success('Reminder created successfully!');
      return savedReminder;
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder');
      throw error;
    }
  };

  const updateReminder = async (id, updates) => {
    try {
      const updatedReminder = await storageAdapter.updateReminder(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      setReminders(prev => 
        prev.map(reminder => 
          reminder.id === id ? updatedReminder : reminder
        )
      );
      toast.success('Reminder updated successfully!');
      return updatedReminder;
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast.error('Failed to update reminder');
      throw error;
    }
  };

  const deleteReminder = async (id) => {
    try {
      await storageAdapter.deleteReminder(id);
      setReminders(prev => prev.filter(reminder => reminder.id !== id));
      toast.success('Reminder deleted successfully!');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
      throw error;
    }
  };

  const toggleComplete = async (id) => {
    try {
      const reminder = reminders.find(r => r.id === id);
      if (!reminder) return;

      const updatedReminder = await storageAdapter.updateReminder(id, {
        completed: !reminder.completed,
        updatedAt: new Date().toISOString()
      });

      setReminders(prev =>
        prev.map(r => r.id === id ? updatedReminder : r)
      );

      toast.success(
        updatedReminder.completed 
          ? 'Reminder completed!' 
          : 'Reminder marked as pending'
      );
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error('Failed to update reminder status');
    }
  };

  const getFilteredReminders = () => {
    switch (filter) {
      case 'active':
        return reminders.filter(r => !r.completed);
      case 'completed':
        return reminders.filter(r => r.completed);
      case 'today':
        const today = new Date().toDateString();
        return reminders.filter(r => {
          const reminderDate = new Date(r.dateTime).toDateString();
          return reminderDate === today;
        });
      case 'upcoming':
        const now = new Date();
        return reminders.filter(r => {
          const reminderDate = new Date(r.dateTime);
          return reminderDate > now && !r.completed;
        });
      default:
        return reminders;
    }
  };

  const getStats = () => {
    const total = reminders.length;
    const completed = reminders.filter(r => r.completed).length;
    const active = total - completed;
    const today = reminders.filter(r => {
      const reminderDate = new Date(r.dateTime).toDateString();
      return reminderDate === new Date().toDateString();
    }).length;

    return { total, completed, active, today };
  };

  const value = {
    reminders,
    loading,
    filter,
    setFilter,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleComplete,
    getFilteredReminders,
    getStats,
    refreshReminders: loadReminders
  };

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};

export default RemindersContext;