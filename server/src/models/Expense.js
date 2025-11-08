import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    expensePeriod: {
      type: String,
      default: "",
    },
    project: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Expense", expenseSchema);

