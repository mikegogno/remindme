import React, { useState, useEffect, useRef } from 'react';

const AddressPicker = ({ value, onChange, label = "Location (Optional)" }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    // Initialize Google Places API when component mounts
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);

    if (input.length > 2 && window.google && autocompleteService.current) {
      setIsLoading(true);
      
      autocompleteService.current.getPlacePredictions(
        {
          input: input,
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'us' } // Restrict to US for now
        },
        (predictions, status) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions.slice(0, 5)); // Limit to 5 suggestions
          } else {
            setPredictions([]);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handlePredictionClick = (prediction) => {
    setInputValue(prediction.description);
    setPredictions([]);
    
    // Get place details for more complete address information
    if (placesService.current) {
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['formatted_address', 'geometry', 'name', 'place_id']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const addressData = {
              formatted_address: place.formatted_address,
              name: place.name,
              place_id: place.place_id,
              latitude: place.geometry?.location?.lat(),
              longitude: place.geometry?.location?.lng()
            };
            onChange(addressData);
          }
        }
      );
    } else {
      // Fallback to basic string if Places service not available
      onChange({
        formatted_address: prediction.description,
        name: prediction.structured_formatting?.main_text || prediction.description
      });
    }
  };

  // Fallback for when Google Places API is not available
  const isGoogleMapsLoaded = window.google && window.google.maps && window.google.maps.places;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isGoogleMapsLoaded ? "Start typing an address..." : "Enter address manually"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5046E4] focus:border-[#5046E4] pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5046E4]"></div>
            </div>
          )}
        </div>

        {/* Predictions dropdown */}
        {predictions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                onClick={() => handlePredictionClick(prediction)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-start space-x-3">
                  <svg className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {prediction.structured_formatting?.main_text || prediction.description}
                    </p>
                    {prediction.structured_formatting?.secondary_text && (
                      <p className="text-xs text-gray-500 truncate">
                        {prediction.structured_formatting.secondary_text}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {!isGoogleMapsLoaded && (
        <p className="text-xs text-gray-500 mt-1">
          💡 Google Places API not available. You can still enter addresses manually.
        </p>
      )}
    </div>
  );
};

export default AddressPicker;