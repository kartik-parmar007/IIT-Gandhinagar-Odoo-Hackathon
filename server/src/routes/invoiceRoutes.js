import express from "express";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";
import { requirePermission } from "../utils/adminCheck.js";

const router = express.Router();

// Get all invoices - anyone can view
router.get("/", getInvoices);

// Create invoice - requires Sales/Finance or Project Manager permission
router.post("/", requirePermission("canCreateInvoices"), createInvoice);

// Get single invoice - anyone can view
router.get("/:id", getInvoice);

// Update invoice - requires permission
router.put("/:id", requirePermission("canCreateInvoices"), updateInvoice);

// Delete invoice - requires permission
router.delete("/:id", requirePermission("canCreateInvoices"), deleteInvoice);

export default router;

