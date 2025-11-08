import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { requirePermission, requireTeamMember } from "../utils/adminCheck.js";

const router = express.Router();

// Get all tasks - anyone can view
router.get("/", getTasks);

// Create task - requires task management permission
router.post("/", requirePermission("canManageTasks"), createTask);

// Get single task - anyone can view their assigned tasks
router.get("/:id", getTask);

// Update task - Team Members can update status, managers can fully edit
router.put("/:id", requireTeamMember, updateTask);

// Delete task - requires task management permission
router.delete("/:id", requirePermission("canManageTasks"), deleteTask);

export default router;

