import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Invoice from "../models/Invoice.js";
import VendorBill from "../models/VendorBill.js";
import SalesOrder from "../models/SalesOrder.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Expense from "../models/Expense.js";
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

// @desc    Get all users from Clerk
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    
    // Get all users from Clerk
    const users = await clerk.users.getUserList({
      limit: 500, // Adjust as needed
    });

    // Format users data
    const formattedUsers = users.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A",
      imageUrl: user.imageUrl || "",
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      isAdmin: (user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || "") === "kartikparmar9773@gmail.com",
    }));

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
