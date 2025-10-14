import axios from 'axios';

// Test admin login
async function testAdminLogin() {
  try {
    console.log('Testing admin login...');

    const response = await axios.post('http://localhost:3000/api/auth/admin/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data?.error);
    console.error('Full error:', error.message);
  }
}

testAdminLogin();
