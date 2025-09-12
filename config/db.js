import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const dbUri = process.env.MONGO_DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
