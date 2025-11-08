import mongoose from "mongoose";

const invoiceLineSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
});

const vendorBillSchema = new mongoose.Schema(
  {
    vendorBill: {
      type: String,
      required: true,
    },
    invoiceLines: [invoiceLineSchema],
    createdBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("VendorBill", vendorBillSchema);

