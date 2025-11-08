import express from "express";
import {
  getVendorBills,
  getVendorBill,
  createVendorBill,
  updateVendorBill,
  deleteVendorBill,
} from "../controllers/vendorBillController.js";

const router = express.Router();

router
  .route("/")
  .get(getVendorBills)
  .post(createVendorBill);
router
  .route("/:id")
  .get(getVendorBill)
  .put(updateVendorBill)
  .delete(deleteVendorBill);

export default router;

