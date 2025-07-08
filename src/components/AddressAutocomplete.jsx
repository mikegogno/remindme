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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={typeof value === 'string' ? value : value?.address || ''}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4]"
      />
      {!isLoaded && (
        <p className="text-xs text-gray-500 mt-1">Loading address suggestions...</p>
      )}
      {isLoaded && !window.google && (
        <p className="text-xs text-gray-500 mt-1">Manual address entry (Google Maps API not configured)</p>
      )}
    </div>
  );
};

export default AddressAutocomplete;