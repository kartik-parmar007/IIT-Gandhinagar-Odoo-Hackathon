import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL;

    // Fix for querySrv ECONNREFUSED on some networks (e.g. corporate/ISP)
    // This forces Node's internal resolver (c-ares) to use reliable DNS servers
    // Only apply when using SRV connection strings
    if (uri.startsWith("mongodb+srv://")) {
      const dnsServers = process.env.MONGO_DNS_SERVERS
        ? process.env.MONGO_DNS_SERVERS.split(",").map(s => s.trim())
        : ["8.8.8.8", "1.1.1.1"];
      dns.setServers(dnsServers);
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;