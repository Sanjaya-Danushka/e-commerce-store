import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import countryCodesData from '../utils/CountryCodes.json';

const ProfilePage = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        // If user is already loaded in context, use it
        if (user) {
          setProfile(user);
          setEditFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phoneNumber: user.phoneNumber || '',
            addressLine1: user.addressLine1 || '',
            addressLine2: user.addressLine2 || '',
            city: user.city || '',
            state: user.state || '',
            postalCode: user.postalCode || '',
            country: user.country || 'US'
          });
          setLoading(false);
          return;
        }

        // Otherwise, try to fetch fresh profile data
        console.log('ProfilePage: Fetching fresh profile data...');
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData.user);
          setEditFormData({
            firstName: profileData.user.firstName || '',
            lastName: profileData.user.lastName || '',
            phoneNumber: profileData.user.phoneNumber || '',
            addressLine1: profileData.user.addressLine1 || '',
            addressLine2: profileData.user.addressLine2 || '',
            city: profileData.user.city || '',
            state: profileData.user.state || '',
            postalCode: profileData.user.postalCode || '',
            country: profileData.user.country || 'US'
          });
          console.log('ProfilePage: Profile loaded successfully', profileData.user);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('ProfilePage: Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('Please log in to view your profile');
    }
  }, [isAuthenticated, user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    let detectedCountry = editFormData.country;

    // Auto-detect country based on phone number prefix
    const cleanNumber = value.replace(/^\+\d+\s*/, '');

    for (const country of countryCodesData) {
      if (cleanNumber.startsWith(country.dial_code.replace('+', ''))) {
        detectedCountry = country.code;
        break;
      }
    }

    setEditFormData({
      ...editFormData,
      phoneNumber: value,
      country: detectedCountry
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfile(editFormData);

      if (result.success) {
        setProfile(result.user);
        setIsEditing(false);
        console.log('ProfilePage: Profile updated successfully');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('ProfilePage: Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phoneNumber: profile.phoneNumber || '',
      addressLine1: profile.addressLine1 || '',
      addressLine2: profile.addressLine2 || '',
      city: profile.city || '',
      state: profile.state || '',
      postalCode: profile.postalCode || '',
      country: profile.country || 'US'
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <Link
            to="/"
            className="mt-4 inline-block bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            Please log in to view your profile
          </div>
          <Link
            to="/login"
            className="mt-4 inline-block bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile Information</h1>
            <Link
              to="/"
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Go Home
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="text-center mb-8">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center ${profile.profilePicture ? 'hidden' : ''}`} style={{backgroundColor: '#D1D5DB'}}>
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>

          {/* Profile Information Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-sm text-gray-900">{profile.email}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-sm text-gray-900">{profile.firstName} {profile.lastName || ''}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editFormData.phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder={`Enter your phone number (e.g., ${countryCodesData.find(c => c.code === editFormData.country)?.dial_code || '+1'} 123 456 7890)`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-sm text-gray-900">{profile.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={editFormData.addressLine1}
                      onChange={handleEditChange}
                      placeholder="Street address"
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
                      value={editFormData.addressLine2}
                      onChange={handleEditChange}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city}
                        onChange={handleEditChange}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={editFormData.state}
                        onChange={handleEditChange}
                        placeholder="State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={editFormData.postalCode}
                        onChange={handleEditChange}
                        placeholder="ZIP/Postal code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={editFormData.country}
                        onChange={handleEditChange}
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
              ) : (
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Address:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {profile.addressLine1 ? `${profile.addressLine1}${profile.addressLine2 ? `, ${profile.addressLine2}` : ''}` : 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">City:</span>
                    <span className="ml-2 text-sm text-gray-900">{profile.city || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">State:</span>
                    <span className="ml-2 text-sm text-gray-900">{profile.state || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Postal Code:</span>
                    <span className="ml-2 text-sm text-gray-900">{profile.postalCode || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Country:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {profile.country ? `${countryCodesData.find(c => c.code === profile.country)?.flag || '🏳️'} ${countryCodesData.find(c => c.code === profile.country)?.name || profile.country}` : 'Not provided'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Profile Status:</span>
                  <span className={`ml-2 text-sm ${profile.profileCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                    {profile.profileCompleted ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Member Since:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 font-medium"
              >
                Go Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
