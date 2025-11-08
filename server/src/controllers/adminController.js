import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Invoice from "../models/Invoice.js";
import VendorBill from "../models/VendorBill.js";
import SalesOrder from "../models/SalesOrder.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { createClerkClient } from "@clerk/backend";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getAdminStats = async (req, res) => {
  try {
    const [
      projectsCount,
      tasksCount,
      invoicesCount,
      vendorBillsCount,
      salesOrdersCount,
      purchaseOrdersCount,
      expensesCount,
    ] = await Promise.all([
      Project.countDocuments(),
      Task.countDocuments(),
      Invoice.countDocuments(),
      VendorBill.countDocuments(),
      SalesOrder.countDocuments(),
      PurchaseOrder.countDocuments(),
      Expense.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        projects: projectsCount,
        tasks: tasksCount,
        invoices: invoicesCount,
        vendorBills: vendorBillsCount,
        salesOrders: salesOrdersCount,
        purchaseOrders: purchaseOrdersCount,
        expenses: expensesCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all data for admin
// @route   GET /api/admin/all-data
// @access  Admin
export const getAllData = async (req, res) => {
  try {
    const [projects, tasks, invoices, vendorBills, salesOrders, purchaseOrders, expenses] =
      await Promise.all([
        Project.find().sort({ createdAt: -1 }),
        Task.find().sort({ createdAt: -1 }),
        Invoice.find().sort({ createdAt: -1 }),
        VendorBill.find().sort({ createdAt: -1 }),
        SalesOrder.find().sort({ createdAt: -1 }),
        PurchaseOrder.find().sort({ createdAt: -1 }),
        Expense.find().sort({ createdAt: -1 }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        projects,
        tasks,
        invoices,
        vendorBills,
        salesOrders,
        purchaseOrders,
        expenses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete any item (Admin only)
// @route   DELETE /api/admin/delete/:type/:id
// @access  Admin
export const deleteAnyItem = async (req, res) => {
  try {
    const { type, id } = req.params;

    let Model;
    switch (type) {
      case "project":
        Model = Project;
        break;
      case "task":
        Model = Task;
        break;
      case "invoice":
        Model = Invoice;
        break;
      case "vendor-bill":
        Model = VendorBill;
        break;
      case "sales-order":
        Model = SalesOrder;
        break;
      case "purchase-order":
        Model = PurchaseOrder;
        break;
      case "expense":
        Model = Expense;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid type",
        });
    }

    const item = await Model.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users from Clerk with roles
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    
    // Get all users from Clerk
    const users = await clerk.users.getUserList({
      limit: 500, // Adjust as needed
    });

    // Get user roles from database
    const dbUsers = await User.find();
    const userRolesMapById = new Map(dbUsers.map(u => [u.clerkUserId, u]));
    const userRolesMapByEmail = new Map(dbUsers.map(u => [u.email, u]));

    // Format users data with roles
    const formattedUsers = users.data.map((user) => {
      const email = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || "";
      // Try to find user by clerkUserId first, then by email
      const dbUser = userRolesMapById.get(user.id) || userRolesMapByEmail.get(email);
      
      return {
        id: user.id,
        email: email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A",
        imageUrl: user.imageUrl || "",
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        isAdmin: email === "kartikparmar9773@gmail.com",
        role: dbUser?.role || "user",
        permissions: dbUser?.permissions || {
          canCreateProjects: false,
          canEditProjects: false,
          canAssignTeamMembers: false,
          canManageTasks: false,
          canApproveExpenses: false,
          canGenerateInvoices: false,
          canViewAssignedTasks: false,
          canUpdateTaskStatus: false,
          canLogHours: false,
          canSubmitExpenses: false,
          canCreateSalesOrders: false,
          canCreatePurchaseOrders: false,
          canCreateInvoices: false,
          canCreateVendorBills: false,
          canManageExpenses: false,
        },
      };
    });

    res.status(200).json({
      success: true,
      data: formattedUsers,
      total: users.totalCount || formattedUsers.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

// @desc    Update user role and permissions
// @route   PUT /api/admin/users/:userId/role
// @access  Admin
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    console.log(`Updating role for user ${userId} to ${role}`);

    // Validate role
    if (!['user', 'team_member', 'sales_finance', 'project_manager', 'admin'].includes(role)) {
      console.log(`Invalid role attempted: ${role}`);
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user', 'team_member', 'sales_finance', 'project_manager', or 'admin'",
      });
    }

    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress || clerkUser.primaryEmailAddress?.emailAddress || "";
    
    console.log(`Found Clerk user email: ${email}`);

    // Set permissions based on role
    let permissions = {
      canCreateProjects: false,
      canEditProjects: false,
      canAssignTeamMembers: false,
      canManageTasks: false,
      canApproveExpenses: false,
      canGenerateInvoices: false,
      canViewAssignedTasks: false,
      canUpdateTaskStatus: false,
      canLogHours: false,
      canSubmitExpenses: false,
      canCreateSalesOrders: false,
      canCreatePurchaseOrders: false,
      canCreateInvoices: false,
      canCreateVendorBills: false,
      canManageExpenses: false,
    };

    if (role === "team_member") {
      permissions = {
        ...permissions,
        canViewAssignedTasks: true,
        canUpdateTaskStatus: true,
        canLogHours: true,
        canSubmitExpenses: true,
      };
    } else if (role === "sales_finance") {
      permissions = {
        ...permissions,
        canCreateSalesOrders: true,
        canCreatePurchaseOrders: true,
        canCreateInvoices: true,
        canCreateVendorBills: true,
        canManageExpenses: true,
      };
    } else if (role === "project_manager") {
      permissions = {
        ...permissions,
        canCreateProjects: true,
        canEditProjects: true,
        canAssignTeamMembers: true,
        canManageTasks: true,
        canApproveExpenses: true,
        canGenerateInvoices: true,
      };
    } else if (role === "admin") {
      permissions = {
        canCreateProjects: true,
        canEditProjects: true,
        canAssignTeamMembers: true,
        canManageTasks: true,
        canApproveExpenses: true,
        canGenerateInvoices: true,
        canViewAssignedTasks: true,
        canUpdateTaskStatus: true,
        canLogHours: true,
        canSubmitExpenses: true,
        canCreateSalesOrders: true,
        canCreatePurchaseOrders: true,
        canCreateInvoices: true,
        canCreateVendorBills: true,
        canManageExpenses: true,
      };
    }

    // Update or create user in database
    const user = await User.findOneAndUpdate(
      { clerkUserId: userId },
      {
        clerkUserId: userId,
        email: email,
        role: role,
        permissions: permissions,
        fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        imageUrl: clerkUser.imageUrl || "",
      },
      { upsert: true, new: true }
    );

    console.log(`User role updated successfully:`, user);

    res.status(200).json({
      success: true,
      data: user,
      message: `User role updated to ${role} successfully`,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update user role",
    });
  }
};

// @desc    Get user permissions by Clerk user ID
// @route   GET /api/admin/users/:userId/permissions
// @access  Admin or Self
export const getUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      return res.status(200).json({
        success: true,
        data: {
          role: "user",
          permissions: {
            canCreateProjects: false,
            canEditProjects: false,
            canAssignTeamMembers: false,
            canManageTasks: false,
            canApproveExpenses: false,
            canGenerateInvoices: false,
            canViewAssignedTasks: false,
            canUpdateTaskStatus: false,
            canLogHours: false,
            canSubmitExpenses: false,
            canCreateSalesOrders: false,
            canCreatePurchaseOrders: false,
            canCreateInvoices: false,
            canCreateVendorBills: false,
            canManageExpenses: false,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user permissions",
    });
  }
};
