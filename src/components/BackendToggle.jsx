import React from 'react';
import { useAuth } from '../context/AuthContext';

// A component that allows users to switch between Supabase and localStorage backends
const BackendToggle = () => {
  const { isUsingSupabase, toggleStorageBackend } = useAuth();
  
  const handleToggle = () => {
    // Toggle the storage backend
    toggleStorageBackend(!isUsingSupabase);
    
    // Reload the page to ensure proper initialization with the new backend
    window.location.reload();
  };
  
  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-500 mr-2">Backend:</span>
      <button
        onClick={handleToggle}
        className={`px-3 py-1 rounded text-xs font-medium ${
          isUsingSupabase
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }`}
      >
        {isUsingSupabase ? 'Supabase' : 'LocalStorage'}
      </button>
    </div>
  );
};

export default BackendToggle;