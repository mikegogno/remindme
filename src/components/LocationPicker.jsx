import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, X, Navigation } from 'lucide-react';

const LocationPicker = ({ 
  value, 
  onChange, 
  placeholder = "Search for locations...",
  label,
  showCurrentLocation = false,
  size = 'default',
  className = '',
  disabled = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const timeoutRef = useRef(null);

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
          setError('Failed to initialize location service');
        }
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          console.warn(`Google Places API not available, retrying... (${retryCount}/${maxRetries})`);
          setTimeout(initializeGoogleMaps, 500);
        } else {
          console.error('Google Places API failed to load after maximum retries');
          setError('Location service unavailable. Please refresh the page.');
        }
      }
    };

    // Start initialization immediately, then also listen for window load
    initializeGoogleMaps();
    
    // Also try after window load in case script loads later
    if (document.readyState === 'loading') {
      window.addEventListener('load', initializeGoogleMaps);
      return () => window.removeEventListener('load', initializeGoogleMaps);
    }
  }, []);

  // Update input value when value prop changes
  useEffect(() => {
    if (value) {
      setInputValue(value.description || value.formatted_address || value.name || '');
    } else {
      setInputValue('');
    }
  }, [value]);

  // Debounced search function
  const performSearch = (query) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    if (!autocompleteService.current) {
      console.warn('AutocompleteService not initialized yet');
      setError('Location service initializing, please try again...');
      return;
    }

    setIsLoading(true);
    setError(null);

    const request = {
      input: query,
      types: ['establishment', 'geocode']
      // Removed country restriction to allow global search
    };

    console.log('Performing Google Places search for:', query);

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsLoading(false);
      console.log('Google Places API response:', { status, predictions });
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setPredictions(predictions);
      } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        setPredictions([]);
      } else {
        console.error('Google Places API error:', status);
        setError(`Location service error: ${status}`);
        setPredictions([]);
      }
    });
  };

  // Handle input change with debouncing and 3-character minimum
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
  };

  // Get place details
  const getPlaceDetails = (placeId, prediction) => {
    if (!placesService.current) return;

    const request = {
      placeId: placeId,
      fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        const locationData = {
          place_id: place.place_id,
          name: place.name,
          description: prediction.description,
          formatted_address: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          types: place.types
        };
        
        onChange(locationData);
        setInputValue(prediction.description);
        setIsOpen(false);
        setPredictions([]);
      } else {
        setError('Failed to get place details');
      }
    });
  };

  // Handle prediction selection
  const handlePredictionSelect = (prediction) => {
    getPlaceDetails(prediction.place_id, prediction);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = new window.google.maps.LatLng(latitude, longitude);
          
          geocoder.geocode({ location: latlng }, (results, status) => {
            setIsGettingLocation(false);
            
            if (status === 'OK' && results[0]) {
              const place = results[0];
              const locationData = {
                place_id: place.place_id,
                name: 'Current Location',
                description: place.formatted_address,
                formatted_address: place.formatted_address,
                coordinates: {
                  lat: latitude,
                  lng: longitude
                },
                types: place.types || ['current_location']
              };
              
              onChange(locationData);
              setInputValue(place.formatted_address);
              setIsOpen(false);
            } else {
              setError('Failed to get address for current location');
            }
          });
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred while getting location');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
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

  // Handle input blur (with delay to allow for clicks)
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-sm py-2 px-3',
    default: 'text-base py-3 px-4',
    lg: 'text-lg py-4 px-5'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSizeClasses[size]}`} />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full pl-10 pr-12 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-[#5046E4] focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${sizeClasses[size]}
            `}
          />
          
          {/* Loading spinner or clear button */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {isLoading && (
              <Loader2 className={`animate-spin text-gray-400 ${iconSizeClasses[size]}`} />
            )}
            
            {inputValue && !isLoading && (
              <button
                type="button"
                onClick={clearSelection}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className={iconSizeClasses[size]} />
              </button>
            )}
          </div>
        </div>

        {/* Current location button */}
        {showCurrentLocation && (
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation || disabled}
            className={`
              mt-2 flex items-center space-x-2 text-sm text-[#5046E4] hover:text-[#4338CA]
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors
            `}
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>Use current location</span>
          </button>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-2 text-sm text-red-600 flex items-center space-x-1">
            <X className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Predictions dropdown */}
        {isOpen && predictions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                onClick={() => handlePredictionSelect(prediction)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-100 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {prediction.structured_formatting?.main_text || prediction.description}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {prediction.structured_formatting?.secondary_text || ''}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {isOpen && inputValue && !isLoading && predictions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="text-sm text-gray-500 text-center">
              No locations found for &quot;{inputValue}&quot;
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;