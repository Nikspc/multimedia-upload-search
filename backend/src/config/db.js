// const mongoose = require("mongoose");

// async function connectDB(uri) {
//   mongoose.set("strictQuery", true);

//   mongoose.connection.on("connected", () => console.log("MongoDB connected"));
//   mongoose.connection.on("error", (err) => console.error("MongoDB error:", err.message));
//   mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));

//   await mongoose.connect(uri, {
//     serverSelectionTimeoutMS: 10000, // fail fast if cannot reach Atlas
//   });
// }

// module.exports = { connectDB };

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disables buffering so errors throw immediately if disconnected
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;