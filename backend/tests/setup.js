const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

beforeAll(async () => {
  process.env.JWT_ACCESS_SECRET = "test_access";
  process.env.JWT_REFRESH_SECRET = "test_refresh";
  process.env.ACCESS_TOKEN_EXPIRES_IN = "15m";
  process.env.REFRESH_TOKEN_EXPIRES_IN = "7d";
  process.env.CLIENT_ORIGIN = "http://localhost:3000";
  process.env.COOKIE_SECURE = "false";

  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});