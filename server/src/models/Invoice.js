import mongoose from "mongoose";

const invoiceLineSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    customerInvoice: {
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

export default mongoose.model("Invoice", invoiceSchema);

