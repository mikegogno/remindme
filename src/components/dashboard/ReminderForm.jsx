import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, FileText } from 'lucide-react';
import { useReminders } from '../../context/RemindersContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ReminderForm = ({ reminder, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    category: 'personal'
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { addReminder, updateReminder } = useReminders();

  useEffect(() => {
    if (reminder) {
      const dueDate = new Date(reminder.dueDate);
      setFormData({
        title: reminder.title || '',
        description: reminder.description || '',
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        dueTime: format(dueDate, 'HH:mm'),
        priority: reminder.priority || 'medium',
        category: reminder.category || 'personal'
      });
    } else {
      // Set default date to today and time to current time + 1 hour
      const now = new Date();
      const defaultDate = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
      setFormData(prev => ({
        ...prev,
        dueDate: format(now, 'yyyy-MM-dd'),
        dueTime: format(defaultDate, 'HH:mm')
      }));
    }
  }, [reminder]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.dueDate || !formData.dueTime) {
      toast.error('Please select a date and time');
      return;
    }

    setIsLoading(true);

    try {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      
      const reminderData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: dueDateTime.toISOString(),
        priority: formData.priority,
        category: formData.category,
        completed: false
      };

      if (reminder) {
        await updateReminder(reminder.id, { ...reminder, ...reminderData });
        toast.success('Reminder updated successfully!');
      } else {
        await addReminder(reminderData);
        toast.success('Reminder created successfully!');
      }

      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save reminder');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {reminder ? 'Edit Reminder' : 'Create New Reminder'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input-primary pl-10"
                placeholder="Enter reminder title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="input-primary resize-none"
              placeholder="Add more details (optional)"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  required
                  className="input-primary pl-10"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dueTime"
                  name="dueTime"
                  type="time"
                  required
                  className="input-primary pl-10"
                  value={formData.dueTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="priority"
                name="priority"
                className="input-primary pl-10"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="input-primary"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="shopping">Shopping</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Saving...
                </div>
              ) : (
                reminder ? 'Update Reminder' : 'Create Reminder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;