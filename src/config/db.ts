import mongoose from "mongoose";
import { getSecrets } from "./secrets";

export async function connectDB() {
  try {
    const secrets = await getSecrets();

    await mongoose.connect(secrets.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
}