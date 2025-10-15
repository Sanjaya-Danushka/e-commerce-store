#!/usr/bin/env node

/**
 * Demo Admin Setup Script
 *
 * Creates a demo admin user for testing purposes.
 * Run with: node scripts/create-demo-admin.js
 */

import { User } from '../backend/models/User.js';
import { sequelize } from '../backend/models/index.js';

async function createDemoAdmin() {
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Check if demo admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@example.com', role: 'admin' }
    });

    if (existingAdmin) {
      console.log('ℹ️  Demo admin already exists');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: Admin123!');
      return;
    }

    // Create demo admin
    await User.create({
      email: 'admin@example.com',
      password: 'Admin123!',
      firstName: 'Demo',
      lastName: 'Admin',
      role: 'admin',
      isEmailVerified: true,
      profileCompleted: true
    });

    console.log('✅ Demo admin created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: Admin123!');
    console.log('🛡️  Role: admin');
    console.log('✅ Email Verified: true');
    console.log('📋 Profile Completed: true');

  } catch (error) {
    console.error('❌ Error creating demo admin:', error.message);
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation errors:', error.errors.map(e => e.message));
    }
  } finally {
    await sequelize.close();
  }
}

// Run the script
createDemoAdmin();
