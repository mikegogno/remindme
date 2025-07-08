import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Bell } from 'lucide-react';
import ImprovedDateTimePicker from '../ImprovedDateTimePicker';
import LocationPicker from '../LocationPicker';
import { useAuth } from '../../context/AuthContext';
import { createReminder, updateReminder } from '../../lib/storageAdapter';
import toast from 'react-hot-toast';

const ReminderForm = ({ onClose, onSave, initialData = null }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: null,
    priority: 'medium',
    notification: true
  });

  // Initialize form with initial data if provided (for editing mode)
  useEffect(() => {
    if (initialData) {
      // Format the date/time if provided in remind_at format
      let dateValue = initialData.date;
      let timeValue = initialData.time;
      
      if (initialData.remind_at) {
        const date = new Date(initialData.remind_at);
        dateValue = date.toISOString().split('T')[0];
        timeValue = date.toTimeString().slice(0, 5);
      }

      // Parse location data if it's a string
      let locationData = initialData.location;
      if (typeof locationData === 'string' && locationData) {
        try {
          locationData = JSON.parse(locationData);
        } catch (e) {
          console.error('Error parsing location data:', e);
        }
      }
      
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        date: dateValue || '',
        time: timeValue || '',
        location: locationData || null,
        priority: initialData.priority || 'medium',
        notification: initialData.notification !== undefined ? initialData.notification : true
      });
    }
  }, [initialData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.date || !formData.time) {
      toast.error('Please complete all required fields');
      return;
    }
    
    // Prevent double submission
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      // Create ISO string from date and time
      const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
      
      // Validate the date is in the future
      if (combinedDateTime <= new Date()) {
        toast.error('Reminder date must be in the future');
        setIsSubmitting(false);
        return;
      }
      
      // Create reminder data object
      const reminderData = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        remind_at: combinedDateTime.toISOString(),
        location: formData.location ? JSON.stringify(formData.location) : null,
        priority: formData.priority,
        notification: formData.notification,
        completed: initialData?.completed || false
      };

      let response;
      
      // Update or create reminder based on whether we have initialData
      if (initialData?.id) {
        // Update existing reminder
        response = await updateReminder(initialData.id, reminderData);
        
        if (response.error) {
          throw new Error(response.error.message || 'Failed to update reminder');
        }
        
        toast.success('Reminder updated successfully!');
      } else {
        // Create new reminder
        response = await createReminder(reminderData);
        
        if (response.error) {
          throw new Error(response.error.message || 'Failed to create reminder');
        }
        
        toast.success('Reminder created successfully!');
      }
      
      // Call the onSave callback with the updated/created reminder data
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const priorityColors = {
    low: 'text-green-600 border-green-300',
    medium: 'text-yellow-600 border-yellow-300',
    high: 'text-red-600 border-red-300'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Reminder' : 'New Reminder'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="What do you need to remember?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5046E4] focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5046E4] focus:border-transparent resize-none"
            />
          </div>

          {/* Date & Time */}
          <ImprovedDateTimePicker
            value={formData.date && formData.time ? `${formData.date}T${formData.time}` : ''}
            onChange={(dateTime) => {
              if (dateTime) {
                const date = new Date(dateTime);
                handleChange('date', date.toISOString().split('T')[0]);
                handleChange('time', date.toTimeString().slice(0, 5));
              }
            }}
            label="When should we remind you? *"
          />

          {/* Location */}
          <div>
            <LocationPicker 
              value={formData.location}
              onChange={(location) => handleChange('location', location)}
              placeholder="Add a location (optional)"
              label="Location"
              showCurrentLocation={true}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority
            </label>
            <div className="flex space-x-3">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handleChange('priority', priority)}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all duration-200 capitalize ${
                    formData.priority === priority
                      ? `${priorityColors[priority]} bg-opacity-10`
                      : 'text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Enable Notifications</h3>
              <p className="text-sm text-gray-600">Get notified when this reminder is due</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notification}
                onChange={(e) => handleChange('notification', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5046E4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5046E4]"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.date || !formData.time}
              className="flex-1 py-3 px-4 bg-[#5046E4] text-white rounded-lg hover:bg-[#4338CA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'} Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;