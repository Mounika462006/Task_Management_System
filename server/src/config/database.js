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

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
