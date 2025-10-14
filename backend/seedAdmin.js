import { User } from './models/User.js';
import { sequelize } from './models/index.js';
import bcrypt from 'bcrypt';

async function seedAdminUser() {
  try {
    console.log('Starting admin user seeding...');

    // Sync database (create tables if they don't exist)
    await sequelize.sync();
    console.log('Database synced');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com', role: 'admin' } });
    console.log('Checking for existing admin...');

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user (let the model hook hash the password)
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123', // Plain text password, will be hashed by the model hook
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true
    });

    console.log('Admin user created successfully:', adminUser.email);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    process.exit(0);
  }
}

seedAdminUser();
