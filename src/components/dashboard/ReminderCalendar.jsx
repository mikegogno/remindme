import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

const ReminderCalendar = ({ reminders, onEditReminder }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getRemindersForDay = (day) => {
    return reminders.filter(reminder => isSameDay(new Date(reminder.dueDate), day));
  };



  return (
    <div className="card p-6 animate-fade-in">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map(day => {
          const dayReminders = getRemindersForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] p-2 border rounded-lg transition-colors duration-200 ${
                isCurrentMonth
                  ? isDayToday
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  : 'bg-gray-100 border-gray-100'
              }`}
            >
              <div className={`text-sm font-medium mb-2 ${
                isCurrentMonth
                  ? isDayToday
                    ? 'text-primary-600'
                    : 'text-gray-900'
                  : 'text-gray-400'
              }`}>
                {format(day, 'd')}
              </div>

              {/* Reminders for this day */}
              <div className="space-y-1">
                {dayReminders.slice(0, 3).map(reminder => (
                  <div
                    key={reminder.id}
                    onClick={() => onEditReminder(reminder)}
                    className={`p-1 rounded text-xs cursor-pointer transition-all duration-200 hover:shadow-sm ${
                      reminder.completed ? 'opacity-60' : ''
                    }`}
                    style={{
                      backgroundColor: reminder.priority === 'high' ? '#fef2f2' : 
                                     reminder.priority === 'medium' ? '#fffbeb' : '#f0fdf4',
                      borderLeft: `3px solid ${
                        reminder.priority === 'high' ? '#ef4444' :
                        reminder.priority === 'medium' ? '#f59e0b' : '#10b981'
                      }`
                    }}
                  >
                    <div className={`font-medium truncate ${
                      reminder.completed ? 'line-through' : ''
                    }`}>
                      {reminder.title}
                    </div>
                    <div className="text-gray-500 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(reminder.dueDate), 'HH:mm')}</span>
                    </div>
                  </div>
                ))}

                {/* Show more indicator */}
                {dayReminders.length > 3 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{dayReminders.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">High Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Medium Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Low Priority</span>
        </div>
      </div>
    </div>
  );
};

export default ReminderCalendar;