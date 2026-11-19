const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bizmind_ai';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[DB] MongoDB connection warning: ${err.message}`);
    console.warn(`[DB] Attempted URI: ${mongoUri}`);
    console.warn('[DB] Ensure MongoDB service is running (e.g. net start MongoDB) or provide a remote MONGO_URI in .env');
    // If running in development without MongoDB running, throw error or warn
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
