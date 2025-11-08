import express from "express";
import {
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "../controllers/purchaseOrderController.js";
import { requirePermission } from "../utils/adminCheck.js";

const router = express.Router();

// Get all purchase orders - anyone can view
router.get("/", getPurchaseOrders);

// Create purchase order - requires Sales/Finance permission
router.post("/", requirePermission("canCreatePurchaseOrders"), createPurchaseOrder);

// Get single purchase order - anyone can view
router.get("/:id", getPurchaseOrder);

// Update purchase order - requires Sales/Finance permission
router.put("/:id", requirePermission("canCreatePurchaseOrders"), updatePurchaseOrder);

// Delete purchase order - requires Sales/Finance permission
router.delete("/:id", requirePermission("canCreatePurchaseOrders"), deletePurchaseOrder);

export default router;

