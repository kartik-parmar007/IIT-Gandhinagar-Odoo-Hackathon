import express from "express";
import {
  getAdminStats,
  getAllData,
  deleteAnyItem,
  getAllUsers,
  updateUserRole,
  getUserPermissions,
} from "../controllers/adminController.js";
import { requireAdmin } from "../utils/adminCheck.js";

const router = express.Router();

// All admin routes require admin authentication
router.get("/stats", requireAdmin, getAdminStats);
router.get("/all-data", requireAdmin, getAllData);
router.get("/users", requireAdmin, getAllUsers);
router.put("/users/:userId/role", requireAdmin, updateUserRole);
router.get("/users/:userId/permissions", getUserPermissions);
router.delete("/delete/:type/:id", requireAdmin, deleteAnyItem);

export default router;

