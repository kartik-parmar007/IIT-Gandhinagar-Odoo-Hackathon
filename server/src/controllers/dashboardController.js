import Project from "../models/Project.js";
import Task from "../models/Task.js";
import SalesOrder from "../models/SalesOrder.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Expense from "../models/Expense.js";

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public (can be protected later)
export const getDashboardStats = async (req, res) => {
  try {
    // Calculate date range (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all projects
    const allProjects = await Project.find();
    const totalProjects = allProjects.length;

    // Get completed tasks
    const completedTasks = await Task.find({ status: "Done" });
    const tasksCompleted = completedTasks.length;

    // Calculate hours logged (estimate: 8 hours per completed task, 4 hours per in-progress task)
    const inProgressTasks = await Task.find({ status: "In Progress" });
    const estimatedHours = completedTasks.length * 8 + inProgressTasks.length * 4;
    const hoursLogged = estimatedHours;

    // Calculate tax information from expenses, sales orders, and purchase orders
    const allExpenses = await Expense.find();
    const allSalesOrders = await SalesOrder.find();
    const allPurchaseOrders = await PurchaseOrder.find();

    // Calculate total tax from sales orders and purchase orders
    let totalTax = 0;
    allSalesOrders.forEach((so) => {
      if (so.orderLines && so.orderLines.length > 0) {
        so.orderLines.forEach((line) => {
          totalTax += line.taxes || 0;
        });
      }
    });
    allPurchaseOrders.forEach((po) => {
      if (po.orderLines && po.orderLines.length > 0) {
        po.orderLines.forEach((line) => {
          totalTax += line.taxes || 0;
        });
      }
    });

    // Calculate total expenses
    // Since Expense model doesn't have amount, we'll use:
    // 1. Total from purchase orders (which includes expenses)
    // 2. Estimate expenses as $100 each if no purchase orders
    let totalExpenses = 0;
    allPurchaseOrders.forEach((po) => {
      totalExpenses += po.total || 0;
    });
    
    // If no purchase orders, estimate expenses
    if (totalExpenses === 0 && allExpenses.length > 0) {
      totalExpenses = allExpenses.length * 100; // Estimate $100 per expense
    }

    // Calculate tax percentage
    const totalWithTax = totalExpenses + totalTax;
    const taxPercentage = totalWithTax > 0 
      ? Math.round((totalTax / totalWithTax) * 100) 
      : 0;
    const expensePercentage = totalWithTax > 0 
      ? Math.round((totalExpenses / totalWithTax) * 100) 
      : 100;

    // Get project progress
    const projectProgress = await Promise.all(
      allProjects.map(async (project) => {
        const projectTasks = await Task.find({ project: project.name });
        const totalTasks = projectTasks.length;
        const completedTasksCount = projectTasks.filter(
          (t) => t.status === "Done"
        ).length;
        const progress =
          totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

        return {
          name: project.name,
          progress: progress,
        };
      })
    );

    // Get resource utilization (based on assignees)
    const allTasks = await Task.find();
    const assigneeMap = {};
    
    allTasks.forEach((task) => {
      if (task.assignees && task.assignees.length > 0) {
        task.assignees.forEach((assignee) => {
          if (!assigneeMap[assignee]) {
            assigneeMap[assignee] = { loggedHours: 0, capacity: 160 }; // 160 hours = 20 days * 8 hours
          }
          // Estimate hours: 8 for done, 4 for in progress, 2 for new
          if (task.status === "Done") {
            assigneeMap[assignee].loggedHours += 8;
          } else if (task.status === "In Progress") {
            assigneeMap[assignee].loggedHours += 4;
          } else {
            assigneeMap[assignee].loggedHours += 2;
          }
        });
      }
    });

    const resourceUtilization = Object.keys(assigneeMap).map((name) => ({
      name: name,
      loggedHours: assigneeMap[name].loggedHours,
      capacity: assigneeMap[name].capacity,
    }));

    // Get project cost vs revenue
    const projectCostRevenue = await Promise.all(
      allProjects.map(async (project) => {
        // Calculate cost from purchase orders and expenses
        const purchaseOrders = await PurchaseOrder.find({
          project: project.name,
        });
        const expenses = await Expense.find({ project: project.name });
        
        const cost =
          purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0) +
          expenses.length * 100; // Estimate $100 per expense

        // Calculate revenue from sales orders
        const salesOrders = await SalesOrder.find({
          project: project.name,
        });
        const revenue = salesOrders.reduce(
          (sum, so) => sum + (so.total || 0),
          0
        );

        return {
          name: project.name,
          cost: cost,
          revenue: revenue,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        tasksCompleted,
        hoursLogged,
        taxPercentage,
        expensePercentage,
        totalTax,
        totalExpenses,
        projectProgress: projectProgress.slice(0, 10), // Limit to 10 projects
        resourceUtilization: resourceUtilization.slice(0, 10), // Limit to 10 people
        projectCostRevenue: projectCostRevenue.slice(0, 10), // Limit to 10 projects
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

