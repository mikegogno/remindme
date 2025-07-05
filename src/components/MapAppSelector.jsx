import React, { useState, useEffect } from 'react';

const MapAppSelector = ({ address, lat, lng, onClose }) => {
  const [defaultApp, setDefaultApp] = useState('');

  useEffect(() => {
    // Load user's default preference
    const savedDefault = localStorage.getItem('defaultMapApp');
    if (savedDefault) {
      setDefaultApp(savedDefault);
    }
  }, []);

  const mapApps = [
    {
      id: 'google',
      name: 'Google Maps',
      icon: '🗺️',
      getUrl: () => {
        if (lat && lng) {
          return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      }
    },
    {
      id: 'apple',
      name: 'Apple Maps',
      icon: '🍎',
      getUrl: () => {
        if (lat && lng) {
          return `maps://maps.apple.com/?q=${lat},${lng}`;
        }
        return `maps://maps.apple.com/?q=${encodeURIComponent(address)}`;
      }
    },
    {
      id: 'waze',
      name: 'Waze',
      icon: '🚗',
      getUrl: () => {
        if (lat && lng) {
          return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        }
        return `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
      }
    }
  ];

  const handleAppSelect = (app, setAsDefault = false) => {
    if (setAsDefault) {
      localStorage.setItem('defaultMapApp', app.id);
      setDefaultApp(app.id);
    }
    
    window.open(app.getUrl(), '_blank');
    onClose();
  };

  const handleDefaultAppOpen = () => {
    const app = mapApps.find(app => app.id === defaultApp);
    if (app) {
      handleAppSelect(app);
    }
  };

  // If user has a default app and this is their first click, open directly
  useEffect(() => {
    if (defaultApp && localStorage.getItem('defaultMapApp')) {
      // Small delay to show the modal briefly
      const timer = setTimeout(() => {
        handleDefaultAppOpen();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [defaultApp]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Open Address</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">📍 {address}</p>
        </div>

        {defaultApp && (
          <div className="mb-4 p-3 bg-[#5046E4] bg-opacity-10 rounded-lg">
            <p className="text-sm text-[#5046E4] font-medium">
              Opening with your default app ({mapApps.find(app => app.id === defaultApp)?.name})...
            </p>
          </div>
        )}

        <div className="space-y-2">
          {mapApps.map((app) => (
            <div key={app.id} className="flex items-center justify-between">
              <button
                onClick={() => handleAppSelect(app)}
                className="flex-1 flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <span className="text-2xl">{app.icon}</span>
                <span className="font-medium text-gray-900">{app.name}</span>
                {defaultApp === app.id && (
                  <span className="text-xs bg-[#5046E4] text-white px-2 py-1 rounded">Default</span>
                )}
              </button>
              {defaultApp !== app.id && (
                <button
                  onClick={() => handleAppSelect(app, true)}
                  className="ml-2 text-xs text-[#5046E4] hover:text-[#4036D4] font-medium"
                >
                  Set Default
                </button>
              )}
            </div>
          ))}
        </div>

        {defaultApp && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => {
                localStorage.removeItem('defaultMapApp');
                setDefaultApp('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear default app preference
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapAppSelector;
