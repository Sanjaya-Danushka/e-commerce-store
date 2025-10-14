import { User } from './models/User.js';
import { sequelize } from './models/index.js';
import bcrypt from 'bcrypt';

async function debugAdminAccount() {
  try {
    console.log('Debugging admin@example.com account...');

    // Sync database
    await sequelize.sync();

    // Find the admin user with password
    const adminUser = await User.scope('withPassword').findOne({
      where: { email: 'admin@example.com' }
    });

    if (adminUser) {
      console.log('Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        passwordLength: adminUser.password ? adminUser.password.length : 0,
        isEmailVerified: adminUser.isEmailVerified,
        role: adminUser.role
      });

      // Test password check step by step
      if (adminUser.password) {
        console.log('Password exists, testing bcrypt compare...');

        // Test with the plain password "admin123"
        const isValid = await bcrypt.compare('admin123', adminUser.password);
        console.log('bcrypt.compare("admin123", hashedPassword):', isValid);

        // Also test the instance method
        const instanceCheck = await adminUser.checkPassword('admin123');
        console.log('adminUser.checkPassword("admin123"):', instanceCheck);

        // Show what the hashed password looks like
        console.log('Hashed password preview:', adminUser.password.substring(0, 20) + '...');
      } else {
        console.log('No password found for admin user!');
      }
    } else {
      console.log('Admin user not found');
    }

  } catch (error) {
    console.error('Error debugging admin account:', error);
  } finally {
    process.exit(0);
  }
}

debugAdminAccount();
