import React, { useState, useEffect } from 'react';

const ImprovedDateTimePicker = ({ value, onChange, label = "When should we remind you?" }) => {
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');

  // Initialize from existing value
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().slice(0, 5);
        setDateValue(dateStr);
        setTimeValue(timeStr);
      }
    }
  }, [value]);

  // Update parent when date or time changes
  useEffect(() => {
    if (dateValue && timeValue) {
      const combinedDateTime = `${dateValue}T${timeValue}`;
      onChange(combinedDateTime);
    }
  }, [dateValue, timeValue, onChange]);

  // Get today's date as minimum
  const today = new Date().toISOString().split('T')[0];
  
  // Get current time for default
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Input */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            📅 Date
          </label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            min={today}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4] bg-white text-base"
          />
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            🕐 Time
          </label>
          <input
            type="time"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4] bg-white text-base"
          />
        </div>
      </div>

      {/* Quick Date Shortcuts */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDateValue(tomorrow.toISOString().split('T')[0]);
            if (!timeValue) setTimeValue('09:00');
          }}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={() => {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            setDateValue(nextWeek.toISOString().split('T')[0]);
            if (!timeValue) setTimeValue('09:00');
          }}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
        >
          Next Week
        </button>
        <button
          type="button"
          onClick={() => {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setDateValue(nextMonth.toISOString().split('T')[0]);
            if (!timeValue) setTimeValue('09:00');
          }}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
        >
          Next Month
        </button>
      </div>

      {/* Quick Time Shortcuts */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTimeValue('09:00')}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
        >
          9:00 AM
        </button>
        <button
          type="button"
          onClick={() => setTimeValue('12:00')}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
        >
          12:00 PM
        </button>
        <button
          type="button"
          onClick={() => setTimeValue('17:00')}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
        >
          5:00 PM
        </button>
        <button
          type="button"
          onClick={() => setTimeValue('19:00')}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
        >
          7:00 PM
        </button>
      </div>

      {/* Preview */}
      {dateValue && timeValue && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            📝 <strong>Reminder set for:</strong> {new Date(`${dateValue}T${timeValue}`).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImprovedDateTimePicker;