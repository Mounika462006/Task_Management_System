const fs = require('fs');
const path = require('path');

// Load .env for local development (server/.env or root/.env).
// On Vercel, environment variables are injected automatically — dotenv is a no-op when .env is absent.
const serverEnvPath = path.resolve(__dirname, '../.env');
const rootEnvPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(serverEnvPath)) {
  require('dotenv').config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else {
  require('dotenv').config();
}

const connectDB = require('./config/database');
const { verifyTransporter } = require('./config/mail');
const { ensureAdminUser, ensureDefaultEmployees } = require('./services/adminService');

/**
 * Lazy initialization promise.
 * Ensures MongoDB connection + admin/employee seeding runs only once per
 * process lifetime — both on Vercel warm invocations and local dev restarts.
 * On failure the promise is cleared so the next request can retry.
 */
let initPromise = null;

const initialize = async () => {
  await connectDB();
  await ensureAdminUser().catch((e) => console.error('[Init] Admin init error:', e.message));
  await ensureDefaultEmployees().catch((e) => console.error('[Init] Employees init error:', e.message));
  verifyTransporter().catch((e) => console.error('[EmailService] SMTP check error:', e.message));
  return require('./app');
};

const getApp = () => {
  if (!initPromise) {
    initPromise = initialize().catch((err) => {
      initPromise = null; // allow retry on next request
      throw err;
    });
  }
  return initPromise;
};

/**
 * Vercel serverless entry point.
 * Vercel calls module.exports as the HTTP handler for every request.
 * The Express app is initialized lazily before the first request is served.
 */
const handler = (req, res) => {
  getApp()
    .then((app) => app(req, res))
    .catch((err) => {
      console.error('[Server] Fatal initialization error:', err.message);
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable. Please try again in a moment.',
        });
      }
    });
};

// Start HTTP server only in local development.
// Vercel automatically sets process.env.VERCEL = '1' in its runtime.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  getApp()
    .then((app) => {
      const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(
          `[TaskFlow Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`
        );
      });

      const shutdown = (signal) => {
        console.log(`\n[TaskFlow Server] Received ${signal}. Closing HTTP server gracefully...`);
        server.close(() => {
          console.log('[TaskFlow Server] HTTP server closed.');
          process.exit(0);
        });
      };

      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGINT', () => shutdown('SIGINT'));
    })
    .catch((err) => {
      console.error(`[TaskFlow Server] Failed to start: ${err.message}`);
      process.exit(1);
    });
}

// Export handler for Vercel serverless runtime
module.exports = handler;
