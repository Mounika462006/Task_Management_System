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
const app = require('./app');
const connectDB = require('./config/database');
const { verifyTransporter } = require('./config/mail');
const { ensureAdminUser, ensureDefaultEmployees } = require('./services/adminService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Ensure fixed Admin account is synchronized in MongoDB
    await ensureAdminUser();

    // Ensure initial employee accounts exist for task assignments
    await ensureDefaultEmployees();

    // Verify SMTP configuration in background without blocking server startup
    verifyTransporter().catch((err) => console.error('[EmailService] SMTP check error:', err.message));

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[TaskFlow Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n[TaskFlow Server] Received ${signal}. Closing HTTP server gracefully...`);
      server.close(() => {
        console.log('[TaskFlow Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error(`[TaskFlow Server] Failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = { startServer };
