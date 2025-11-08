import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// Dashboard routes
router.get("/stats", getDashboardStats);

export default router;

