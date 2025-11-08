import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

// Connect Database
connectDB();

// Default test route (you can remove later)
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
