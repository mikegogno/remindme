import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';

const CalendarView = ({ reminders, onSelectDate, onViewReminder }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateReminders, setSelectedDateReminders] = useState([]);

  useEffect(() => {
    // Filter reminders for selected date
    if (reminders && reminders.length > 0) {
      const filteredReminders = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.remind_at);
        return isSameDay(reminderDate, selectedDate);
      });
      setSelectedDateReminders(filteredReminders);
      
      if (onSelectDate) {
        onSelectDate(selectedDate, filteredReminders);
      }
    }
  }, [selectedDate, reminders, onSelectDate]);

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next Month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="font-medium text-center text-sm text-gray-600 py-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        // Count reminders for this day
        const dayReminders = reminders.filter(reminder => {
          const reminderDate = new Date(reminder.remind_at);
          return isSameDay(reminderDate, cloneDay);
        });
        
        // Format the day
        const formattedDate = format(day, 'd');
        
        days.push(
          <div
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
            className={`relative h-24 border p-1 transition-colors ${
              !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700'
            } ${
              isSameDay(day, selectedDate) ? 'bg-blue-50 border-blue-300' : ''
            } ${
              isSameDay(day, new Date()) ? 'font-bold text-blue-600' : ''
            }`}
          >
            <span className="flex justify-between">
              {formattedDate}
              {dayReminders.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 bg-[#5046E4] text-white text-xs rounded-full">
                  {dayReminders.length}
                </span>
              )}
            </span>
            {dayReminders.length > 0 && (
              <div className="mt-1 overflow-hidden max-h-16">
                {dayReminders.slice(0, 2).map((reminder, index) => (
                  <div 
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewReminder && onViewReminder(reminder);
                    }}
                    className={`text-xs p-1 mb-1 truncate rounded cursor-pointer hover:opacity-80 ${
                      reminder.completed 
                        ? 'bg-green-100 text-green-800' 
                        : new Date(reminder.remind_at) < new Date() && !reminder.completed
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {reminder.title}
                  </div>
                ))}
                {dayReminders.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayReminders.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mb-4">{rows}</div>;
  };

  const renderSelectedDateReminders = () => {
    if (selectedDateReminders.length === 0) {
      return (
        <div className="text-center py-8">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No reminders</h3>
          <p className="mt-1 text-sm text-gray-500">
            No reminders scheduled for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h3 className="font-medium text-lg mb-2">
          Reminders for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <div className="space-y-2">
          {selectedDateReminders.map((reminder) => {
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

            return (
              <div
                key={reminder.id}
                className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                  reminder.completed 
                    ? 'bg-green-50 border-green-200' 
                    : new Date(reminder.remind_at) < new Date() && !reminder.completed
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200'
                }`}
                onClick={() => onViewReminder && onViewReminder(reminder)}
              >
                <div>
                  <h4 className={`font-medium ${
                    reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {reminder.title}
                  </h4>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 mt-1">
                      ⏰ {format(new Date(reminder.remind_at), 'h:mm a')}
                    </p>
                    <span className={`h-2 w-2 rounded-full ${
                      reminder.completed
                        ? 'bg-green-500'
                        : new Date(reminder.remind_at) < new Date() && !reminder.completed
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                    }`}></span>
                  </div>
                  {locationData && locationData.address && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <span>📍</span>
                      <span className="ml-1 truncate">{locationData.address}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
        <div className="border-l pl-4">
          {renderSelectedDateReminders()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;