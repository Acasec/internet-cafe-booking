import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (global._mongoose!.conn) return global._mongoose!.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (!global._mongoose!.promise) {
    global._mongoose!.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || "internet-cafe",
    });
  }
  global._mongoose!.conn = await global._mongoose!.promise;
  return global._mongoose!.conn;
}
