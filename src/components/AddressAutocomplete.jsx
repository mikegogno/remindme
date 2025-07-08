import React, { useState, useEffect, useRef } from 'react';

const AddressAutocomplete = ({ value, onChange, placeholder, label }) => {
  const [address, setAddress] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteRef = useRef(null);
  
  useEffect(() => {
    // Convert value object to string for display
    if (value) {
      if (typeof value === 'string') {
        setAddress(value);
      } else if (value.address) {
        setAddress(value.address);
      }
    } else {
      setAddress('');
    }
  }, [value]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    
    if (value.length > 2) {
      // Simulate API call with setTimeout
      setIsLoading(true);
      setShowDropdown(true);
      
      // Mock geocoding API - in production, replace with actual API call
      setTimeout(() => {
        // Generate mock predictions based on input
        const mockPredictions = [
          {
            description: value + ' Street, New York, NY',
            place_id: 'place1',
            structured_formatting: {
              main_text: value + ' Street',
              secondary_text: 'New York, NY'
            },
            lat: 40.7128,
            lng: -74.006
          },
          {
            description: value + ' Avenue, Los Angeles, CA',
            place_id: 'place2',
            structured_formatting: {
              main_text: value + ' Avenue',
              secondary_text: 'Los Angeles, CA'
            },
            lat: 34.0522,
            lng: -118.2437
          },
          {
            description: value + ' Road, Chicago, IL',
            place_id: 'place3',
            structured_formatting: {
              main_text: value + ' Road',
              secondary_text: 'Chicago, IL'
            },
            lat: 41.8781,
            lng: -87.6298
          }
        ];
        
        setPredictions(mockPredictions);
        setIsLoading(false);
      }, 300);
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };
  
  const handleSelect = (prediction) => {
    setAddress(prediction.description);
    onChange({
      address: prediction.description,
      lat: prediction.lat,
      lng: prediction.lng,
      place_id: prediction.place_id
    });
    setPredictions([]);
    setShowDropdown(false);
  };
  
  return (
    <div ref={autocompleteRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label || 'Location'}
      </label>
      <input
        type="text"
        placeholder={placeholder || "Enter location..."}
        value={address}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4]"
      />
      
      {showDropdown && (
        <div className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">Loading...</div>
          ) : predictions.length > 0 ? (
            predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                onClick={() => handleSelect(prediction)}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
              >
                <div className="font-medium">{prediction.structured_formatting.main_text}</div>
                <div className="text-sm text-gray-500">{prediction.structured_formatting.secondary_text}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;