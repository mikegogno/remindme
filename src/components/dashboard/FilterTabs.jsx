import React from 'react';

const FilterTabs = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow">
        <div className="sm:hidden">
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-[#5046E4] focus:ring-[#5046E4]"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            {filters.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8 px-6" aria-label="Tabs">
              {filters.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeFilter === tab.id
                        ? 'border-[#5046E4] text-[#5046E4]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                  {tab.id !== 'all' && activeFilter === 'all' && tab.count > 0 && (
                    <span className={`ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block bg-gray-100 text-gray-800`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;