import { User } from './models/User.js';
import { sequelize } from './models/index.js';

async function checkAdminUsers() {
  try {
    console.log('Checking admin users...');

    // Sync database
    await sequelize.sync();

    // Find all admin users
    const adminUsers = await User.findAll({
      where: { role: 'admin' },
      attributes: ['id', 'email', 'firstName', 'lastName', 'isEmailVerified', 'createdAt']
    });

    console.log('Found admin users:', adminUsers.length);
    adminUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.firstName} ${user.lastName}, Verified: ${user.isEmailVerified}`);
    });

  } catch (error) {
    console.error('Error checking admin users:', error);
  } finally {
    process.exit(0);
  }
}

checkAdminUsers();
