import { Webhook, verifyToken } from "@clerk/backend";
import dotenv from "dotenv";
dotenv.config();

// Protect API Routes (example middleware)
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
