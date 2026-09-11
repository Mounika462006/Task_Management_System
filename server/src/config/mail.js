const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const nodemailer = require('nodemailer');

/**
 * Creates and configures Nodemailer transporter reading strictly from process.env.
 * Never hardcodes credentials or exposes secrets.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER || 'taskflow.portal@gmail.com';
  const pass = process.env.SMTP_PASSWORD;

  if (!pass) {
    console.error('[EmailService] CRITICAL WARNING: SMTP_PASSWORD is not set in environment!');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // false for port 587 STARTTLS
    auth: {
      user,
      pass,
    },
  });
}

const transporter = createTransporter();

/**
 * Built-in connection verification test at startup.
 * Fails fast with clear log message if SMTP credentials or network connection fail.
 */
async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log(`[EmailService] SMTP connection verified successfully on ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${process.env.SMTP_PORT || '587'}`);
    return true;
  } catch (error) {
    // Log safe error message without echoing auth details or passwords
    console.error(`[EmailService] SMTP connection verification failed: ${error.message}`);
    return false;
  }
}

module.exports = {
  transporter,
  verifyTransporter,
  fromEmail: process.env.EMAIL_FROM || '"TaskFlow System" <taskflow.portal@gmail.com>',
  adminEmail: process.env.ADMIN_EMAIL || 'admin.taskflow@gmail.com',
};
