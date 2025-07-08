import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, User, MapPin, Bell, Check } from 'lucide-react';
import LocationPicker from '../LocationPicker';

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    homeAddress: null,
    workAddress: null,
    notificationsEnabled: true,
    defaultReminderTime: '09:00'
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to RemindMe!',
      description: 'Let\'s get you set up with everything you need to stay organized.',
      icon: User
    },
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us a bit about yourself so we can personalize your experience.',
      icon: User
    },
    {
      id: 'locations',
      title: 'Your Locations',
      description: 'Add your frequently visited places for location-based reminders.',
      icon: MapPin
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      description: 'Choose how you\'d like to be reminded about important tasks.',
      icon: Bell
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Your account is ready. Let\'s start creating your first reminder.',
      icon: Check
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(userData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return userData.name.trim() && userData.email.trim();
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-[#5046E4] rounded-full flex items-center justify-center mx-auto">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What you&apos;ll get:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Smart location-based reminders</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Customizable notification preferences</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Quick access to your favorite places</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5046E4] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5046E4] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5046E4] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5046E4] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Reminder Time
                </label>
                <input
                  type="time"
                  value={userData.defaultReminderTime}
                  onChange={(e) => setUserData(prev => ({ ...prev, defaultReminderTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5046E4] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'locations':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5046E4] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600 mb-4">{step.description}</p>
              <p className="text-sm text-gray-500">These are optional but help create smarter, location-aware reminders.</p>
            </div>
            
            <div className="space-y-6">
              <LocationPicker
                value={userData.homeAddress}
                onChange={(location) => setUserData(prev => ({ ...prev, homeAddress: location }))}
                placeholder="Enter your home address"
                label="Home Address"
                showCurrentLocation={true}
              />
              
              <LocationPicker
                value={userData.workAddress}
                onChange={(location) => setUserData(prev => ({ ...prev, workAddress: location }))}
                placeholder="Enter your work address"
                label="Work Address"
                showCurrentLocation={true}
              />
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Why add locations?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Get reminders when you arrive or leave places</li>
                <li>• Quick location selection when creating reminders</li>
                <li>• Smart suggestions based on your routine</li>
              </ul>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5046E4] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Browser Notifications</h3>
                  <p className="text-sm text-gray-600">Get desktop notifications for your reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userData.notificationsEnabled}
                    onChange={(e) => setUserData(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5046E4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5046E4]"></div>
                </label>
              </div>
              
              {userData.notificationsEnabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> You&apos;ll be asked to allow notifications when you create your first reminder. 
                    This helps ensure you never miss important tasks!
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Setup Summary:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{userData.name || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{userData.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Home Address:</span>
                  <span className="font-medium">{userData.homeAddress?.description ? 'Added' : 'Not added'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Work Address:</span>
                  <span className="font-medium">{userData.workAddress?.description ? 'Added' : 'Not added'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Notifications:</span>
                  <span className="font-medium">{userData.notificationsEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full">
        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#5046E4] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center space-x-2 px-6 py-2 bg-[#5046E4] text-white rounded-lg hover:bg-[#4338CA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;