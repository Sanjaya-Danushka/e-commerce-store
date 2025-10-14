import { User } from './models/User.js';
import { sequelize } from './models/index.js';

async function checkAllUsers() {
  try {
    console.log('Checking all users (admins and customers)...');

    // Sync database
    await sequelize.sync();

    // Find all users
    const allUsers = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isEmailVerified', 'createdAt']
    });

    console.log(`Found ${allUsers.length} total users:`);

    // Separate admins and customers
    const admins = allUsers.filter(user => user.role === 'admin');
    const customers = allUsers.filter(user => user.role === 'user');

    console.log(`\nAdmins (${admins.length}):`);
    admins.forEach(user => {
      console.log(`- ${user.email} (${user.firstName || 'No name'}) - Verified: ${user.isEmailVerified}`);
    });

    console.log(`\nCustomers (${customers.length}):`);
    customers.forEach(user => {
      console.log(`- ${user.email} (${user.firstName || 'No name'}) - Verified: ${user.isEmailVerified}`);
    });

  } catch (error) {
    console.error('Error checking all users:', error);
  } finally {
    process.exit(0);
  }
}

checkAllUsers();
