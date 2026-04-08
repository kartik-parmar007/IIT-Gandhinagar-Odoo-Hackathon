import mongoose from "mongoose";
import dns from "dns";

// Fix for querySrv ECONNREFUSED on some networks (e.g. corporate/ISP)
// This forces Node's internal resolver (c-ares) to use reliable DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
