import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import countryCodesData from '../utils/CountryCodes.json';

const ProfileCompletionModal = ({ isOpen, onClose, onComplete }) => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    phoneNumber: user?.phoneNumber || '',
    addressLine1: user?.addressLine1 || '',
    addressLine2: user?.addressLine2 || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
    country: user?.country || 'US'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      // Auto-detect country based on phone number prefix
      let detectedCountry = formData.country;

      // Remove any existing + or country code for detection
      const cleanNumber = value.replace(/^\+\d+\s*/, '');

      for (const country of countryCodesData) {
        if (cleanNumber.startsWith(country.dial_code.replace('+', ''))) {
          detectedCountry = country.code;
          break;
        }
      }

      setFormData({
        ...formData,
        [name]: value,
        country: detectedCountry
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('ProfileCompletionModal: Starting profile update process');

      if (!isAuthenticated) {
        setError('Authentication required. Please refresh the page and log in again.');
        setLoading(false);
        return;
      }

      console.log('ProfileCompletionModal: User is authenticated, updating profile...');

      const result = await updateProfile({
        ...formData,
        profileCompleted: true
      });

      console.log('ProfileCompletionModal: Update result:', result);

      if (result.success) {
        console.log('ProfileCompletionModal: Profile updated successfully');
        onComplete(result.user);
        onClose();
      } else {
        console.error('ProfileCompletionModal: Update failed:', result.error);
        setError(result.error || 'Failed to save profile information');
      }
    } catch (error) {
      console.error('ProfileCompletionModal: Exception during update:', error);
      if (error.response?.status === 401) {
        setError('Authentication expired. Please refresh the page and log in again.');
      } else {
        setError('Failed to save profile information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    console.log('ProfileCompletionModal: User chose to skip profile completion');

    if (!isAuthenticated) {
      setError('Authentication required. Please refresh the page and log in again.');
      return;
    }

    try {
      const result = await updateProfile({ profileCompleted: true });

      if (result.success) {
        console.log('ProfileCompletionModal: Profile skip successful');
        onComplete(result.user);
        onClose();
      } else {
        console.error('ProfileCompletionModal: Skip failed:', result.error);
        setError(result.error || 'Failed to skip profile completion');
      }
    } catch (error) {
      console.error('ProfileCompletionModal: Skip error:', error);
      if (error.response?.status === 401) {
        setError('Authentication expired. Please refresh the page and log in again.');
      } else {
        setError('Failed to skip profile completion. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
            <p className="text-gray-600">Please add your shipping information for faster checkout</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder={`Enter your phone number (e.g., ${countryCodesData.find(c => c.code === formData.country)?.dial_code || '+1'} 123 456 7890)`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Country will be auto-detected as you type
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Street address"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="ZIP/Postal code"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      {countryCodesData.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag || '🏳️'} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 font-medium"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
