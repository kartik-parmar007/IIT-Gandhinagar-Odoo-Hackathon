import mongoose from "mongoose";

const invoiceLineSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
}, { _id: true });

const invoiceSchema = new mongoose.Schema(
  {
    customerInvoice: {
      type: String,
      required: true,
    },
    // Optional project linkage (by name) to relate invoices to a project
    project: {
      type: String,
      default: "",
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

export default mongoose.model("Invoice", invoiceSchema);

