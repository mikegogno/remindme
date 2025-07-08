import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  List,
  Star,
  AlertCircle
} from 'lucide-react';

const FilterTabs = ({ filter, setFilter }) => {
  const tabs = [
    { id: 'all', label: 'All', icon: List },
    { id: 'active', label: 'Active', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'upcoming', label: 'Upcoming', icon: Star },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = filter === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`
                flex items-center px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200
                ${isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className={`
                h-5 w-5 mr-2
                ${isActive ? 'text-primary-500' : 'text-gray-400'}
              `} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FilterTabs;