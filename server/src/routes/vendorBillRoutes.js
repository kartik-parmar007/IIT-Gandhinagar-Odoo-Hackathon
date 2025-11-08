import express from "express";
import {
  getVendorBills,
  getVendorBill,
  createVendorBill,
  updateVendorBill,
  deleteVendorBill,
} from "../controllers/vendorBillController.js";
import { requirePermission } from "../utils/adminCheck.js";

const router = express.Router();

// Get all vendor bills - anyone can view
router.get("/", getVendorBills);

// Create vendor bill - requires Sales/Finance permission
router.post("/", requirePermission("canCreateVendorBills"), createVendorBill);

// Get single vendor bill - anyone can view
router.get("/:id", getVendorBill);

// Update vendor bill - requires Sales/Finance permission
router.put("/:id", requirePermission("canCreateVendorBills"), updateVendorBill);

// Delete vendor bill - requires Sales/Finance permission
router.delete("/:id", requirePermission("canCreateVendorBills"), deleteVendorBill);

export default router;

