import React, { useState } from 'react';
import { X } from 'lucide-react';
import ImprovedDateTimePicker from '../ImprovedDateTimePicker';
import LocationPicker from '../LocationPicker';

const ReminderForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    location: initialData?.location || null,
    priority: initialData?.priority || 'medium',
    notification: initialData?.notification !== undefined ? initialData.notification : true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.time) {
      return;
    }
    
    onSubmit({
      ...formData,
      id: initialData?.id || Date.now(),
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
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
            onClick={onCancel}
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
            selectedDate={formData.date}
            selectedTime={formData.time}
            onDateChange={(date) => handleChange('date', date)}
            onTimeChange={(time) => handleChange('time', time)}
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
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.date || !formData.time}
              className="flex-1 py-3 px-4 bg-[#5046E4] text-white rounded-lg hover:bg-[#4338CA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {initialData ? 'Update' : 'Create'} Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;