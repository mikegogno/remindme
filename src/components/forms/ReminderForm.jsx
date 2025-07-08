import React, { useState, useEffect } from 'react';
import { useReminders } from '../../context/RemindersContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Save,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import LocationPicker from '../LocationPicker';
import BirthdayPicker from '../BirthdayPicker';

const ReminderForm = ({ reminder, onClose }) => {
  const { addReminder, updateReminder } = useReminders();
  const [loading, setLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    priority: 'medium',
    location: '',
    repeatType: 'none',
    tags: [],
    isBirthday: false
  });

  useEffect(() => {
    if (reminder) {
      setFormData({
        title: reminder.title || '',
        description: reminder.description || '',
        dateTime: reminder.dateTime || '',
        priority: reminder.priority || 'medium',
        location: reminder.location || '',
        repeatType: reminder.repeatType || 'none',
        tags: reminder.tags || [],
        isBirthday: reminder.isBirthday || false
      });
    }
  }, [reminder]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.dateTime) {
      toast.error('Please select a date and time');
      return;
    }

    setLoading(true);
    
    try {
      if (reminder) {
        await updateReminder(reminder.id, formData);
      } else {
        await addReminder(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving reminder:', error);
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  const repeatOptions = [
    { value: 'none', label: 'No Repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {reminder ? 'Edit Reminder' : 'Create New Reminder'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            placeholder="Enter reminder title..."
          />
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
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
            placeholder="Add more details..."
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                required
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                placeholder="Add location..."
              />
            </div>
            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors border border-gray-300"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Repeat */}
        <div>
          <label htmlFor="repeatType" className="block text-sm font-medium text-gray-700 mb-2">
            Repeat
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="repeatType"
              name="repeatType"
              value={formData.repeatType}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none"
            >
              {repeatOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Birthday Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isBirthday"
            name="isBirthday"
            checked={formData.isBirthday}
            onChange={handleChange}
            className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded transition-colors"
          />
          <label htmlFor="isBirthday" className="ml-3 text-sm font-medium text-gray-700">
            This is a birthday reminder
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {reminder ? 'Update' : 'Create'} Reminder
              </>
            )}
          </button>
        </div>
      </form>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <LocationPicker
              onSelect={(location) => {
                setFormData(prev => ({ ...prev, location }));
                setShowLocationPicker(false);
              }}
              onClose={() => setShowLocationPicker(false)}
            />
          </div>
        </div>
      )}

      {/* Birthday Picker Modal */}
      {showBirthdayPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <BirthdayPicker
              onSelect={(date) => {
                setFormData(prev => ({ 
                  ...prev, 
                  dateTime: date,
                  isBirthday: true,
                  repeatType: 'yearly'
                }));
                setShowBirthdayPicker(false);
              }}
              onClose={() => setShowBirthdayPicker(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderForm;