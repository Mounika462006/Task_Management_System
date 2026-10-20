const fs = require('fs');
const path = require('path');
const serverEnvPath = path.resolve(__dirname, '../.env');
const rootEnvPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(serverEnvPath)) {
  require('dotenv').config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security headers
app.use(helmet());

// CORS configuration for secure cookie credentials
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [
  clientUrl,
  'https://task-management-system-two-xi.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.vercel.app') ||
        (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked origin: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Cookie parsing
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is operational',
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic email health check endpoint
app.get('/api/health/email', async (req, res) => {
  try {
    const { verifyTransporter, sendEmail } = require('./config/mail');
    const isVerified = await verifyTransporter();

    if (!isVerified) {
      throw new Error(
        process.env.RESEND_API_KEY
          ? 'Resend API key verification failed'
          : 'Email transporter verification failed (check RESEND_API_KEY or SMTP credentials)'
      );
    }

    // If a ?to=email is passed, send a lightweight test verification email
    const testTo = req.query.to;
    let mailSent = false;
    let messageId = null;

    if (testTo && testTo.includes('@')) {
      const info = await sendEmail({
        from: process.env.EMAIL_FROM || '"TaskFlow System" <taskflow.portal@gmail.com>',
        to: testTo.trim(),
        subject: 'TaskFlow - Email Verification Test',
        text: 'This is a test notification confirming that TaskFlow email dispatch is fully operational!',
        html: '<div style="font-family:sans-serif;padding:20px;border:1px solid #e2e8f0;border-radius:8px;"><h3>TaskFlow Email Test</h3><p>Your cloud server can successfully send emails!</p></div>',
      });
      mailSent = true;
      messageId = info.messageId;
    }

    const activeMode = process.env.BREVO_API_KEY
      ? 'Brevo HTTP API (Sends to ANY email)'
      : process.env.RESEND_API_KEY
      ? 'Resend HTTP API'
      : 'Nodemailer SMTP (Local)';

    res.status(200).json({
      success: true,
      message: 'Email service verified successfully',
      mode: activeMode,
      mailSent,
      messageId,
      configuredUser: process.env.BREVO_API_KEY
        ? `Brevo (${process.env.BREVO_SENDER || process.env.SMTP_USER || 'Admin'})`
        : process.env.RESEND_API_KEY
        ? 'Resend API'
        : (process.env.SMTP_USER || 'taskflow.portal@gmail.com'),
      hasPassword: Boolean(process.env.BREVO_API_KEY || process.env.RESEND_API_KEY || process.env.SMTP_PASSWORD),
    });
  } catch (error) {
    console.error('[EmailService] Email verification endpoint error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message,
      hasBrevoKey: Boolean(process.env.BREVO_API_KEY),
      hasResendKey: Boolean(process.env.RESEND_API_KEY),
      hasPassword: Boolean(process.env.SMTP_PASSWORD),
      hint: 'Add BREVO_API_KEY (to send to ANY email) or RESEND_API_KEY in Render Environment Variables.',
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Catch 404 for non-existent endpoints
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
