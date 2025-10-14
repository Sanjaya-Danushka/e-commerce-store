import { User } from './models/User.js';
import { sequelize } from './models/index.js';

async function createTestAdmin() {
  try {
    console.log('Creating test admin account...');
    await sequelize.sync();

    const testAdmin = await User.create({
      email: 'test@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'Admin',
      role: 'admin',
      isEmailVerified: true
    });

    console.log('✅ Test admin created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: test123');

  } catch (error) {
    console.error('❌ Error creating test admin:', error);
  } finally {
    process.exit(0);
  }
}

createTestAdmin();
