import React, { useState, useEffect } from 'react';

const MapAppSelector = ({ address, onClose, onSelect }) => {
  const [defaultApp, setDefaultApp] = useState('');

  useEffect(() => {
    // Load default map app preference from localStorage
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
      getUrl: (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    },
    {
      id: 'apple',
      name: 'Apple Maps',
      icon: '🍎',
      getUrl: (address) => `http://maps.apple.com/?q=${encodeURIComponent(address)}`
    },
    {
      id: 'waze',
      name: 'Waze',
      icon: '🚗',
      getUrl: (address) => `https://waze.com/ul?q=${encodeURIComponent(address)}`
    },
    {
      id: 'bing',
      name: 'Bing Maps',
      icon: '🔍',
      getUrl: (address) => `https://www.bing.com/maps?q=${encodeURIComponent(address)}`
    }
  ];

  const handleAppSelect = (app, setAsDefault = false) => {
    if (setAsDefault) {
      localStorage.setItem('defaultMapApp', app.id);
      setDefaultApp(app.id);
    }
    
    // Open the map app
    window.open(app.getUrl(address), '_blank');
    
    onSelect(app);
    onClose();
  };

  const handleSetDefaultAndOpen = (app) => {
    handleAppSelect(app, true);
  };

  // If there's a default app, open it directly
  if (defaultApp) {
    const app = mapApps.find(a => a.id === defaultApp);
    if (app) {
      setTimeout(() => {
        window.open(app.getUrl(address), '_blank');
        onClose();
      }, 100);
      return null;
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Open with Map App</h3>
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
            <p className="text-sm text-gray-600 mb-2">Address:</p>
            <p className="text-sm bg-gray-50 p-2 rounded border">{address}</p>
          </div>

          <div className="space-y-2">
            {mapApps.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <button
                  onClick={() => handleAppSelect(app)}
                  className="flex items-center space-x-3 flex-1 text-left"
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className="font-medium text-gray-900">{app.name}</span>
                </button>
                <button
                  onClick={() => handleSetDefaultAndOpen(app)}
                  className="text-xs bg-[#5046E4] hover:bg-[#4036D4] text-white px-3 py-1 rounded-full transition-colors"
                >
                  Set Default
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              💡 Setting a default will automatically open that app next time
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapAppSelector;