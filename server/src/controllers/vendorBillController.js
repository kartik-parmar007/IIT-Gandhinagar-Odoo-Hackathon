import VendorBill from "../models/VendorBill.js";

// @desc    Get all vendor bills
// @route   GET /api/vendor-bills
// @access  Public
export const getVendorBills = async (req, res) => {
  try {
    const vendorBills = await VendorBill.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: vendorBills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single vendor bill
// @route   GET /api/vendor-bills/:id
// @access  Public
export const getVendorBill = async (req, res) => {
  try {
    const vendorBill = await VendorBill.findById(req.params.id);
    if (!vendorBill) {
      return res.status(404).json({
        success: false,
        message: "Vendor bill not found",
      });
    }
    res.status(200).json({
      success: true,
      data: vendorBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create vendor bill
// @route   POST /api/vendor-bills
// @access  Public
export const createVendorBill = async (req, res) => {
  try {
    const { vendorBill: vendorBillName, invoiceLines } = req.body;

    if (!vendorBillName || !invoiceLines || invoiceLines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vendor bill and at least one invoice line are required",
      });
    }

    const vendorBill = await VendorBill.create({
      vendorBill: vendorBillName,
      invoiceLines,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      data: vendorBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update vendor bill
// @route   PUT /api/vendor-bills/:id
// @access  Public
export const updateVendorBill = async (req, res) => {
  try {
    const { vendorBill: vendorBillName, invoiceLines } = req.body;

    const vendorBill = await VendorBill.findById(req.params.id);
    if (!vendorBill) {
      return res.status(404).json({
        success: false,
        message: "Vendor bill not found",
      });
    }

    vendorBill.vendorBill = vendorBillName || vendorBill.vendorBill;
    vendorBill.invoiceLines = invoiceLines || vendorBill.invoiceLines;

    const updatedVendorBill = await vendorBill.save();

    res.status(200).json({
      success: true,
      data: updatedVendorBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete vendor bill
// @route   DELETE /api/vendor-bills/:id
// @access  Public
export const deleteVendorBill = async (req, res) => {
  try {
    const vendorBill = await VendorBill.findById(req.params.id);
    if (!vendorBill) {
      return res.status(404).json({
        success: false,
        message: "Vendor bill not found",
      });
    }

    await vendorBill.deleteOne();

    res.status(200).json({
      success: true,
      message: "Vendor bill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

