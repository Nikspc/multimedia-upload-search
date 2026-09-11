const mongoose = require("mongoose");

let isConnected = false;

async function connectDB(uri) {
  // Use passed URI or fall back to either environment variable name
  const mongoUri = uri || process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Neither MONGO_URI nor MONGODB_URI is defined in environment variables");
  }

  // 1 = connected, 2 = connecting
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  mongoose.set("strictQuery", true);

  const db = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false, // Prevents queries from buffering and hanging for 10s
  });

  isConnected = db.connections[0].readyState === 1;
}

module.exports = { connectDB };