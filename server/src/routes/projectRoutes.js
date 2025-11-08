import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { requirePermission } from "../utils/adminCheck.js";

const router = express.Router();

// Get all projects - anyone can view
router.get("/", getProjects);

// Create project - requires permission
router.post("/", requirePermission("canCreateProjects"), createProject);

// Get single project - anyone can view
router.get("/:id", getProject);

// Update project - requires permission
router.put("/:id", requirePermission("canEditProjects"), updateProject);

// Delete project - requires permission
router.delete("/:id", requirePermission("canEditProjects"), deleteProject);

export default router;

