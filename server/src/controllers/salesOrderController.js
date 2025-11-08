import SalesOrder from "../models/SalesOrder.js";

// @desc    Get all sales orders
// @route   GET /api/sales-orders
// @access  Public
export const getSalesOrders = async (req, res) => {
  try {
    const { project } = req.query;
    const query = {};
    if (project) query.project = project;
    const salesOrders = await SalesOrder.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: salesOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single sales order
// @route   GET /api/sales-orders/:id
// @access  Public
export const getSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id);
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: "Sales order not found",
      });
    }
    res.status(200).json({
      success: true,
      data: salesOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create sales order
// @route   POST /api/sales-orders
// @access  Public
export const createSalesOrder = async (req, res) => {
  try {
    const { orderNumber, customer, project, orderLines, untaxedAmount, total } =
      req.body;

    if (!orderNumber || !customer || !orderLines || orderLines.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Order number, customer, and at least one order line are required",
      });
    }

    // Check if order number already exists
    const existingOrder = await SalesOrder.findOne({ orderNumber });
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order number already exists",
      });
    }

    const salesOrder = await SalesOrder.create({
      orderNumber,
      customer,
      project: project || "",
      orderLines,
      untaxedAmount: untaxedAmount || 0,
      total: total || 0,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      data: salesOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update sales order
// @route   PUT /api/sales-orders/:id
// @access  Public
export const updateSalesOrder = async (req, res) => {
  try {
    const { orderNumber, customer, project, orderLines, untaxedAmount, total } =
      req.body;

    const salesOrder = await SalesOrder.findById(req.params.id);
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: "Sales order not found",
      });
    }

    // Check if order number is being changed and if it already exists
    if (orderNumber && orderNumber !== salesOrder.orderNumber) {
      const existingOrder = await SalesOrder.findOne({ orderNumber });
      if (existingOrder) {
        return res.status(400).json({
          success: false,
          message: "Order number already exists",
        });
      }
    }

    salesOrder.orderNumber = orderNumber || salesOrder.orderNumber;
    salesOrder.customer = customer || salesOrder.customer;
    salesOrder.project = project !== undefined ? project : salesOrder.project;
    salesOrder.orderLines = orderLines || salesOrder.orderLines;
    salesOrder.untaxedAmount = untaxedAmount || salesOrder.untaxedAmount;
    salesOrder.total = total || salesOrder.total;

    const updatedSalesOrder = await salesOrder.save();

    res.status(200).json({
      success: true,
      data: updatedSalesOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete sales order
// @route   DELETE /api/sales-orders/:id
// @access  Public
export const deleteSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id);
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: "Sales order not found",
      });
    }

    await salesOrder.deleteOne();

    res.status(200).json({
      success: true,
      message: "Sales order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

