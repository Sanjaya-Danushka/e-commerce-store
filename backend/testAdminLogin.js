import axios from 'axios';

async function testAdminLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/admin/login', {
      username: 'admin@example.com',
      password: 'admin123'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
    }
  }
}

testAdminLogin();
