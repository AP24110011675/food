const mongoose = require("mongoose");
const dns = require("dns");

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Retry once after 3 seconds
    console.log("Retrying connection in 3 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        family: 4,
      });
      console.log(`MongoDB Connected (retry): ${conn.connection.host}`);
    } catch (retryError) {
      console.error(`MongoDB Retry Failed: ${retryError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;