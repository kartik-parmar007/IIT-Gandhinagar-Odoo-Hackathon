import express from "express";
import {
  getAdminStats,
  getAllData,
  deleteAnyItem,
  getAllUsers,
} from "../controllers/adminController.js";
import { requireAdmin } from "../utils/adminCheck.js";

const router = express.Router();

// All admin routes require admin authentication
router.get("/stats", requireAdmin, getAdminStats);
router.get("/all-data", requireAdmin, getAllData);
router.get("/users", requireAdmin, getAllUsers);
router.delete("/delete/:type/:id", requireAdmin, deleteAnyItem);

export default router;

