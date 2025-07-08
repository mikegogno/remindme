import React, { useState } from 'react';

const BirthdayPicker = ({ onChange, label = "Birthday" }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const days = Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1);

  const handleChange = (type, newValue) => {
    let month = selectedMonth;
    let day = selectedDay;
    let year = selectedYear;

    if (type === 'month') {
      month = newValue;
      setSelectedMonth(newValue);
    } else if (type === 'day') {
      day = newValue;
      setSelectedDay(newValue);
    } else if (type === 'year') {
      year = newValue;
      setSelectedYear(newValue);
    }

    if (month && day && year) {
      const formattedDate = `${month}/${day.padStart(2, '0')}/${year}`;
      onChange(formattedDate);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-3">
        {/* Month Dropdown */}
        <div>
          <select
            value={selectedMonth}
            onChange={(e) => handleChange('month', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4] bg-white"
          >
            <option value="">Month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Day Dropdown */}
        <div>
          <select
            value={selectedDay}
            onChange={(e) => handleChange('day', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4] bg-white"
            disabled={!selectedMonth}
          >
            <option value="">Day</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div>
          <select
            value={selectedYear}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4] bg-white"
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BirthdayPicker;
