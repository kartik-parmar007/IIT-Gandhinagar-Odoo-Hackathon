import PurchaseOrder from "../models/PurchaseOrder.js";

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Public
export const getPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: purchaseOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single purchase order
// @route   GET /api/purchase-orders/:id
// @access  Public
export const getPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found",
      });
    }
    res.status(200).json({
      success: true,
      data: purchaseOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create purchase order
// @route   POST /api/purchase-orders
// @access  Public
export const createPurchaseOrder = async (req, res) => {
  try {
    const { orderNumber, vendor, project, orderLines, untaxedAmount, total } =
      req.body;

    if (!orderNumber || !vendor || !orderLines || orderLines.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Order number, vendor, and at least one order line are required",
      });
    }

    // Check if order number already exists
    const existingOrder = await PurchaseOrder.findOne({ orderNumber });
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order number already exists",
      });
    }

    const purchaseOrder = await PurchaseOrder.create({
      orderNumber,
      vendor,
      project: project || "",
      orderLines,
      untaxedAmount: untaxedAmount || 0,
      total: total || 0,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      data: purchaseOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update purchase order
// @route   PUT /api/purchase-orders/:id
// @access  Public
export const updatePurchaseOrder = async (req, res) => {
  try {
    const { orderNumber, vendor, project, orderLines, untaxedAmount, total } =
      req.body;

    const purchaseOrder = await PurchaseOrder.findById(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found",
      });
    }

    // Check if order number is being changed and if it already exists
    if (orderNumber && orderNumber !== purchaseOrder.orderNumber) {
      const existingOrder = await PurchaseOrder.findOne({ orderNumber });
      if (existingOrder) {
        return res.status(400).json({
          success: false,
          message: "Order number already exists",
        });
      }
    }

    purchaseOrder.orderNumber = orderNumber || purchaseOrder.orderNumber;
    purchaseOrder.vendor = vendor || purchaseOrder.vendor;
    purchaseOrder.project = project !== undefined ? project : purchaseOrder.project;
    purchaseOrder.orderLines = orderLines || purchaseOrder.orderLines;
    purchaseOrder.untaxedAmount = untaxedAmount || purchaseOrder.untaxedAmount;
    purchaseOrder.total = total || purchaseOrder.total;

    const updatedPurchaseOrder = await purchaseOrder.save();

    res.status(200).json({
      success: true,
      data: updatedPurchaseOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete purchase order
// @route   DELETE /api/purchase-orders/:id
// @access  Public
export const deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found",
      });
    }

    await purchaseOrder.deleteOne();

    res.status(200).json({
      success: true,
      message: "Purchase order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

