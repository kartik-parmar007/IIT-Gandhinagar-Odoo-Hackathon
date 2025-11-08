import Invoice from "../models/Invoice.js";

// @desc    Get all invoices (optionally filter by project name)
// @route   GET /api/invoices
// @access  Public
export const getInvoices = async (req, res) => {
  try {
    const { project } = req.query;
    const query = {};
    if (project) query.project = project;
    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Public
export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Public
export const createInvoice = async (req, res) => {
  try {
    const { customerInvoice, invoiceLines, project } = req.body;

    if (!customerInvoice || !invoiceLines || invoiceLines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer invoice and at least one invoice line are required",
      });
    }

    const invoice = await Invoice.create({
      customerInvoice,
      project: project || "",
      invoiceLines,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Public
export const updateInvoice = async (req, res) => {
  try {
    const { customerInvoice, invoiceLines, project } = req.body;

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    invoice.customerInvoice = customerInvoice || invoice.customerInvoice;
    invoice.project = project !== undefined ? project : invoice.project;
    invoice.invoiceLines = invoiceLines || invoice.invoiceLines;

    const updatedInvoice = await invoice.save();

    res.status(200).json({
      success: true,
      data: updatedInvoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Public
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    await invoice.deleteOne();

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

