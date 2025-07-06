import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

const AddressAutocomplete = ({ value, onChange, placeholder = "Enter address...", label = "Address" }) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const timeoutRef = useRef(null);

  // Google Maps API Key
  const GOOGLE_MAPS_API_KEY = 'AIzaSyB0Sdpa278GhhxAppSHlzTGaho1y3zplRg';

  // Initialize Google Places services
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    
    const initializeGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          placesService.current = new window.google.maps.places.PlacesService(
            document.createElement('div')
          );
          console.log('Google Places API initialized successfully');
          setError(null);
        } catch (err) {
          console.error('Error initializing Google Places API:', err);
          setError('Failed to initialize address service');
        }
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          console.warn(`Google Places API not available, retrying... (${retryCount}/${maxRetries})`);
          setTimeout(initializeGoogleMaps, 500);
        } else {
          console.error('Google Places API failed to load after maximum retries');
          setError('Address service unavailable. Please refresh the page.');
        }
      }
    };

    initializeGoogleMaps();
    
    if (document.readyState === 'loading') {
      window.addEventListener('load', initializeGoogleMaps);
      return () => window.removeEventListener('load', initializeGoogleMaps);
    }
  }, []);

  // Update input value when value prop changes
  useEffect(() => {
    if (value) {
      setInputValue(value.address || value.formatted_address || value.description || '');
    } else {
      setInputValue('');
    }
  }, [value]);

  // Debounced search function - only trigger with 3+ characters
  const performSearch = (query) => {
    if (!query.trim() || query.length < 3) {
      setPredictions([]);
      return;
    }

    if (!autocompleteService.current) {
      console.warn('AutocompleteService not initialized yet');
      setError('Address service initializing, please try again...');
      return;
    }

    setIsLoading(true);
    setError(null);

    const request = {
      input: query,
      types: ['address']
    };

    console.log('Performing Google Places search for address:', query);

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsLoading(false);
      console.log('Google Places API response:', { status, predictions });
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setPredictions(predictions);
      } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        setPredictions([]);
      } else {
        console.error('Google Places API error:', status);
        setError(`Address service error: ${status}`);
        setPredictions([]);
      }
    });
  };

  // Handle input change with 3-character minimum trigger
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only show dropdown and search if we have 3+ characters
    if (newValue.length >= 3) {
      setIsOpen(true);
      // Set new timeout for debounced search
      timeoutRef.current = setTimeout(() => {
        performSearch(newValue);
      }, 300);
    } else {
      setIsOpen(false);
      setPredictions([]);
    }

    // For fallback when API is not available
    if (!window.google) {
      onChange({
        address: newValue,
        placeId: null,
        lat: null,
        lng: null
      });
    }
  };

  // Get place details
  const getPlaceDetails = (placeId, prediction) => {
    if (!placesService.current) return;

    const request = {
      placeId: placeId,
      fields: ['name', 'formatted_address', 'geometry', 'place_id']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        const addressData = {
          address: place.formatted_address,
          placeId: place.place_id,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng()
        };
        
        onChange(addressData);
        setInputValue(place.formatted_address);
        setIsOpen(false);
        setPredictions([]);
      } else {
        setError('Failed to get address details');
      }
    });
  };

  // Handle prediction selection
  const handlePredictionSelect = (prediction) => {
    getPlaceDetails(prediction.place_id, prediction);
  };

  // Clear selection
  const clearSelection = () => {
    setInputValue('');
    onChange(null);
    setIsOpen(false);
    setPredictions([]);
    inputRef.current?.focus();
  };

  // Handle input focus - only show dropdown if 3+ characters
  const handleFocus = () => {
    if (inputValue.length >= 3) {
      setIsOpen(true);
      if (predictions.length === 0) {
        performSearch(inputValue);
      }
    }
  };

  // Handle input blur
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4]"
      />
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          )}
          
          {error && (
            <div className="px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          
          {!isLoading && !error && predictions.length === 0 && inputValue.length >= 3 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No addresses found
            </div>
          )}
          
          {!isLoading && predictions.length > 0 && (
            <ul>
              {predictions.map((prediction) => (
                <li
                  key={prediction.place_id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handlePredictionSelect(prediction)}
                >
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {prediction.structured_formatting?.main_text || prediction.description}
                    </div>
                    {prediction.structured_formatting?.secondary_text && (
                      <div className="text-xs text-gray-500">
                        {prediction.structured_formatting.secondary_text}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {value && (
        <button
          type="button"
          onClick={clearSelection}
          className="absolute right-2 top-9 p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AddressAutocomplete;