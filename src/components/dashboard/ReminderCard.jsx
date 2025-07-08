import React from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { useReminders } from '../../context/RemindersContext';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

const ReminderCard = ({ reminder, onEdit, viewMode = 'grid' }) => {
  const { updateReminder, deleteReminder } = useReminders();

  const handleToggleComplete = () => {
    updateReminder(reminder.id, { ...reminder, completed: !reminder.completed });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder(reminder.id);
    }
  };

  const formatDate = (date) => {
    const reminderDate = new Date(date);
    if (isToday(reminderDate)) return 'Today';
    if (isTomorrow(reminderDate)) return 'Tomorrow';
    return format(reminderDate, 'MMM dd, yyyy');
  };

  const formatTime = (date) => {
    return format(new Date(date), 'h:mm a');
  };

  const isOverdue = isPast(new Date(reminder.dueDate)) && !reminder.completed;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className={`card p-4 animate-slide-up ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={handleToggleComplete}
              className={`p-1 rounded-full transition-colors duration-200 ${
                reminder.completed
                  ? 'text-green-600 hover:text-green-700'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {reminder.completed ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className={`text-lg font-medium ${
                  reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {reminder.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                  {reminder.priority}
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                )}
              </div>
              
              {reminder.description && (
                <p className={`mt-1 text-sm ${
                  reminder.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {reminder.description}
                </p>
              )}

              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(reminder.dueDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(reminder.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(reminder)}
              className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`card p-6 animate-slide-up hover:shadow-xl transition-all duration-300 ${
      isOverdue ? 'border-l-4 border-l-red-500' : ''
    } ${reminder.completed ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleComplete}
            className={`p-1 rounded-full transition-colors duration-200 ${
              reminder.completed
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {reminder.completed ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>
          {isOverdue && (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(reminder)}
            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition-colors duration-200"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className={`text-lg font-semibold ${
            reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {reminder.title}
          </h3>
          
          {reminder.description && (
            <p className={`mt-1 text-sm ${
              reminder.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {reminder.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
            {reminder.priority}
          </span>

          <div className="text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(reminder.dueDate)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatTime(reminder.dueDate)}</span>
            {isOverdue && (
              <span className="text-red-600 font-medium ml-2">• Overdue</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;