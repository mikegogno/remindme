import React, { useState } from 'react';
import { X, MapPin, Search, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

const LocationPicker = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const predefinedLocations = [
    { name: 'Home', address: 'Your home address' },
    { name: 'Work', address: 'Your workplace' },
    { name: 'Gym', address: 'Local fitness center' },
    { name: 'Grocery Store', address: 'Nearby supermarket' },
    { name: 'School', address: 'Educational institution' },
    { name: 'Hospital', address: 'Medical facility' },
    { name: 'Bank', address: 'Financial institution' },
    { name: 'Restaurant', address: 'Dining establishment' }
  ];

  const handleCurrentLocation = async () => {
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by this browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onSelect(locationString);
          toast.success('Current location selected');
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Failed to get current location');
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error accessing geolocation:', error);
      toast.error('Failed to access location services');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      const filtered = predefinedLocations.filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.address.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (location) => {
    onSelect(`${location.name} - ${location.address}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Select Location</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Current Location Button */}
      <button
        onClick={handleCurrentLocation}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium rounded-xl transition-all duration-200 border border-primary-200 mb-6 disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500 mr-2"></div>
            Getting location...
          </>
        ) : (
          <>
            <Navigation className="h-5 w-5 mr-2" />
            Use Current Location
          </>
        )}
      </button>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
        />
      </div>

      {/* Search Results */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
          <div className="space-y-2">
            {suggestions.map((location, index) => (
              <button
                key={index}
                onClick={() => handleSelectLocation(location)}
                className="w-full text-left p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
              >
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Predefined Locations */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Select</h3>
        <div className="grid grid-cols-2 gap-3">
          {predefinedLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(location)}
              className="p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 hover:shadow-md text-left"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{location.name}</p>
                  <p className="text-xs text-gray-500 truncate">{location.address}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Entry */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter custom location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                onSelect(searchTerm.trim());
              }
            }}
          />
          <button
            onClick={() => {
              if (searchTerm.trim()) {
                onSelect(searchTerm.trim());
              }
            }}
            disabled={!searchTerm.trim()}
            className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;