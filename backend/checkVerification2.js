import { User } from './models/User.js';
import { sequelize } from './models/index.js';

async function checkUserVerification() {
  try {
    console.log('Checking user verification data for lykejagu@fxzig.com...');

    // Sync database
    await sequelize.sync();

    // Find the specific user
    const user = await User.findOne({
      where: { email: 'lykejagu@fxzig.com' },
      attributes: ['id', 'email', 'emailVerificationToken', 'emailVerificationExpires', 'isEmailVerified']
    });

    if (user) {
      console.log('User found:', {
        id: user.id,
        email: user.email,
        verificationToken: user.emailVerificationToken,
        verificationExpires: user.emailVerificationExpires,
        isEmailVerified: user.isEmailVerified
      });

      // Check if token is expired
      if (user.emailVerificationExpires) {
        const isExpired = new Date() > new Date(user.emailVerificationExpires);
        console.log('Token expired:', isExpired);
      }
    } else {
      console.log('User not found');
    }

  } catch (error) {
    console.error('Error checking user verification:', error);
  } finally {
    process.exit(0);
  }
}

checkUserVerification();
