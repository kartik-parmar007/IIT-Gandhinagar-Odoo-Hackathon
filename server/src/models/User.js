import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "team_member", "sales_finance", "project_manager", "admin"],
      default: "user",
    },
    permissions: {
      canCreateProjects: { type: Boolean, default: false },
      canEditProjects: { type: Boolean, default: false },
      canAssignTeamMembers: { type: Boolean, default: false },
      canManageTasks: { type: Boolean, default: false },
      canApproveExpenses: { type: Boolean, default: false },
      canGenerateInvoices: { type: Boolean, default: false },
      // Team Member permissions
      canViewAssignedTasks: { type: Boolean, default: false },
      canUpdateTaskStatus: { type: Boolean, default: false },
      canLogHours: { type: Boolean, default: false },
      canSubmitExpenses: { type: Boolean, default: false },
      // Sales/Finance permissions
      canCreateSalesOrders: { type: Boolean, default: false },
      canCreatePurchaseOrders: { type: Boolean, default: false },
      canCreateInvoices: { type: Boolean, default: false },
      canCreateVendorBills: { type: Boolean, default: false },
      canManageExpenses: { type: Boolean, default: false },
    },
    fullName: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose model recompilation error
export default mongoose.models.User || mongoose.model("User", userSchema);