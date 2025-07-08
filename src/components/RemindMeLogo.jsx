import React from 'react';
import { Bell, Clock } from 'lucide-react';

const RemindMeLogo = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
    xl: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-3">
        <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
          <Bell className={`${iconSizes[size]} text-white`} />
        </div>
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center">
          <Clock className="h-2 w-2 text-yellow-800" />
        </div>
      </div>
      <div>
        <h1 className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent`}>
          RemindMe
        </h1>
        <p className="text-xs text-gray-500 -mt-1">Never forget again</p>
      </div>
    </div>
  );
};

export default RemindMeLogo;