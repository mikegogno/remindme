import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Calendar, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RemindMeLogo from './RemindMeLogo';
import BackendToggle from './BackendToggle';

const Layout = ({ children }) => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  // Only show navigation for authenticated users
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center" onClick={() => navigate('/app/dashboard')} style={{ cursor: 'pointer' }}>
              <RemindMeLogo size={32} />
              <span className="ml-2 text-xl font-semibold text-gray-900">RemindMe</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Header buttons/actions could go here */}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <BackendToggle />
              <button 
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <LogOut className="h-4 w-4 mr-1" /> 
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Navigation footer for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 md:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around h-16">
            <NavButton 
              icon={<Home className="h-6 w-6" />} 
              label="Home"
              isActive={location.pathname === '/app/dashboard'}
              onClick={() => navigate('/app/dashboard')}
            />
            <NavButton 
              icon={<Bell className="h-6 w-6" />} 
              label="Reminders" 
              isActive={location.pathname.includes('/app/reminders')}
              onClick={() => navigate('/app/reminders')}
            />
            <NavButton 
              icon={<Calendar className="h-6 w-6" />} 
              label="Calendar" 
              isActive={location.pathname.includes('/app/calendar')}
              onClick={() => navigate('/app/calendar')}
            />
            <NavButton 
              icon={<Settings className="h-6 w-6" />} 
              label="Settings" 
              isActive={location.pathname.includes('/app/settings')}
              onClick={() => navigate('/app/settings')}
            />
          </div>
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden md:block fixed inset-y-0 left-0 w-16 bg-white border-r border-gray-200 pt-16 z-0">
        <div className="h-full flex flex-col items-center pt-6 space-y-8">
          <NavButton 
            icon={<Home className="h-6 w-6" />} 
            label="Home"
            isActive={location.pathname === '/app/dashboard'}
            onClick={() => navigate('/app/dashboard')}
            sidebar
          />
          <NavButton 
            icon={<Bell className="h-6 w-6" />} 
            label="Reminders" 
            isActive={location.pathname.includes('/app/reminders')}
            onClick={() => navigate('/app/reminders')}
            sidebar
          />
          <NavButton 
            icon={<Calendar className="h-6 w-6" />} 
            label="Calendar" 
            isActive={location.pathname.includes('/app/calendar')}
            onClick={() => navigate('/app/calendar')}
            sidebar
          />
          <NavButton 
            icon={<Settings className="h-6 w-6" />} 
            label="Settings" 
            isActive={location.pathname.includes('/app/settings')}
            onClick={() => navigate('/app/settings')}
            sidebar
          />
        </div>
      </nav>
    </div>
  );
};

// Helper component for navigation buttons
const NavButton = ({ icon, label, isActive, onClick, sidebar = false }) => {
  const baseClasses = "flex flex-col items-center justify-center text-xs font-medium transition-colors duration-150";
  const activeClasses = isActive 
    ? "text-blue-600" 
    : "text-gray-500 hover:text-gray-900";
  const sidebarClasses = sidebar 
    ? "w-full py-3" 
    : "flex-1 py-1";

  return (
    <button 
      className={`${baseClasses} ${activeClasses} ${sidebarClasses}`} 
      onClick={onClick}
    >
      <div className={`${isActive && sidebar ? 'border-l-2 border-blue-600 pl-2' : ''}`}>
        {icon}
      </div>
      {!sidebar && <span className="mt-1">{label}</span>}
      {sidebar && (
        <div className="hidden group-hover:block absolute left-16 bg-gray-700 text-white px-2 py-1 rounded whitespace-nowrap">
          {label}
        </div>
      )}
    </button>
  );
};

export default Layout;