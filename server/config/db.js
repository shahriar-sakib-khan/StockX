import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`🔴 MongoDB Connection Error: ${err.message}`);
    process.exit(1); // Stops server if DB fails
  }
};

export default connectDB;
