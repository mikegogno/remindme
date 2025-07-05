import React, { useEffect, useRef, useState } from 'react';

const AddressAutocomplete = ({ value, onChange, placeholder = "Enter address...", label = "Address" }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        // Load Google Maps API dynamically
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDummy_API_Key_Replace_With_Real_One&libraries=places`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            initAutocomplete();
          };
          
          script.onerror = () => {
            console.error('Failed to load Google Maps API');
            setIsLoaded(true); // Set to true to show fallback
          };
          
          document.head.appendChild(script);
        } else {
          initAutocomplete();
        }
      } catch (error) {
        console.error('Error loading Google Maps API:', error);
        setIsLoaded(true);
      }
    };

    const initAutocomplete = () => {
      if (inputRef.current && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          fields: ['formatted_address', 'geometry', 'place_id', 'name']
        });

        autocompleteRef.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            onChange({
              address: place.formatted_address,
              placeId: place.place_id,
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng()
            });
          }
        });
      }
      setIsLoaded(true);
    };

    initializeAutocomplete();

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  const handleInputChange = (e) => {
    // For manual typing when API is not available
    if (!window.google) {
      onChange({
        address: e.target.value,
        placeId: null,
        lat: null,
        lng: null
      });
    }
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
