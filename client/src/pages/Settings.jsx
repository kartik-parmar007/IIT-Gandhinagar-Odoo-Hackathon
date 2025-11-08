import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import InvoiceCreateEdit from "../components/InvoiceCreateEdit";
import VendorBillsCreateEdit from "../components/VendorBillsCreateEdit";
import SalesOrderCreateEdit from "../components/SalesOrderCreateEdit";
import PurchaseOrderCreateEdit from "../components/PurchaseOrderCreateEdit";
import ExpenseCreateEdit from "../components/ExpenseCreateEdit";
import { invoiceAPI, vendorBillAPI, salesOrderAPI, purchaseOrderAPI, expenseAPI, taskAPI, dashboardAPI, projectAPI } from "../services/api";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Tasks");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [vendorBills, setVendorBills] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingVendorBill, setEditingVendorBill] = useState(null);
  const [editingSalesOrder, setEditingSalesOrder] = useState(null);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [projects, setProjects] = useState([]);

  // Fetch invoices, vendor bills, sales orders, purchase orders, expenses, and tasks on component mount
  useEffect(() => {
    fetchInvoices();
    fetchVendorBills();
    fetchSalesOrders();
    fetchPurchaseOrders();
    fetchExpenses();
    fetchTasks();
    fetchDashboardStats();
    fetchProjects();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      setDashboardStats(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getAll();
      setInvoices(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorBills = async () => {
    try {
      setLoading(true);
      const response = await vendorBillAPI.getAll();
      setVendorBills(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching vendor bills:", err);
      setError("Failed to load vendor bills");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      const response = await salesOrderAPI.getAll();
      setSalesOrders(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching sales orders:", err);
      setError("Failed to load sales orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderAPI.getAll();
      setPurchaseOrders(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
      setError("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll();
      setExpenses(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAll();
      // Filter tasks with status "In Progress"
      const inProgressTasks = (response.data || []).filter(
        (task) => task.status === "In Progress"
      );
      setTasks(inProgressTasks);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    "Tasks",
    "Sales Order",
    "Invoices",
    "Purchase Order",
    "Expenses",
    "Dashboard",
  ];

  return (
    <>
      <SignedIn>
        <Navbar />
        <div style={styles.container}>
          {/* Secondary Navigation Tabs */}
          <div style={styles.tabsContainer}>
            <div style={styles.tabsWrapper}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowCreateForm(false);
                    setEditingInvoice(null);
                    setEditingVendorBill(null);
                    setEditingSalesOrder(null);
                    setEditingPurchaseOrder(null);
                    setEditingExpense(null);
                    setEditingTask(null);
                    // Refresh tasks when switching to Tasks tab
                    if (tab === "Tasks") {
                      fetchTasks();
                    }
                    // Refresh dashboard stats when switching to Dashboard tab
                    if (tab === "Dashboard") {
                      fetchDashboardStats();
                    }
                  }}
                  className="tab-hover"
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab ? styles.activeTab : {}),
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search......."
              style={styles.searchBar}
            />
          </div>

          {/* Action Button and Content Area */}
          <div style={styles.contentArea}>
            {error && (
              <div style={styles.errorMessage}>
                {error}
                <button
                  onClick={() => setError(null)}
                  style={styles.errorClose}
                >
                  ×
                </button>
              </div>
            )}
            {activeTab !== "Dashboard" && (
              <button
                onClick={() => {
                  setEditingInvoice(null);
                  setEditingVendorBill(null);
                  setEditingSalesOrder(null);
                  setEditingPurchaseOrder(null);
                  setEditingExpense(null);
                  setEditingTask(null);
                  setShowCreateForm(true);
                  setError(null);
                }}
                style={styles.newButton}
                disabled={loading}
              >
                {loading ? "Loading..." : "New"}
              </button>
            )}
            <div style={styles.tabContent}>
              {showCreateForm ? (
                <>
                  {activeTab === "Invoices" && (
                    <InvoiceCreateEdit
                      editData={editingInvoice}
                      projects={projects}
                      onConfirm={async (invoiceData) => {
                        try {
                          setLoading(true);
                          setError(null);
                          if (editingInvoice) {
                            // Update existing invoice
                            const response = await invoiceAPI.update(
                              editingInvoice._id || editingInvoice.id,
                              {
                                customerInvoice: invoiceData.customerInvoice,
                                invoiceLines: invoiceData.invoiceLines,
                              }
                            );
                            setInvoices(
                              invoices.map((inv) =>
                                inv._id === response.data._id ||
                                inv.id === response.data._id
                                  ? response.data
                                  : inv
                              )
                            );
                            setEditingInvoice(null);
                          } else {
                            // Create new invoice
                            const response = await invoiceAPI.create({
                              customerInvoice: invoiceData.customerInvoice,
                              invoiceLines: invoiceData.invoiceLines,
                            });
                            setInvoices([response.data, ...invoices]);
                          }
                          setShowCreateForm(false);
                        } catch (err) {
                          console.error("Error saving invoice:", err);
                          setError(
                            err.message || "Failed to save invoice. Please try again."
                          );
                        } finally {
                          setLoading(false);
                        }
                      }}
                      onCancel={() => {
                        setShowCreateForm(false);
                        setEditingInvoice(null);
                      }}
                    />
                  )}
                  {activeTab === "Purchase Order" && (
                    <VendorBillsCreateEdit
                      editData={editingVendorBill}
                      onConfirm={async (vendorBillData) => {
                        try {
                          setLoading(true);
                          setError(null);
                          if (editingVendorBill) {
                            // Update existing vendor bill
                            const response = await vendorBillAPI.update(
                              editingVendorBill._id || editingVendorBill.id,
                              {
                                vendorBill: vendorBillData.vendorBill,
                                invoiceLines: vendorBillData.invoiceLines,
                              }
                            );
                            setVendorBills(
                              vendorBills.map((bill) =>
                                bill._id === response.data._id ||
                                bill.id === response.data._id
                                  ? response.data
                                  : bill
                              )
                            );
                            setEditingVendorBill(null);
                          } else {
                            // Create new vendor bill
                            const response = await vendorBillAPI.create({
                              vendorBill: vendorBillData.vendorBill,
                              invoiceLines: vendorBillData.invoiceLines,
                            });
                            setVendorBills([response.data, ...vendorBills]);
                          }
                          setShowCreateForm(false);
                        } catch (err) {
                          console.error("Error saving vendor bill:", err);
                          setError(
                            err.message ||
                              "Failed to save vendor bill. Please try again."
                          );
                        } finally {
                          setLoading(false);
                        }
                      }}
                      onCancel={() => {
                        setShowCreateForm(false);
                        setEditingVendorBill(null);
                      }}
                    />
                  )}
                  {activeTab === "Sales Order" && (
                    <SalesOrderCreateEdit
                      editData={editingSalesOrder}
                      projects={projects}
                      onConfirm={async (salesOrderData) => {
                        try {
                          setLoading(true);
                          setError(null);
                          if (editingSalesOrder) {
                            // Update existing sales order
                            const response = await salesOrderAPI.update(
                              editingSalesOrder._id || editingSalesOrder.id,
                              {
                                orderNumber: salesOrderData.orderNumber,
                                customer: salesOrderData.customer,
                                project: salesOrderData.project,
                                orderLines: salesOrderData.orderLines,
                                untaxedAmount: salesOrderData.untaxedAmount,
                                total: salesOrderData.total,
                              }
                            );
                            setSalesOrders(
                              salesOrders.map((order) =>
                                order._id === response.data._id ||
                                order.id === response.data._id
                                  ? response.data
                                  : order
                              )
                            );
                            setEditingSalesOrder(null);
                          } else {
                            // Create new sales order
                            const response = await salesOrderAPI.create({
                              orderNumber: salesOrderData.orderNumber,
                              customer: salesOrderData.customer,
                              project: salesOrderData.project,
                              orderLines: salesOrderData.orderLines,
                              untaxedAmount: salesOrderData.untaxedAmount,
                              total: salesOrderData.total,
                            });
                            setSalesOrders([response.data, ...salesOrders]);
                          }
                          setShowCreateForm(false);
                        } catch (err) {
                          console.error("Error saving sales order:", err);
                          setError(
                            err.message ||
                              "Failed to save sales order. Please try again."
                          );
                        } finally {
                          setLoading(false);
                        }
                      }}
                      onCancel={() => {
                        setShowCreateForm(false);
                        setEditingSalesOrder(null);
                      }}
                    />
                  )}
                  {activeTab === "Purchase Order" && (
                    <PurchaseOrderCreateEdit
                      editData={editingPurchaseOrder}
                      projects={projects}
                      onConfirm={async (purchaseOrderData) => {
                        try {
                          setLoading(true);
                          setError(null);
                          if (editingPurchaseOrder) {
                            // Update existing purchase order
                            const response = await purchaseOrderAPI.update(
                              editingPurchaseOrder._id || editingPurchaseOrder.id,
                              {
                                orderNumber: purchaseOrderData.orderNumber,
                                vendor: purchaseOrderData.vendor,
                                project: purchaseOrderData.project,
                                orderLines: purchaseOrderData.orderLines,
                                untaxedAmount: purchaseOrderData.untaxedAmount,
                                total: purchaseOrderData.total,
                              }
                            );
                            setPurchaseOrders(
                              purchaseOrders.map((order) =>
                                order._id === response.data._id ||
                                order.id === response.data._id
                                  ? response.data
                                  : order
                              )
                            );
                            setEditingPurchaseOrder(null);
                          } else {
                            // Create new purchase order
                            const response = await purchaseOrderAPI.create({
                              orderNumber: purchaseOrderData.orderNumber,
                              vendor: purchaseOrderData.vendor,
                              project: purchaseOrderData.project,
                              orderLines: purchaseOrderData.orderLines,
                              untaxedAmount: purchaseOrderData.untaxedAmount,
                              total: purchaseOrderData.total,
                            });
                            setPurchaseOrders([response.data, ...purchaseOrders]);
                          }
                          setShowCreateForm(false);
                        } catch (err) {
                          console.error("Error saving purchase order:", err);
                          setError(
                            err.message ||
                              "Failed to save purchase order. Please try again."
                          );
                        } finally {
                          setLoading(false);
                        }
                      }}
                      onCancel={() => {
                        setShowCreateForm(false);
                        setEditingPurchaseOrder(null);
                      }}
                    />
                  )}
                  {activeTab === "Expenses" && (
                    <ExpenseCreateEdit
                      editData={editingExpense}
                      projects={projects}
                      onConfirm={async (expenseData) => {
                        try {
                          setLoading(true);
                          setError(null);
                          if (editingExpense) {
                            // Update existing expense
                            const response = await expenseAPI.update(
                              editingExpense._id || editingExpense.id,
                              {
                                name: expenseData.name,
                                expensePeriod: expenseData.expensePeriod,
                                project: expenseData.project,
                                image: expenseData.image,
                                description: expenseData.description,
                              }
                            );
                            setExpenses(
                              expenses.map((exp) =>
                                exp._id === response.data._id ||
                                exp.id === response.data._id
                                  ? response.data
                                  : exp
                              )
                            );
                            setEditingExpense(null);
                          } else {
                            // Create new expense
                            const response = await expenseAPI.create({
                              name: expenseData.name,
                              expensePeriod: expenseData.expensePeriod,
                              project: expenseData.project,
                              image: expenseData.image,
                              description: expenseData.description,
                            });
                            setExpenses([response.data, ...expenses]);
                          }
                          setShowCreateForm(false);
                        } catch (err) {
                          console.error("Error saving expense:", err);
                          setError(
                            err.message ||
                              "Failed to save expense. Please try again."
                          );
                        } finally {
                          setLoading(false);
                        }
                      }}
                      onCancel={() => {
                        setShowCreateForm(false);
                        setEditingExpense(null);
                      }}
                    />
                  )}
                  {activeTab === "Tasks" && (
                    <div>
                      <h2 style={styles.tabTitle}>Tasks</h2>
                      <p style={styles.placeholderText}>
                        To create or edit tasks, please use the Tasks page from the navigation menu.
                      </p>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        style={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {activeTab !== "Invoices" &&
                    activeTab !== "Purchase Order" &&
                    activeTab !== "Sales Order" &&
                    activeTab !== "Expenses" &&
                    activeTab !== "Tasks" && (
                      <div>
                        <h2 style={styles.tabTitle}>{activeTab}</h2>
                        <p style={styles.placeholderText}>
                          Create/edit form for {activeTab} will be implemented
                          here...
                        </p>
                        <button
                          onClick={() => setShowCreateForm(false)}
                          style={styles.cancelButton}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                </>
              ) : (
                <>
                  {activeTab === "Invoices" && invoices.length > 0 && (
                    <div style={styles.listContainer}>
                      <h2 style={styles.tabTitle}>Invoices</h2>
                      <div style={styles.itemsList}>
                        {invoices.map((invoice) => (
                          <div key={invoice._id || invoice.id} style={styles.itemCard}>
                            <div style={styles.itemHeader}>
                              <h3 style={styles.itemTitle}>
                                {invoice.customerInvoice || "Untitled Invoice"}
                              </h3>
                              <div style={styles.itemActions}>
                                <button
                                  onClick={() => {
                                    setEditingInvoice(invoice);
                                    setShowCreateForm(true);
                                  }}
                                  style={styles.editButton}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this invoice?"
                                      )
                                    ) {
                                      try {
                                        setLoading(true);
                                        await invoiceAPI.delete(
                                          invoice._id || invoice.id
                                        );
                                        setInvoices(
                                          invoices.filter(
                                            (inv) =>
                                              (inv._id || inv.id) !==
                                              (invoice._id || invoice.id)
                                          )
                                        );
                                        setError(null);
                                      } catch (err) {
                                        console.error("Error deleting invoice:", err);
                                        setError(
                                          err.message ||
                                            "Failed to delete invoice. Please try again."
                                        );
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                  style={styles.deleteButton}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div style={styles.itemDetails}>
                              <p style={styles.detailText}>
                                <strong>Products:</strong>{" "}
                                {invoice.invoiceLines.length} item(s)
                              </p>
                              {invoice.invoiceLines.length > 0 && (
                                <ul style={styles.productList}>
                                  {invoice.invoiceLines.map((line, idx) => (
                                    <li key={idx} style={styles.productItem}>
                                      {line.product}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <p style={styles.dateText}>
                                Created:{" "}
                                {invoice.createdAt
                                  ? new Date(invoice.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "Invoices" && invoices.length === 0 && (
                    <div>
                      <h2 style={styles.tabTitle}>Invoices</h2>
                      <p style={styles.placeholderText}>
                        No invoices yet. Click "New" to create one.
                      </p>
                    </div>
                  )}
                  {activeTab === "Purchase Order" && vendorBills.length > 0 && (
                    <div style={styles.listContainer}>
                      <h2 style={styles.tabTitle}>Vendor Bills</h2>
                      <div style={styles.itemsList}>
                        {vendorBills.map((bill) => (
                          <div key={bill.id} style={styles.itemCard}>
                            <div style={styles.itemHeader}>
                              <h3 style={styles.itemTitle}>
                                {bill.vendorBill || "Untitled Vendor Bill"}
                              </h3>
                              <div style={styles.itemActions}>
                                <button
                                  onClick={() => {
                                    setEditingVendorBill(bill);
                                    setShowCreateForm(true);
                                  }}
                                  style={styles.editButton}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this vendor bill?"
                                      )
                                    ) {
                                      try {
                                        setLoading(true);
                                        await vendorBillAPI.delete(
                                          bill._id || bill.id
                                        );
                                        setVendorBills(
                                          vendorBills.filter(
                                            (b) =>
                                              (b._id || b.id) !==
                                              (bill._id || bill.id)
                                          )
                                        );
                                        setError(null);
                                      } catch (err) {
                                        console.error(
                                          "Error deleting vendor bill:",
                                          err
                                        );
                                        setError(
                                          err.message ||
                                            "Failed to delete vendor bill. Please try again."
                                        );
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                  style={styles.deleteButton}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div style={styles.itemDetails}>
                              <p style={styles.detailText}>
                                <strong>Products:</strong>{" "}
                                {bill.invoiceLines.length} item(s)
                              </p>
                              {bill.invoiceLines.length > 0 && (
                                <ul style={styles.productList}>
                                  {bill.invoiceLines.map((line, idx) => (
                                    <li key={idx} style={styles.productItem}>
                                      {line.product}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <p style={styles.dateText}>
                                Created:{" "}
                                {bill.createdAt
                                  ? new Date(bill.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "Purchase Order" &&
                    vendorBills.length === 0 && (
                      <div>
                        <h2 style={styles.tabTitle}>Vendor Bills</h2>
                        <p style={styles.placeholderText}>
                          No vendor bills yet. Click "New" to create one.
                        </p>
                      </div>
                    )}
                  {activeTab === "Sales Order" && salesOrders.length > 0 && (
                    <div style={styles.listContainer}>
                      <h2 style={styles.tabTitle}>Sales Orders</h2>
                      <div style={styles.itemsList}>
                        {salesOrders.map((order) => (
                          <div
                            key={order._id || order.id}
                            style={styles.itemCard}
                          >
                            <div style={styles.itemHeader}>
                              <h3 style={styles.itemTitle}>
                                {order.orderNumber} - {order.customer || "Untitled Sales Order"}
                              </h3>
                              <div style={styles.itemActions}>
                                <button
                                  onClick={() => {
                                    setEditingSalesOrder(order);
                                    setShowCreateForm(true);
                                  }}
                                  style={styles.editButton}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this sales order?"
                                      )
                                    ) {
                                      try {
                                        setLoading(true);
                                        await salesOrderAPI.delete(
                                          order._id || order.id
                                        );
                                        setSalesOrders(
                                          salesOrders.filter(
                                            (o) =>
                                              (o._id || o.id) !==
                                              (order._id || order.id)
                                          )
                                        );
                                        setError(null);
                                      } catch (err) {
                                        console.error(
                                          "Error deleting sales order:",
                                          err
                                        );
                                        setError(
                                          err.message ||
                                            "Failed to delete sales order. Please try again."
                                        );
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                  style={styles.deleteButton}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div style={styles.itemDetails}>
                              <p style={styles.detailText}>
                                <strong>Project:</strong> {order.project || "N/A"}
                              </p>
                              <p style={styles.detailText}>
                                <strong>Order Lines:</strong>{" "}
                                {order.orderLines?.length || 0} item(s)
                              </p>
                              <p style={styles.detailText}>
                                <strong>Total:</strong> ${order.total?.toFixed(2) || "0.00"}
                              </p>
                              <p style={styles.dateText}>
                                Created:{" "}
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "Sales Order" && salesOrders.length === 0 && (
                    <div>
                      <h2 style={styles.tabTitle}>Sales Orders</h2>
                      <p style={styles.placeholderText}>
                        No sales orders yet. Click "New" to create one.
                      </p>
                    </div>
                  )}
                  {activeTab === "Purchase Order" && purchaseOrders.length > 0 && (
                    <div style={styles.listContainer}>
                      <h2 style={styles.tabTitle}>Purchase Orders</h2>
                      <div style={styles.itemsList}>
                        {purchaseOrders.map((order) => (
                          <div
                            key={order._id || order.id}
                            style={styles.itemCard}
                          >
                            <div style={styles.itemHeader}>
                              <h3 style={styles.itemTitle}>
                                {order.orderNumber} - {order.vendor || "Untitled Purchase Order"}
                              </h3>
                              <div style={styles.itemActions}>
                                <button
                                  onClick={() => {
                                    setEditingPurchaseOrder(order);
                                    setShowCreateForm(true);
                                  }}
                                  style={styles.editButton}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this purchase order?"
                                      )
                                    ) {
                                      try {
                                        setLoading(true);
                                        await purchaseOrderAPI.delete(
                                          order._id || order.id
                                        );
                                        setPurchaseOrders(
                                          purchaseOrders.filter(
                                            (o) =>
                                              (o._id || o.id) !==
                                              (order._id || order.id)
                                          )
                                        );
                                        setError(null);
                                      } catch (err) {
                                        console.error(
                                          "Error deleting purchase order:",
                                          err
                                        );
                                        setError(
                                          err.message ||
                                            "Failed to delete purchase order. Please try again."
                                        );
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                  style={styles.deleteButton}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div style={styles.itemDetails}>
                              <p style={styles.detailText}>
                                <strong>Project:</strong> {order.project || "N/A"}
                              </p>
                              <p style={styles.detailText}>
                                <strong>Order Lines:</strong>{" "}
                                {order.orderLines?.length || 0} item(s)
                              </p>
                              <p style={styles.detailText}>
                                <strong>Total:</strong> ${order.total?.toFixed(2) || "0.00"}
                              </p>
                              <p style={styles.dateText}>
                                Created:{" "}
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "Purchase Order" && purchaseOrders.length === 0 && (
                    <div>
                      <h2 style={styles.tabTitle}>Purchase Orders</h2>
                      <p style={styles.placeholderText}>
                        No purchase orders yet. Click "New" to create one.
                      </p>
                    </div>
                  )}
                  {activeTab === "Expenses" && expenses.length > 0 && (
                    <div style={styles.listContainer}>
                      <h2 style={styles.tabTitle}>Expenses</h2>
                      <div style={styles.itemsList}>
                        {expenses.map((expense) => (
                          <div
                            key={expense._id || expense.id}
                            style={styles.itemCard}
                          >
                            <div style={styles.itemHeader}>
                              <h3 style={styles.itemTitle}>
                                {expense.name || "Untitled Expense"}
                              </h3>
                              <div style={styles.itemActions}>
                                <button
                                  onClick={() => {
                                    setEditingExpense(expense);
                                    setShowCreateForm(true);
                                  }}
                                  style={styles.editButton}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this expense?"
                                      )
                                    ) {
                                      try {
                                        setLoading(true);
                                        await expenseAPI.delete(
                                          expense._id || expense.id
                                        );
                                        setExpenses(
                                          expenses.filter(
                                            (e) =>
                                              (e._id || e.id) !==
                                              (expense._id || expense.id)
                                          )
                                        );
                                        setError(null);
                                      } catch (err) {
                                        console.error(
                                          "Error deleting expense:",
                                          err
                                        );
                                        setError(
                                          err.message ||
                                            "Failed to delete expense. Please try again."
                                        );
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                  style={styles.deleteButton}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div style={styles.itemDetails}>
                              {expense.image && (
                                <div style={styles.expenseImageContainer}>
                                  <img
                                    src={expense.image}
                                    alt={expense.name}
                                    style={styles.expenseImage}
                                  />
                                </div>
                              )}
                              <p style={styles.detailText}>
                                <strong>Expense Period:</strong>{" "}
                                {expense.expensePeriod || "N/A"}
                              </p>
                              <p style={styles.detailText}>
                                <strong>Project:</strong>{" "}
                                {expense.project || "N/A"}
                              </p>
                              {expense.description && (
                                <p style={styles.detailText}>
                                  <strong>Description:</strong>{" "}
                                  {expense.description}
                                </p>
                              )}
                              <p style={styles.dateText}>
                                Created:{" "}
                                {expense.createdAt
                                  ? new Date(expense.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "Expenses" && expenses.length === 0 && (
                    <div>
                      <h2 style={styles.tabTitle}>Expenses</h2>
                      <p style={styles.placeholderText}>
                        No expenses yet. Click "New" to create one.
                      </p>
                    </div>
                  )}
                  {activeTab === "Tasks" && tasks.length > 0 && (
                    <div style={styles.listContainer}>
                      <h2 style={styles.tabTitle}>Tasks (In Progress)</h2>
                      <div style={styles.itemsList}>
                        {tasks.map((task) => (
                          <div
                            key={task._id || task.id}
                            style={styles.itemCard}
                          >
                            <div style={styles.itemHeader}>
                              <h3 style={styles.itemTitle}>
                                {task.name || "Untitled Task"}
                              </h3>
                              <div style={styles.itemActions}>
                                <button
                                  onClick={() => {
                                    setEditingTask(task);
                                    setShowCreateForm(true);
                                  }}
                                  style={styles.editButton}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this task?"
                                      )
                                    ) {
                                      try {
                                        setLoading(true);
                                        await taskAPI.delete(
                                          task._id || task.id
                                        );
                                        setTasks(
                                          tasks.filter(
                                            (t) =>
                                              (t._id || t.id) !==
                                              (task._id || task.id)
                                          )
                                        );
                                        setError(null);
                                      } catch (err) {
                                        console.error(
                                          "Error deleting task:",
                                          err
                                        );
                                        setError(
                                          err.message ||
                                            "Failed to delete task. Please try again."
                                        );
                                      } finally {
                                        setLoading(false);
                                      }
                                    }
                                  }}
                                  style={styles.deleteButton}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div style={styles.itemDetails}>
                              {task.project && (
                                <p style={styles.detailText}>
                                  <strong>Project:</strong> {task.project}
                                </p>
                              )}
                              <p style={styles.detailText}>
                                <strong>Status:</strong> {task.status}
                              </p>
                              <p style={styles.detailText}>
                                <strong>Priority:</strong> {task.priority}
                              </p>
                              {task.rating > 0 && (
                                <p style={styles.detailText}>
                                  <strong>Rating:</strong>{" "}
                                  {"★".repeat(task.rating)}
                                  {"☆".repeat(3 - task.rating)}
                                </p>
                              )}
                              {task.assignees && task.assignees.length > 0 && (
                                <p style={styles.detailText}>
                                  <strong>Assignees:</strong>{" "}
                                  {task.assignees.join(", ")}
                                </p>
                              )}
                              {task.deadline && (
                                <p style={styles.detailText}>
                                  <strong>Deadline:</strong>{" "}
                                  {new Date(task.deadline).toLocaleDateString()}
                                </p>
                              )}
                              {task.tags && task.tags.length > 0 && (
                                <div style={styles.tagsContainer}>
                                  <strong style={styles.detailText}>Tags: </strong>
                                  {task.tags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        ...styles.tag,
                                        background:
                                          tag === "Bug"
                                            ? "#ef4444"
                                            : tag === "Feedback"
                                            ? "#10b981"
                                            : "#7c3aed",
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {task.description && (
                                <p style={styles.detailText}>
                                  <strong>Description:</strong>{" "}
                                  {task.description}
                                </p>
                              )}
                              {task.image && (
                                <div style={styles.taskImageContainer}>
                                  <img
                                    src={task.image}
                                    alt={task.name}
                                    style={styles.taskImage}
                                  />
                                </div>
                              )}
                              <p style={styles.dateText}>
                                Created:{" "}
                                {task.createdAt
                                  ? new Date(task.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "Tasks" && tasks.length === 0 && (
                    <div>
                      <h2 style={styles.tabTitle}>Tasks (In Progress)</h2>
                      <p style={styles.placeholderText}>
                        No tasks in progress. Tasks with "In Progress" status will appear here.
                      </p>
                    </div>
                  )}
                  {activeTab === "Dashboard" && (
                    <div style={styles.dashboardContainer}>
                      {/* Date Filter */}
                      <div style={styles.dashboardHeader}>
                        <div style={styles.dateFilterContainer}>
                          <span style={styles.searchIcon}>🔍</span>
                          <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            style={styles.dateFilter}
                          >
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                            <option>Last 90 Days</option>
                            <option>This Year</option>
                          </select>
                        </div>
                      </div>

                      {/* Key Metrics Cards */}
                      {dashboardStats && (
                        <>
                          <div style={styles.metricsGrid}>
                            <div style={styles.metricCard}>
                              <div style={{ ...styles.metricIcon, color: "#3b82f6" }}>
                                📊
                              </div>
                              <div style={styles.metricContent}>
                                <h3 style={styles.metricTitle}>Total Projects</h3>
                                <p style={styles.metricValue}>{dashboardStats.totalProjects || 0}</p>
                                <div style={{ ...styles.metricLine, background: "#3b82f6" }}></div>
                              </div>
                            </div>

                            <div style={styles.metricCard}>
                              <div style={{ ...styles.metricIcon, color: "#10b981" }}>
                                ✓
                              </div>
                              <div style={styles.metricContent}>
                                <h3 style={styles.metricTitle}>Tasks Completed</h3>
                                <p style={styles.metricValue}>{dashboardStats.tasksCompleted || 0}</p>
                                <div style={{ ...styles.metricLine, background: "#10b981" }}></div>
                              </div>
                            </div>

                            <div style={styles.metricCard}>
                              <div style={{ ...styles.metricIcon, color: "#f59e0b" }}>
                                ⏰
                              </div>
                              <div style={styles.metricContent}>
                                <h3 style={styles.metricTitle}>Hours Logged</h3>
                                <p style={styles.metricValue}>
                                  {dashboardStats.hoursLogged?.toLocaleString() || "0"}
                                </p>
                                <div style={{ ...styles.metricLine, background: "#f59e0b" }}></div>
                              </div>
                            </div>

                          </div>

                          {/* Charts Section */}
                          <div style={styles.chartsGrid}>
                            {/* Project Progress Chart */}
                            <div style={styles.chartCard}>
                              <h3 style={styles.chartTitle}>Project Progress (%)</h3>
                              <div style={styles.progressChart}>
                                {dashboardStats.projectProgress?.slice(0, 3).map((project, idx) => (
                                  <div key={idx} style={styles.progressItem}>
                                    <div style={styles.progressHeader}>
                                      <span style={styles.progressLabel}>{project.name}</span>
                                      <span style={styles.progressPercent}>{project.progress}%</span>
                                    </div>
                                    <div style={styles.progressBarContainer}>
                                      <div
                                        style={{
                                          ...styles.progressBar,
                                          width: `${project.progress}%`,
                                          background: project.progress === 100 ? "#3b82f6" : "#3b82f6",
                                        }}
                                      ></div>
                                      {project.progress < 100 && project.progress > 50 && (
                                        <div
                                          style={{
                                            ...styles.progressBarSecondary,
                                            width: `${Math.min(10, 100 - project.progress)}%`,
                                            background: "#10b981",
                                          }}
                                        ></div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resource Utilization Chart */}
                            <div style={styles.chartCard}>
                              <h3 style={styles.chartTitle}>Resource Utilization</h3>
                              <div style={styles.utilizationChart}>
                                <div style={styles.chartLegend}>
                                  <div style={styles.legendItem}>
                                    <div style={{ ...styles.legendColor, background: "#3b82f6" }}></div>
                                    <span>Logged Hours</span>
                                  </div>
                                  <div style={styles.legendItem}>
                                    <div style={{ ...styles.legendColor, background: "#6b7280" }}></div>
                                    <span>Capacity</span>
                                  </div>
                                </div>
                                <div style={styles.barChart}>
                                  {dashboardStats.resourceUtilization?.slice(0, 3).map((resource, idx) => {
                                    const loggedPercent = (resource.loggedHours / resource.capacity) * 100;
                                    const capacityPercent = 100;
                                    return (
                                      <div key={idx} style={styles.barChartItem}>
                                        <div style={styles.barChartLabel}>{resource.name}</div>
                                        <div style={styles.barChartBars}>
                                          <div
                                            style={{
                                              ...styles.barChartBar,
                                              height: `${Math.min(loggedPercent, 100)}%`,
                                              background: "#3b82f6",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              ...styles.barChartBar,
                                              height: `${capacityPercent}%`,
                                              background: "#6b7280",
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Project Cost vs Revenue Chart */}
                            <div style={styles.chartCard}>
                              <h3 style={styles.chartTitle}>Project Cost vs. Revenue</h3>
                              <div style={styles.costRevenueChart}>
                                <div style={styles.barChart}>
                                  {dashboardStats.projectCostRevenue?.slice(0, 2).map((project, idx) => {
                                    const maxValue = Math.max(project.cost, project.revenue, 1000);
                                    const costPercent = (project.cost / maxValue) * 100;
                                    const revenuePercent = (project.revenue / maxValue) * 100;
                                    return (
                                      <div key={idx} style={styles.barChartItem}>
                                        <div style={styles.barChartLabel}>{project.name}</div>
                                        <div style={styles.barChartBars}>
                                          <div
                                            style={{
                                              ...styles.barChartBar,
                                              height: `${costPercent}%`,
                                              background: "#ef4444",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              ...styles.barChartBar,
                                              height: `${revenuePercent}%`,
                                              background: "#10b981",
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {!dashboardStats && !loading && (
                        <p style={styles.placeholderText}>No dashboard data available</p>
                      )}

                      {loading && (
                        <p style={styles.placeholderText}>Loading dashboard...</p>
                      )}
                    </div>
                  )}
                  {activeTab !== "Invoices" &&
                    activeTab !== "Purchase Order" &&
                    activeTab !== "Sales Order" &&
                    activeTab !== "Expenses" &&
                    activeTab !== "Tasks" &&
                    activeTab !== "Dashboard" && (
                      <>
                        <h2 style={styles.tabTitle}>{activeTab}</h2>
                        <p style={styles.placeholderText}>
                          Content for {activeTab} will be displayed here...
                        </p>
                      </>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    marginTop: "70px",
    background: "#1a1a1a",
    color: "#fff",
    padding: "20px",
  },
  tabsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px",
  },
  tabsWrapper: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  tab: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #444",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  activeTab: {
    background: "#7c3aed",
    borderColor: "#7c3aed",
    color: "#fff",
  },
  searchBar: {
    padding: "10px 15px",
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "14px",
    minWidth: "200px",
    outline: "none",
  },
  contentArea: {
    marginTop: "20px",
  },
  newButton: {
    padding: "12px 24px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background 0.3s ease",
  },
  newButtonHover: {
    background: "#6d28d9",
  },
  tabContent: {
    background: "#2a2a2a",
    padding: "30px",
    borderRadius: "8px",
    minHeight: "400px",
  },
  tabTitle: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#fff",
  },
  placeholderText: {
    color: "#888",
    fontSize: "16px",
  },
  cancelButton: {
    padding: "10px 20px",
    background: "transparent",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px",
  },
  listContainer: {
    width: "100%",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  itemCard: {
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "20px",
    transition: "all 0.3s ease",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  itemTitle: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
  itemActions: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    padding: "6px 12px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  deleteButton: {
    padding: "6px 12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  itemDetails: {
    color: "#ccc",
  },
  detailText: {
    marginBottom: "10px",
    fontSize: "14px",
  },
  productList: {
    marginLeft: "20px",
    marginBottom: "10px",
    color: "#aaa",
  },
  productItem: {
    marginBottom: "5px",
    fontSize: "14px",
  },
  dateText: {
    fontSize: "12px",
    color: "#888",
    marginTop: "10px",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    alignItems: "center",
    marginBottom: "10px",
  },
  tag: {
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#fff",
  },
  taskImageContainer: {
    width: "100%",
    maxWidth: "300px",
    height: "200px",
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "10px",
    marginBottom: "10px",
    background: "#1a1a1a",
  },
  taskImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  errorMessage: {
    background: "#ef4444",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "4px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorClose: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    padding: "0 10px",
  },
  expenseImageContainer: {
    marginBottom: "15px",
  },
  expenseImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "4px",
    border: "1px solid #444",
  },
  dashboardContainer: {
    width: "100%",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "30px",
  },
  dateFilterContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  searchIcon: {
    fontSize: "18px",
    color: "#888",
  },
  dateFilter: {
    padding: "10px 15px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  metricCard: {
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  metricIcon: {
    fontSize: "32px",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: "14px",
    color: "#888",
    margin: "0 0 8px 0",
    fontWeight: "500",
  },
  metricValue: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#fff",
    margin: "0 0 8px 0",
  },
  metricLine: {
    height: "3px",
    borderRadius: "2px",
    width: "100%",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },
  chartCard: {
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "20px",
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
    margin: "0 0 20px 0",
  },
  progressChart: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  progressItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: "14px",
    color: "#888",
  },
  progressBarContainer: {
    width: "100%",
    height: "20px",
    background: "#2a2a2a",
    borderRadius: "4px",
    overflow: "hidden",
    display: "flex",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  progressBarSecondary: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  utilizationChart: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  chartLegend: {
    display: "flex",
    gap: "20px",
    marginBottom: "10px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#888",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    borderRadius: "2px",
  },
  barChart: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-end",
    height: "200px",
  },
  barChartItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
  },
  barChartLabel: {
    fontSize: "12px",
    color: "#888",
    marginBottom: "8px",
  },
  barChartBars: {
    display: "flex",
    gap: "4px",
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
  },
  barChartBar: {
    flex: 1,
    minHeight: "20px",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.3s ease",
  },
  costRevenueChart: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
};


