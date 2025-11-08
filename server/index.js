import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";
import vendorBillRoutes from "./src/routes/vendorBillRoutes.js";
import salesOrderRoutes from "./src/routes/salesOrderRoutes.js";
import purchaseOrderRoutes from "./src/routes/purchaseOrderRoutes.js";
import expenseRoutes from "./src/routes/expenseRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Connect Database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.use("/api/invoices", invoiceRoutes);
app.use("/api/vendor-bills", vendorBillRoutes);
app.use("/api/sales-orders", salesOrderRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/projects", projectRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler - must be last
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
