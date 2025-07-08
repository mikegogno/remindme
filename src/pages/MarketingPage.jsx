import React, { useState } from 'react';
import { MapPin, Bell, Calendar, Star, ArrowRight, CheckCircle } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

const MarketingPage = () => {
  const [demoLocation, setDemoLocation] = useState(null);
  const [email, setEmail] = useState('');

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // TODO: Implement newsletter signup
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#5046E4] to-[#7C3AED] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Never Forget
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Important Things
                </span>
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                Smart, location-aware reminders that work with your lifestyle. Get notified at the right time and place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-white text-[#5046E4] rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                  Start Free Trial
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#5046E4] transition-colors duration-200">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-xl shadow-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Try Our Location Feature</h3>
                <LocationPicker
                  value={demoLocation}
                  onChange={setDemoLocation}
                  placeholder="Search for any location..."
                  showCurrentLocation={true}
                />
                {demoLocation && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Location Selected!</p>
                        <p className="text-sm text-green-700">{demoLocation.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Smart Reminders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RemindMe combines location intelligence with smart notifications to help you stay organized and never miss what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#5046E4] rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Location-Based Reminders</h3>
              <p className="text-gray-600 mb-4">
                Get reminded when you arrive at or leave specific locations. Perfect for grocery lists, meeting preparations, and more.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Automatic location detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Custom location radius</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Works with GPS and WiFi</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#5046E4] rounded-lg flex items-center justify-center mb-6">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Notifications</h3>
              <p className="text-gray-600 mb-4">
                Intelligent notification system that learns your patterns and adjusts timing for maximum effectiveness.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple notification channels</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Smart timing optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Customizable alert types</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#5046E4] rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600 mb-4">
                Create reminders for any time, date, or location. Recurring reminders and smart suggestions included.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Recurring reminders</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Priority levels</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Smart suggestions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section with Location Picker */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See Location Search in Action
            </h2>
            <p className="text-xl text-gray-600">
              Try our Google Places integration right here. Search for any address, business, or landmark.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="max-w-md mx-auto">
              <LocationPicker
                value={demoLocation}
                onChange={setDemoLocation}
                placeholder="Search for restaurants, stores, addresses..."
                showCurrentLocation={true}
                size="lg"
              />
              
              {demoLocation && (
                <div className="mt-6 p-6 bg-white rounded-xl shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3">Selected Location:</h4>
                  <div className="space-y-2">
                    <p className="text-gray-800">{demoLocation.name || demoLocation.description}</p>
                    <p className="text-sm text-gray-600">{demoLocation.formatted_address}</p>
                    {demoLocation.coordinates && (
                      <p className="text-xs text-gray-500">
                        Coordinates: {demoLocation.coordinates.lat.toFixed(6)}, {demoLocation.coordinates.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Perfect!</strong> You could now create a reminder like &quot;Buy groceries&quot; 
                      that triggers when you arrive at this location.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#5046E4] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Never Forget Again?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who rely on RemindMe to stay organized and on top of their important tasks.
          </p>
          
          <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-[#5046E4] rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <p className="text-sm text-purple-200 mt-4">
            Free 14-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default MarketingPage;