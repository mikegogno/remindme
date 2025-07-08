import React from 'react';
import { X, Calendar, Clock, MapPin, Bell, Share2, Edit, Trash } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ReminderModal = ({ reminder, onClose, onEdit, onDelete }) => {
  if (!reminder) return null;
  
  // Parse location data if it exists
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

  // Format date and time from ISO string
  const reminderDate = parseISO(reminder.remind_at || reminder.date);
  const formattedDate = format(reminderDate, 'PPPP'); // Monday, January 1, 2021
  const formattedTime = format(reminderDate, 'p'); // 12:00 PM

  // Priority colors
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Reminder Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{reminder.title}</h1>
              {reminder.description && (
                <p className="text-gray-700 mt-2">{reminder.description}</p>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                reminder.completed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {reminder.completed ? 'Completed' : 'Active'}
              </span>
              
              {/* Priority Badge */}
              {reminder.priority && (
                <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  priorityColors[reminder.priority] || 'bg-gray-100 text-gray-800'
                }`}>
                  {reminder.priority} Priority
                </span>
              )}
            </div>

            {/* Details List */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
              {/* Date */}
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-base font-medium text-gray-900">{formattedDate}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-base font-medium text-gray-900">{formattedTime}</p>
                </div>
              </div>

              {/* Location */}
              {locationData && locationData.address && (
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-base font-medium text-gray-900">
                      {locationData.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Notifications */}
              <div className="flex items-start">
                <Bell className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Notifications</p>
                  <p className="text-base font-medium text-gray-900">
                    {reminder.notification === false ? 'Disabled' : 'Enabled'}
                  </p>
                </div>
              </div>

              {/* Created/Updated Times */}
              <div className="pt-2 text-xs text-gray-500">
                <p>Created: {format(parseISO(reminder.created_at), 'PPp')}</p>
                {reminder.updated_at && (
                  <p>Last updated: {format(parseISO(reminder.updated_at), 'PPp')}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={onDelete}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <Trash className="w-4 h-4" />
              <span>Delete</span>
            </button>
            
            <button
              onClick={onEdit}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;