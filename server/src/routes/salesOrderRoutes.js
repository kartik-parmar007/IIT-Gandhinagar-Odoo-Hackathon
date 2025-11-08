import express from "express";
import {
  getSalesOrders,
  getSalesOrder,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
} from "../controllers/salesOrderController.js";
import { requirePermission } from "../utils/adminCheck.js";

const router = express.Router();

// Get all sales orders - anyone can view
router.get("/", getSalesOrders);

// Create sales order - requires Sales/Finance permission
router.post("/", requirePermission("canCreateSalesOrders"), createSalesOrder);

// Get single sales order - anyone can view
router.get("/:id", getSalesOrder);

// Update sales order - requires Sales/Finance permission
router.put("/:id", requirePermission("canCreateSalesOrders"), updateSalesOrder);

// Delete sales order - requires Sales/Finance permission
router.delete("/:id", requirePermission("canCreateSalesOrders"), deleteSalesOrder);

export default router;

