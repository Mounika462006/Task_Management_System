const User = require('../models/User');

/**
 * Ensures the fixed Admin account configured in process.env.ADMIN_EMAIL
 * and process.env.ADMIN_PASSWORD exists and is synchronized in MongoDB.
 * Preserves the existing Admin document's _id so existing tasks remain linked.
 */
const ensureAdminUser = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin.taskflow@gmail.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    // 1. Look for admin by the configured email
    let admin = await User.findOne({ email: adminEmail }).select('+password');

    // 2. If not found, look for any existing admin (e.g. from seed) to update in-place
    if (!admin) {
      admin = await User.findOne({ role: 'ADMIN' }).select('+password');
      if (admin) {
        admin.email = adminEmail;
        admin.name = 'TaskFlow Admin';
        admin.password = adminPassword;
        await admin.save();
        console.log(`[Auth] Existing Admin account (${admin._id}) migrated to fixed email: ${adminEmail}`);
        return admin;
      }
    }

    // 3. If no admin exists at all in the database, create one
    if (!admin) {
      admin = await User.create({
        name: 'TaskFlow Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        emailVerified: true,
      });
      console.log(`[Auth] Fixed Admin account created: ${adminEmail}`);
      return admin;
    }

    // 4. If admin exists with adminEmail, verify password is in sync with process.env.ADMIN_PASSWORD
    const isMatch = await admin.comparePassword(adminPassword);
    if (!isMatch) {
      admin.password = adminPassword;
      await admin.save();
      console.log(`[Auth] Fixed Admin account password synchronized in database`);
    }

    return admin;
  } catch (error) {
    console.error(`[Auth] Error ensuring fixed Admin user: ${error.message}`);
  }
};

module.exports = {
  ensureAdminUser,
};
