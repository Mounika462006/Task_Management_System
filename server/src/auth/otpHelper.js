const crypto = require('crypto');

/**
 * Generate a cryptographically secure 6-digit OTP
 */
const generateSecureOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Hash an OTP using SHA-256
 */
const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
};

/**
 * Verify an entered OTP against stored SHA-256 hash using timingSafeEqual
 */
const verifyOtpHash = (enteredOtp, storedHash) => {
  if (!enteredOtp || !storedHash) return false;
  const computedHash = hashOtp(enteredOtp);
  const bufA = Buffer.from(computedHash, 'hex');
  const bufB = Buffer.from(storedHash, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

module.exports = {
  generateSecureOtp,
  hashOtp,
  verifyOtpHash,
};
