import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { projectAPI, salesOrderAPI, purchaseOrderAPI, expenseAPI, invoiceAPI } from "../services/api";
import SalesOrderCreateEdit from "../components/SalesOrderCreateEdit";
import PurchaseOrderCreateEdit from "../components/PurchaseOrderCreateEdit";
import ExpenseCreateEdit from "../components/ExpenseCreateEdit";
import InvoiceCreateEdit from "../components/InvoiceCreateEdit";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Sales Order");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [editingSalesOrder, setEditingSalesOrder] = useState(null);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const projectName = useMemo(() => project?.name || "", [project]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (projectName) {
      // Fetch related records once project is loaded
      fetchSalesOrders();
      fetchPurchaseOrders();
      fetchExpenses();
      fetchInvoices();
    }
  }, [projectName]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const resp = await projectAPI.getById(id);
      setProject(resp.data || null);
      setError(null);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesOrders = async () => {
    try {
      const resp = await salesOrderAPI.getAllByProject(projectName);
      setSalesOrders(resp.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchPurchaseOrders = async () => {
    try {
      const resp = await purchaseOrderAPI.getAllByProject(projectName);
      setPurchaseOrders(resp.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchExpenses = async () => {
    try {
      const resp = await expenseAPI.getAllByProject(projectName);
      setExpenses(resp.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchInvoices = async () => {
    try {
      const resp = await invoiceAPI.getAllByProject(projectName);
      setInvoices(resp.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = ["Sales Order", "Invoices", "Purchase Order", "Expenses"];

  return (
    <>
      <SignedIn>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <span style={styles.crumb}>Projects</span>
              <span style={styles.sep}> / </span>
              <span style={styles.crumbActive}>{projectName || "Loading..."}</span>
            </div>
            <div>
              {activeTab && (
                <button
                  onClick={() => {
                    setEditingSalesOrder(null);
                    setEditingPurchaseOrder(null);
                    setEditingExpense(null);
                    setEditingInvoice(null);
                    setShowCreateForm(true);
                  }}
                  style={styles.primary}
                  disabled={!projectName}
                >
                  New
                </button>
              )}
            </div>
          </div>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          {/* Secondary Tabs */}
          <div style={styles.tabsRow}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  setShowCreateForm(false);
                }}
                style={{
                  ...styles.tab,
                  ...(activeTab === t ? styles.tabActive : {}),
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {showCreateForm ? (
              <>
                {activeTab === "Sales Order" && (
                  <SalesOrderCreateEdit
                    editData={editingSalesOrder}
                    fixedProject={projectName}
                    onConfirm={async (data) => {
                      try {
                        setLoading(true);
                        if (editingSalesOrder) {
                          const resp = await salesOrderAPI.update(
                            editingSalesOrder._id || editingSalesOrder.id,
                            data
                          );
                          setSalesOrders(salesOrders.map((o) => (o._id === resp.data._id ? resp.data : o)));
                          setEditingSalesOrder(null);
                        } else {
                          const resp = await salesOrderAPI.create(data);
                          setSalesOrders([resp.data, ...salesOrders]);
                        }
                        setShowCreateForm(false);
                      } catch (err) {
                        console.error(err);
                        setError("Failed to save sales order");
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
                {activeTab === "Invoices" && (
                  <InvoiceCreateEdit
                    editData={editingInvoice}
                    fixedProject={projectName}
                    onConfirm={async (data) => {
                      try {
                        setLoading(true);
                        if (editingInvoice) {
                          const resp = await invoiceAPI.update(
                            editingInvoice._id || editingInvoice.id,
                            data
                          );
                          setInvoices(invoices.map((o) => (o._id === resp.data._id ? resp.data : o)));
                          setEditingInvoice(null);
                        } else {
                          const resp = await invoiceAPI.create(data);
                          setInvoices([resp.data, ...invoices]);
                        }
                        setShowCreateForm(false);
                      } catch (err) {
                        console.error(err);
                        setError("Failed to save invoice");
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
                  <PurchaseOrderCreateEdit
                    editData={editingPurchaseOrder}
                    fixedProject={projectName}
                    onConfirm={async (data) => {
                      try {
                        setLoading(true);
                        if (editingPurchaseOrder) {
                          const resp = await purchaseOrderAPI.update(
                            editingPurchaseOrder._id || editingPurchaseOrder.id,
                            data
                          );
                          setPurchaseOrders(purchaseOrders.map((o) => (o._id === resp.data._id ? resp.data : o)));
                          setEditingPurchaseOrder(null);
                        } else {
                          const resp = await purchaseOrderAPI.create(data);
                          setPurchaseOrders([resp.data, ...purchaseOrders]);
                        }
                        setShowCreateForm(false);
                      } catch (err) {
                        console.error(err);
                        setError("Failed to save purchase order");
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
                    fixedProject={projectName}
                    onConfirm={async (data) => {
                      try {
                        setLoading(true);
                        if (editingExpense) {
                          const resp = await expenseAPI.update(
                            editingExpense._id || editingExpense.id,
                            data
                          );
                          setExpenses(expenses.map((o) => (o._id === resp.data._id ? resp.data : o)));
                          setEditingExpense(null);
                        } else {
                          const resp = await expenseAPI.create(data);
                          setExpenses([resp.data, ...expenses]);
                        }
                        setShowCreateForm(false);
                      } catch (err) {
                        console.error(err);
                        setError("Failed to save expense");
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
              </>
            ) : (
              <>
                {activeTab === "Sales Order" && (
                  <List
                    title="Sales Orders"
                    items={salesOrders}
                    renderItem={(order) => (
                      <>
                        <div style={styles.itemTitle}>{order.orderNumber} - {order.customer || "Untitled"}</div>
                        <div style={styles.itemSub}>Total: ${order.total?.toFixed(2) || "0.00"}</div>
                      </>
                    )}
                    onEdit={(item) => {
                      setEditingSalesOrder(item);
                      setShowCreateForm(true);
                    }}
                    onDelete={async (item) => {
                      if (!confirm("Delete this sales order?")) return;
                      try {
                        setLoading(true);
                        await salesOrderAPI.delete(item._id || item.id);
                        setSalesOrders(salesOrders.filter((i) => (i._id || i.id) !== (item._id || item.id)));
                      } catch (e) {
                        setError("Failed to delete sales order");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                )}
                {activeTab === "Invoices" && (
                  <List
                    title="Invoices"
                    items={invoices}
                    renderItem={(inv) => (
                      <>
                        <div style={styles.itemTitle}>{inv.customerInvoice || "Untitled"}</div>
                        <div style={styles.itemSub}>Lines: {inv.invoiceLines?.length || 0}</div>
                      </>
                    )}
                    onEdit={(item) => {
                      setEditingInvoice(item);
                      setShowCreateForm(true);
                    }}
                    onDelete={async (item) => {
                      if (!confirm("Delete this invoice?")) return;
                      try {
                        setLoading(true);
                        await invoiceAPI.delete(item._id || item.id);
                        setInvoices(invoices.filter((i) => (i._id || i.id) !== (item._id || item.id)));
                      } catch (e) {
                        setError("Failed to delete invoice");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                )}
                {activeTab === "Purchase Order" && (
                  <List
                    title="Purchase Orders"
                    items={purchaseOrders}
                    renderItem={(order) => (
                      <>
                        <div style={styles.itemTitle}>{order.orderNumber} - {order.vendor || "Untitled"}</div>
                        <div style={styles.itemSub}>Total: ${order.total?.toFixed(2) || "0.00"}</div>
                      </>
                    )}
                    onEdit={(item) => {
                      setEditingPurchaseOrder(item);
                      setShowCreateForm(true);
                    }}
                    onDelete={async (item) => {
                      if (!confirm("Delete this purchase order?")) return;
                      try {
                        setLoading(true);
                        await purchaseOrderAPI.delete(item._id || item.id);
                        setPurchaseOrders(purchaseOrders.filter((i) => (i._id || i.id) !== (item._id || item.id)));
                      } catch (e) {
                        setError("Failed to delete purchase order");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                )}
                {activeTab === "Expenses" && (
                  <List
                    title="Expenses"
                    items={expenses}
                    renderItem={(exp) => (
                      <>
                        <div style={styles.itemTitle}>{exp.name || "Untitled"}</div>
                        <div style={styles.itemSub}>{exp.expensePeriod || ""}</div>
                      </>
                    )}
                    onEdit={(item) => {
                      setEditingExpense(item);
                      setShowCreateForm(true);
                    }}
                    onDelete={async (item) => {
                      if (!confirm("Delete this expense?")) return;
                      try {
                        setLoading(true);
                        await expenseAPI.delete(item._id || item.id);
                        setExpenses(expenses.filter((i) => (i._id || i.id) !== (item._id || item.id)));
                      } catch (e) {
                        setError("Failed to delete expense");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function List({ title, items, renderItem, onEdit, onDelete }) {
  return (
    <div style={styles.listContainer}>
      <h2 style={styles.tabTitle}>{title}</h2>
      {items.length === 0 ? (
        <p style={styles.placeholder}>No items yet. Click "New" to create one.</p>
      ) : (
        <div style={styles.itemsList}>
          {items.map((item) => (
            <div key={item._id || item.id} style={styles.itemCard}>
              <div style={styles.itemHeader}>
                <div>{renderItem(item)}</div>
                <div style={styles.itemActions}>
                  <button onClick={() => onEdit(item)} style={styles.editButton}>Edit</button>
                  <button onClick={() => onDelete(item)} style={styles.deleteButton}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    marginTop: "70px",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    padding: "20px",
    transition: "all 0.3s ease",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  breadcrumbs: { color: "var(--text-secondary)" },
  crumb: { color: "var(--text-secondary)" },
  sep: { color: "var(--text-secondary)" },
  crumbActive: { color: "var(--text-primary)", fontWeight: 600 },
  primary: { padding: "8px 14px", background: "#7c3aed", color: "#fff", border: 0, borderRadius: 4 },
  error: { background: "#3b1d1d", border: "1px solid #6b1f1f", color: "#ffb4b4", padding: 10, marginBottom: 12 },

  tabsRow: { display: "flex", gap: 8, marginBottom: 16 },
  tab: { background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: 4, padding: "8px 12px" },
  tabActive: { background: "#7c3aed", color: "#fff", borderColor: "#7c3aed" },

  listContainer: {},
  tabTitle: { fontSize: 18, marginBottom: 10 },
  itemsList: { display: "grid", gap: 12 },
  itemCard: { background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 8, padding: 16 },
  itemHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { fontWeight: 600 },
  itemSub: { color: "var(--text-secondary)", fontSize: 14 },
  itemActions: { display: "flex", gap: 8 },
  editButton: { padding: "6px 10px", border: 0, borderRadius: 4, background: "#3b82f6", color: "#fff" },
  deleteButton: { padding: "6px 10px", border: 0, borderRadius: 4, background: "#ef4444", color: "#fff" },
  placeholder: { color: "var(--text-secondary)" },
};
