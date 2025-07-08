import React, { useState } from 'react';
import { Database, HardDrive, Wifi, WifiOff } from 'lucide-react';

const BackendToggle = () => {
  const [isSupabase, setIsSupabase] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleToggle = () => {
    if (!isSupabase) {
      // Switching to Supabase
      setIsSupabase(true);
      // Simulate connection check
      setTimeout(() => {
        setIsConnected(Math.random() > 0.5); // Random for demo
      }, 1000);
    } else {
      // Switching to localStorage
      setIsSupabase(false);
      setIsConnected(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`
            h-8 w-8 rounded-lg flex items-center justify-center mr-3
            ${isSupabase ? 'bg-green-100' : 'bg-blue-100'}
          `}>
            {isSupabase ? (
              <Database className={`h-4 w-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
            ) : (
              <HardDrive className="h-4 w-4 text-blue-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isSupabase ? 'Supabase' : 'Local Storage'}
            </p>
            <p className="text-xs text-gray-500">
              {isSupabase 
                ? (isConnected ? 'Connected' : 'Disconnected')
                : 'Offline mode'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          {isSupabase && (
            <div className="mr-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
          
          <button
            onClick={handleToggle}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${isSupabase ? 'bg-primary-500' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isSupabase ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        {isSupabase 
          ? 'Using cloud database for sync across devices'
          : 'Data stored locally on this device only'
        }
      </div>
    </div>
  );
};

export default BackendToggle;