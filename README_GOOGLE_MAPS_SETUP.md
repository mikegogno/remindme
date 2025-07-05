# Google Maps API Setup Instructions

## Required Setup for Address Functionality

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - **Places API** (for address autocomplete)
   - **Maps JavaScript API** (for map functionality)

### 2. Generate API Key
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### 3. Configure API Key Restrictions (Recommended)
1. Click on your API key to edit it
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain(s): `your-domain.com/*`, `localhost:*` for development
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose "Places API" and "Maps JavaScript API"

### 4. Update the Code
Replace the dummy API key in `src/components/AddressAutocomplete.jsx`:

```javascript
// Line 12 in AddressAutocomplete.jsx
apiKey: 'YOUR_ACTUAL_GOOGLE_MAPS_API_KEY_HERE',
```

### 5. Database Schema Update
The reminders table now includes a `location` column to store address data. If using Supabase, run this SQL:

```sql
ALTER TABLE reminders ADD COLUMN location TEXT;
```

## Features Implemented

✅ **Address Autocomplete**: Google Places API integration for smart address suggestions
✅ **Location Storage**: Addresses are saved with reminders including coordinates
✅ **Clickable Addresses**: Users can click address links to open in map apps
✅ **Map App Selector**: Choose between Google Maps, Apple Maps, and Waze
✅ **Default App Preference**: Set and remember preferred map application
✅ **Fallback Support**: Works even without API key (manual input only)

## Testing Without API Key
The app will still work without a valid Google Maps API key - users can manually type addresses, but won't get autocomplete suggestions.

## Cost Considerations
- Google Places API: $17 per 1,000 requests (first $200/month free)
- Most small apps stay within free tier limits
- Consider setting usage quotas in Google Cloud Console
