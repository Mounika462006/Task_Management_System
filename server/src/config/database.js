const mongoose = require('mongoose');

// Cached connection reference.
// On Vercel, the Node.js process is reused across warm invocations.
// This guard prevents re-connecting (and exhausting Atlas connection pool) on every request.
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if Mongoose is already connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    const err = new Error('MONGODB_URI is not defined in environment variables');
    console.error(`[MongoDB] Configuration error: ${err.message}`);
    throw err;
  }

  const sanitizedUri = mongoUri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
  console.log(`[MongoDB] Connecting to: ${sanitizedUri}`);

  const options = {
    family: 4, // Force IPv4 to prevent Windows IPv6 / NAT64 cluster monitor timeouts
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    cachedConnection = conn;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;

