import express from "express";
import { getUsers } from "../controllers/userController.js";
import { requireAuth } from "../config/clerk.js";

const router = express.Router();

// Get all users for task assignment - requires authentication
router.get("/", requireAuth, getUsers);

export default router;
