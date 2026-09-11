const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const connectDB = require('./config/database');
const { verifyTransporter } = require('./config/mail');
const { ensureAdminUser } = require('./services/adminService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Ensure fixed Admin account is synchronized in MongoDB
    await ensureAdminUser();

    // Verify SMTP configuration at startup
    await verifyTransporter();

    const server = app.listen(PORT, () => {
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
