const nodemailer = require('nodemailer');

/**
 * Creates and configures Nodemailer transporter reading strictly from process.env.
 * Never hardcodes credentials or exposes secrets.
 */
function createTransporter() {
  const user = process.env.SMTP_USER || 'taskflow.portal@gmail.com';
  const pass = process.env.SMTP_PASSWORD;

  if (!pass) {
    console.error('[EmailService] CRITICAL WARNING: SMTP_PASSWORD is not set in environment!');
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';

  // For Gmail, service: 'gmail' automatically manages SSL/port 465 and avoids STARTTLS stalls
  if (host === 'smtp.gmail.com') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
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
