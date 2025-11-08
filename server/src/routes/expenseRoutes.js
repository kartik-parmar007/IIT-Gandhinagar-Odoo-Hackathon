import express from "express";
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { requirePermission, requireTeamMember } from "../utils/adminCheck.js";

const router = express.Router();

// Get all expenses - requires manage or submit permission
router.get("/", getExpenses);

// Create expense - Team Members can submit, Sales/Finance can manage
router.post("/", requireTeamMember, createExpense);

// Get single expense
router.get("/:id", getExpense);

// Update expense - requires manage permission
router.put("/:id", requirePermission("canManageExpenses"), updateExpense);

// Delete expense - requires manage permission
router.delete("/:id", requirePermission("canManageExpenses"), deleteExpense);

export default router;

