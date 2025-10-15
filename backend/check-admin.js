import { User } from './models/User.js';
import { sequelize } from './models/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkAdminUser() {
  await sequelize.sync();
  const adminUsers = await User.findAll({ where: { role: 'admin' } });
  console.log('Admin users found:', adminUsers.length);
  adminUsers.forEach(user => {
    console.log('User:', user.email, 'Role:', user.role, 'ID:', user.id);
  });
}

checkAdminUser().catch(console.error);
