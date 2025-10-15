import React, { useState } from 'react';
import axios from 'axios';

const AdminLoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Signup states
  const [showSignup, setShowSignup] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [isSignupVerification, setIsSignupVerification] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [passwordSetup, setPasswordSetup] = useState({
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setCredentials({
        ...credentials,
        [name]: value
      });
    } else if (name === 'password') {
      setCredentials({
        ...credentials,
        [name]: value
      });
    } else if (name === 'verificationCode') {
      setVerificationCode(value);
    } else if (name === 'signupEmail') {
      setSignupEmail(value);
    } else if (name.startsWith('passwordSetup.')) {
      const field = name.split('.')[1];
      setPasswordSetup({
        ...passwordSetup,
        [field]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login with:', credentials.email);

      // Use axios - Vite proxy will handle routing to backend
      const response = await axios.post('/api/auth/admin/login', credentials);

      console.log('Admin login response:', response.data);

      // Check if user needs email verification
      if (response.data.needsVerification) {
        setUserEmail(credentials.email);
        setShowVerification(true);
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('adminToken', response.data.token);

      // Redirect to admin panel
      window.location.href = '/admin';
    } catch (error) {
      console.error('Admin login error:', error);

      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.status === 404) {
        setError('Admin login endpoint not found');
      } else if (error.response?.status === 403) {
        setError('Email verification required');
        setUserEmail(credentials.email);
        setShowVerification(true);
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error - please check if backend server is running');
      } else {
        setError(`Login failed: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // Redirect to Google OAuth for admin (using proxy)
      window.location.href = '/api/auth/google?redirect=/admin';
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed');
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Debug: Show what code is being sent
    console.log('Sending verification code:', verificationCode);
    console.log('For email:', userEmail);

    try {
      const response = await axios.post('/api/auth/admin/verify-email', {
        email: userEmail,
        verificationCode: verificationCode
      });

      console.log('Email verification response:', response.data);

      // Store token in localStorage
      localStorage.setItem('adminToken', response.data.token);

      // Redirect to admin panel
      window.location.href = '/admin';
    } catch (error) {
      console.error('Email verification error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!userEmail) {
      setError('Please enter your email address first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Sending verification code request for email:', userEmail);

      const response = await axios.post('/api/auth/admin/send-verification', {
        email: userEmail
      });

      console.log('Send verification response:', response.data);

      // For testing: Store the code in a way that can be displayed
      // This is temporary for debugging - remove in production
      if (response.data && response.data.verificationCode) {
        console.log('VERIFICATION CODE SENT:', response.data.verificationCode);
        // Store in sessionStorage for debugging display
        sessionStorage.setItem('debugVerificationCode', response.data.verificationCode);
      }

      setError('');
    } catch (error) {
      console.error('Send verification error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Signup handlers
  const handleSignupStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/admin/signup', {
        email: signupEmail
      });

      setUserEmail(signupEmail);
      setShowSignup(false);
      setIsSignupVerification(true);
      setShowEmailSent(true);
    } catch (error) {
      console.error('Signup start error:', error);

      if (error.response?.status === 409) {
        setError('An account with this email already exists. Please use the login form to sign in instead.');
      } else {
        setError(error.response?.data?.error || 'Failed to start signup process');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Debug: Show what code is being sent for signup
    console.log('Signup verification - Sending code:', verificationCode);
    console.log('For email:', userEmail);

    try {
      const response = await axios.post('/api/auth/admin/signup/verify', {
        email: userEmail,
        verificationCode: verificationCode
      });

      console.log('Signup verification response:', response.data);

      setTempToken(response.data.tempToken);
      setShowVerification(false);
      setShowPasswordSetup(true);
    } catch (error) {
      console.error('Signup verification error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (passwordSetup.password !== passwordSetup.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/admin/signup/complete', {
        tempToken: tempToken,
        password: passwordSetup.password,
        firstName: passwordSetup.firstName,
        lastName: passwordSetup.lastName
      });

      // Store token and redirect
      localStorage.setItem('adminToken', response.data.token);
      window.location.href = '/admin';
    } catch (error) {
      console.error('Password setup error:', error);
      setError(error.response?.data?.error || 'Failed to complete signup');
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance from email sent to verification after 3 seconds
  React.useEffect(() => {
    let timer;
    if (showEmailSent) {
      timer = setTimeout(() => {
        setShowEmailSent(false);
        setShowVerification(true);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showEmailSent]);

  if (showSignup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Create Admin Account</h1>
            <p className="text-gray-600 mt-2">Enter your email to start the signup process</p>
          </div>

          <form onSubmit={handleSignupStart} className="space-y-6">
            <div>
              <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email:
              </label>
              <input
                type="email"
                id="signupEmail"
                name="signupEmail"
                value={signupEmail}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                autoComplete="off"
                data-form-type="signup"
                data-lpignore="true"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  {error.includes('already exists') && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignup(false);
                        setError('');
                        setSignupEmail('');
                      }}
                      className="text-red-800 hover:text-red-900 font-medium text-sm"
                    >
                      Go to Login
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Starting signup...' : 'Start Signup Process'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowSignup(false);
                  setError('');
                  setSignupEmail('');
                }}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Sending verification code...</h1>
            <p className="text-gray-600 mt-2">Please wait while we send a verification code to your email</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Verification code sent via email</p>
                <p className="text-xs text-blue-600">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setShowEmailSent(false);
                setShowVerification(true);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Continue to verification →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPasswordSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Complete Your Account</h1>
            <p className="text-gray-600 mt-2">Set up your password and profile information</p>
          </div>

          <form onSubmit={handlePasswordSetup} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name (Optional):
              </label>
              <input
                type="text"
                id="firstName"
                name="passwordSetup.firstName"
                value={passwordSetup.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                autoComplete="off"
                data-form-type="signup"
                data-lpignore="true"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name (Optional):
              </label>
              <input
                type="text"
                id="lastName"
                name="passwordSetup.lastName"
                value={passwordSetup.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                autoComplete="off"
                data-form-type="signup"
                data-lpignore="true"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="passwordSetup.password"
                value={passwordSetup.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="off"
                data-form-type="signup"
                data-lpignore="true"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="passwordSetup.confirmPassword"
                value={passwordSetup.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                autoComplete="off"
                data-form-type="signup"
                data-lpignore="true"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Admin Account'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordSetup(false);
                  setError('');
                  setPasswordSetup({
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: ''
                  });
                }}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showVerification) {
    // Get debug code from sessionStorage for testing
    const debugCode = sessionStorage.getItem('debugVerificationCode');

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Email Verification Required</h1>
            <p className="text-gray-600 mt-2">Enter the verification code sent to {userEmail}</p>

            {/* Debug section for testing - remove in production */}
            {debugCode && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">🔧 Debug Mode:</p>
                <p className="text-xs text-yellow-700">Verification code sent: <code className="font-mono bg-yellow-200 px-1 rounded">{debugCode}</code></p>
              </div>
            )}
          </div>

          <form onSubmit={isSignupVerification ? handleSignupVerification : handleVerificationSubmit} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code:
              </label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={handleChange}
                required
                placeholder="Enter 6-digit code"
                maxLength="6"
                autoComplete="off"
                data-form-type="verification"
                data-lpignore="true"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl tracking-widest"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Verifying...' : isSignupVerification ? 'Verify & Continue' : 'Verify & Login'}
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={sendVerificationCode}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Resend verification code'}
              </button>
              <br />
              <button
                type="button"
                onClick={() => {
                  setShowVerification(false);
                  setError('');
                  setVerificationCode('');
                  if (isSignupVerification) {
                    setShowSignup(true);
                    setIsSignupVerification(false);
                  }
                }}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Back to {isSignupVerification ? 'signup' : 'login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
              autoComplete="off"
              data-form-type="login"
              data-lpignore="true"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
              autoComplete="off"
              data-form-type="login"
              data-lpignore="true"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm font-semibold text-gray-800 mb-2">Need Help?</p>
          <p className="text-sm text-gray-600">Contact your system administrator if you need access to the admin panel.</p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            New to admin panel?{' '}
            <button
              type="button"
              onClick={() => {
                setShowSignup(true);
                setError('');
                setCredentials({ email: '', password: '' });
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create Admin Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
