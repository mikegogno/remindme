import React from 'react';
import LocationPicker from './LocationPicker';
import AddressAutocomplete from './AddressAutocomplete';

const TestAutocomplete = () => {
  const [location, setLocation] = React.useState(null);
  const [address, setAddress] = React.useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Test LocationPicker</h2>
          <LocationPicker
            value={location}
            onChange={setLocation}
            placeholder="Type at least 3 characters..."
            label="Location Test"
            showCurrentLocation={true}
          />
          {location && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <p className="text-sm text-green-800">
                Selected: {location.description || location.formatted_address}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Test AddressAutocomplete</h2>
          <AddressAutocomplete
            value={address}
            onChange={setAddress}
            placeholder="Type at least 3 characters..."
            label="Address Test"
          />
          {address && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                Selected: {address.address || address.description}
              </p>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Testing Instructions:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>1. Type &quot;na&quot; → No dropdown should appear</li>
            <li>2. Type &quot;nan&quot; → Dropdown should appear with suggestions</li>
            <li>3. Try &quot;2 nancy&quot; → Should show address suggestions</li>
            <li>4. API Key: AIzaSyB0Sdpa278GhhxAppSHlzTGaho1y3zplRg</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestAutocomplete;