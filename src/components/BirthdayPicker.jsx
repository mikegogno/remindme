import React, { useState, useEffect } from 'react';

const BirthdayPicker = ({ value, onChange, label }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  // Convert timestamp to date and time when value changes
  useEffect(() => {
    if (value) {
      const dateObj = new Date(value);
      setDate(dateObj.toISOString().split('T')[0]);
      setTime(dateObj.toTimeString().split(' ')[0].substring(0, 5));
    } else {
      setDate('');
      setTime('');
    }
  }, [value]);

  // Update parent component when date or time changes
  useEffect(() => {
    if (date && time) {
      const dateTimeStr = `${date}T${time}`;
      onChange(dateTimeStr);
    } else {
      onChange('');
    }
  }, [date, time, onChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label || 'Select Date and Time'}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4]"
          />
        </div>
      </div>
    </div>
  );
};

export default BirthdayPicker;