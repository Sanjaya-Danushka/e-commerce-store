import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, getProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, getProfile]);

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

  if (error) {
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {profile.profilePicture ? (
                  <img
                    className="h-24 w-24 rounded-full object-cover"
                    src={profile.profilePicture}
                    alt={`${profile.firstName} ${profile.lastName}`}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-600">{profile.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    profile.isEmailVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>

            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.firstName || 'Not provided'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.lastName || 'Not provided'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-4">
              <Link
                to="/orders"
                className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium"
              >
                View Orders
              </Link>
              <Link
                to="/wishlist"
                className="bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                View Wishlist
              </Link>
              <button
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => {
                  // TODO: Implement edit profile functionality
                  alert('Edit profile functionality will be implemented here');
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
