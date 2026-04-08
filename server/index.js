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
import taskRoutes from "./src/routes/taskRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { requireAuth } from "./src/middlewares/authMiddleware.js";
import { notFound, errorHandler } from "./src/middlewares/errorMiddleware.js";

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

// Protected Routes
app.use("/api/invoices", requireAuth, invoiceRoutes);
app.use("/api/vendor-bills", requireAuth, vendorBillRoutes);
app.use("/api/sales-orders", requireAuth, salesOrderRoutes);
app.use("/api/purchase-orders", requireAuth, purchaseOrderRoutes);
app.use("/api/expenses", requireAuth, expenseRoutes);
app.use("/api/projects", requireAuth, projectRoutes);
app.use("/api/tasks", requireAuth, taskRoutes);
app.use("/api/admin", requireAuth, adminRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/users", requireAuth, userRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Error handler - must be last
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
