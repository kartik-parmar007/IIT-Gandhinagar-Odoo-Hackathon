const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(
        `Server returned non-JSON response. Please check if the server is running on ${API_BASE_URL}`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error(
          "File size is too large. Please compress the image or use a smaller file."
        );
      }
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw new Error(
        `Cannot connect to server. Please make sure the backend server is running on ${API_BASE_URL}`
      );
    }
    throw error;
  }
};

// Invoice API
export const invoiceAPI = {
  getAll: () => apiCall("/invoices"),
  getAllByProject: (project) =>
    apiCall(`/invoices?project=${encodeURIComponent(project)}`),
  getById: (id) => apiCall(`/invoices/${id}`),
  create: (invoiceData) =>
    apiCall("/invoices", {
      method: "POST",
      body: JSON.stringify(invoiceData),
    }),
  update: (id, invoiceData) =>
    apiCall(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(invoiceData),
    }),
  delete: (id) =>
    apiCall(`/invoices/${id}`, {
      method: "DELETE",
    }),
};

// Vendor Bill API
export const vendorBillAPI = {
  getAll: () => apiCall("/vendor-bills"),
  getById: (id) => apiCall(`/vendor-bills/${id}`),
  create: (vendorBillData) =>
    apiCall("/vendor-bills", {
      method: "POST",
      body: JSON.stringify(vendorBillData),
    }),
  update: (id, vendorBillData) =>
    apiCall(`/vendor-bills/${id}`, {
      method: "PUT",
      body: JSON.stringify(vendorBillData),
    }),
  delete: (id) =>
    apiCall(`/vendor-bills/${id}`, {
      method: "DELETE",
    }),
};

// Sales Order API
export const salesOrderAPI = {
  getAll: () => apiCall("/sales-orders"),
  getAllByProject: (project) =>
    apiCall(`/sales-orders?project=${encodeURIComponent(project)}`),
  getById: (id) => apiCall(`/sales-orders/${id}`),
  create: (salesOrderData) =>
    apiCall("/sales-orders", {
      method: "POST",
      body: JSON.stringify(salesOrderData),
    }),
  update: (id, salesOrderData) =>
    apiCall(`/sales-orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(salesOrderData),
    }),
  delete: (id) =>
    apiCall(`/sales-orders/${id}`, {
      method: "DELETE",
    }),
};

// Purchase Order API
export const purchaseOrderAPI = {
  getAll: () => apiCall("/purchase-orders"),
  getAllByProject: (project) =>
    apiCall(`/purchase-orders?project=${encodeURIComponent(project)}`),
  getById: (id) => apiCall(`/purchase-orders/${id}`),
  create: (purchaseOrderData) =>
    apiCall("/purchase-orders", {
      method: "POST",
      body: JSON.stringify(purchaseOrderData),
    }),
  update: (id, purchaseOrderData) =>
    apiCall(`/purchase-orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(purchaseOrderData),
    }),
  delete: (id) =>
    apiCall(`/purchase-orders/${id}`, {
      method: "DELETE",
    }),
};

// Expense API
export const expenseAPI = {
  getAll: () => apiCall("/expenses"),
  getAllByProject: (project) =>
    apiCall(`/expenses?project=${encodeURIComponent(project)}`),
  getById: (id) => apiCall(`/expenses/${id}`),
  create: (expenseData) =>
    apiCall("/expenses", {
      method: "POST",
      body: JSON.stringify(expenseData),
    }),
  update: (id, expenseData) =>
    apiCall(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expenseData),
    }),
  delete: (id) =>
    apiCall(`/expenses/${id}`, {
      method: "DELETE",
    }),
};

// Project API
export const projectAPI = {
  getAll: () => apiCall("/projects"),
  getById: (id) => apiCall(`/projects/${id}`),
  create: (projectData) =>
    apiCall("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    }),
  update: (id, projectData) =>
    apiCall(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    }),
  delete: (id) =>
    apiCall(`/projects/${id}`, {
      method: "DELETE",
    }),
};

// Task API
export const taskAPI = {
  getAll: () => apiCall("/tasks"),
  getById: (id) => apiCall(`/tasks/${id}`),
  create: (taskData) =>
    apiCall("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),
  update: (id, taskData) =>
    apiCall(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    }),
  delete: (id) =>
    apiCall(`/tasks/${id}`, {
      method: "DELETE",
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiCall("/dashboard/stats"),
};

// User Management API
export const userAPI = {
  getPermissions: (userId) => apiCall(`/admin/users/${userId}/permissions`),
  updateRole: (userId, role) =>
    apiCall(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),
};

