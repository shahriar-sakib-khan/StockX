import mongoose, { ConnectOptions, Mongoose } from "mongoose";

/**
 * Establishes connection with MongoDB
 */
const connectDB = async (): Promise<Mongoose> => {
  
  if (!process.env.MONGO_URI) {
    throw new Error("❌ Mongo URI not found in environment variables");
  }
  const MONGO_URI = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: "your_db_name_here", // optional: helps with clarity, can be omitted if connection string includes DB name
    } as ConnectOptions);

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err: any) {
    console.error(`🔴 MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
