import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckCircle, 
  Settings, 
  Plus,
  AlertCircle,
  Clock
} from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    {
      name: 'Dashboard',
      to: '/app/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Calendar',
      to: '/app/calendar',
      icon: Calendar,
    },
    {
      name: 'All Reminders',
      to: '/app/reminders',
      icon: CheckCircle,
    },
    {
      name: 'Settings',
      to: '/app/settings',
      icon: Settings,
    },
  ];

  const quickActions = [
    {
      name: 'Add Reminder',
      icon: Plus,
      onClick: () => {
        // This would trigger the add reminder modal
        console.log('Add reminder clicked');
      },
    },
  ];

  const stats = [
    {
      name: 'Active',
      value: '12',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      name: 'Overdue',
      value: '3',
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ];

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-sm border-r border-gray-200 z-40">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="pt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={action.onClick}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                >
                  <action.icon className="h-5 w-5" />
                  <span>{action.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="pt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Overview
            </h3>
            <div className="space-y-2">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${stat.bg}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <span className="text-sm text-gray-600">{stat.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;