const mongoose = require('mongoose');

const connectDB = async () => {
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
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    const localUri = 'mongodb://127.0.0.1:27017/task_management';
    if (mongoUri !== localUri) {
      console.warn(`[MongoDB] Atlas/Primary cluster unreachable (likely IP whitelist). Falling back to local MongoDB: ${localUri}`);
      try {
        await mongoose.disconnect().catch(() => {});
        const localConn = await mongoose.connect(localUri, {
          family: 4,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
        });
        console.log(`[MongoDB] Connected successfully to local database: ${localConn.connection.host}/${localConn.connection.name}`);
        return localConn;
      } catch (localError) {
        console.error(`[MongoDB] Local fallback connection also failed: ${localError.message}`);
      }
    }
    throw error;
  }
};

module.exports = connectDB;
