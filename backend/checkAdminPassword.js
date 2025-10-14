import { User } from './models/User.js';
import { sequelize } from './models/index.js';

async function checkAdminPassword() {
  try {
    console.log('Checking admin@example.com password...');

    // Sync database
    await sequelize.sync();

    // Find the admin user
    const adminUser = await User.scope('withPassword').findOne({
      where: { email: 'admin@example.com' }
    });

    if (adminUser) {
      console.log('Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        password: adminUser.password ? '[PASSWORD EXISTS]' : '[NO PASSWORD]',
        isEmailVerified: adminUser.isEmailVerified,
        role: adminUser.role
      });

      // Test password check
      if (adminUser.password) {
        const isValid = await adminUser.checkPassword('admin123');
        console.log('Password check result for "admin123":', isValid);
      }
    } else {
      console.log('Admin user not found');
    }

  } catch (error) {
    console.error('Error checking admin password:', error);
  } finally {
    process.exit(0);
  }
}

checkAdminPassword();
