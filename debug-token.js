// Simple JWT decoder to debug token contents
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return 'Invalid JWT format';
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    return 'Error decoding token: ' + error.message;
  }
}

// Check if there's a token in localStorage and decode it
const token = localStorage.getItem('adminToken');
if (token) {
  console.log('Token found in localStorage');
  console.log('Token length:', token.length);
  console.log('Token contents:', decodeJWT(token));
} else {
  console.log('No token found in localStorage');
}
