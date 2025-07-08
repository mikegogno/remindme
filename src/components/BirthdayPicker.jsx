import React, { useState } from 'react';
import { X, Calendar, Gift, Heart } from 'lucide-react';

const BirthdayPicker = ({ onSelect, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [personName, setPersonName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !personName.trim()) return;

    // Create birthday reminder date for this year or next year if already passed
    const today = new Date();
    const birthdayThisYear = new Date(selectedDate);
    birthdayThisYear.setFullYear(today.getFullYear());
    
    // If birthday already passed this year, set for next year
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(today.getFullYear() + 1);
    }

    // Set time to 9:00 AM
    birthdayThisYear.setHours(9, 0, 0, 0);

    const birthdayDateTime = birthdayThisYear.toISOString().slice(0, 16);
    onSelect(birthdayDateTime);
  };

  const quickBirthdays = [
    { name: 'Mom', icon: Heart },
    { name: 'Dad', icon: Heart },
    { name: 'Spouse', icon: Heart },
    { name: 'Child', icon: Gift },
    { name: 'Friend', icon: Gift },
    { name: 'Colleague', icon: Gift }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
            <Gift className="h-5 w-5 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Birthday Reminder</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Person Name */}
        <div>
          <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-2">
            Person's Name *
          </label>
          <input
            type="text"
            id="personName"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            placeholder="Enter person's name..."
            required
          />
        </div>

        {/* Quick Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Select
          </label>
          <div className="grid grid-cols-3 gap-3">
            {quickBirthdays.map((person, index) => {
              const Icon = person.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPersonName(person.name)}
                  className={`
                    p-3 rounded-xl border-2 transition-all duration-200 text-center
                    ${personName === person.name
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mx-auto mb-1 ${
                    personName === person.name ? 'text-pink-500' : 'text-gray-400'
                  }`} />
                  <span className="text-sm font-medium">{person.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Birthday Date */}
        <div>
          <label htmlFor="birthdayDate" className="block text-sm font-medium text-gray-700 mb-2">
            Birthday Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              id="birthdayDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            We'll remind you every year on this date!
          </p>
        </div>

        {/* Preview */}
        {personName && selectedDate && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4">
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-pink-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">
                  {personName}'s Birthday
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric' 
                  })} • Repeats yearly
                </p>
              </div>
            </div>
          </div>
        )}

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
            disabled={!personName.trim() || !selectedDate}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Gift className="h-5 w-5 mr-2" />
            Create Birthday Reminder
          </button>
        </div>
      </form>
    </div>
  );
};

export default BirthdayPicker;