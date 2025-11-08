import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { useIsAdmin } from "../utils/adminCheck";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminPanel() {
  const { getToken } = useAuth();
  const isAdmin = useIsAdmin();
  const [stats, setStats] = useState(null);
  const [allData, setAllData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      console.log("📝 Token retrieved:", token ? "Yes (" + token.substring(0, 20) + "...)" : "No token");
      
      if (!token) {
        console.error("❌ No authentication token available");
        throw new Error("No authentication token available. Please sign in again.");
      }
      
      console.log("🚀 Fetching stats with token...");
      
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.message || "Failed to fetch stats");
      }

      const data = await response.json();
      console.log("✅ Stats fetched successfully");
      setStats(data.data);
      setError(null);
    } catch (err) {
      console.error("💥 Error fetching stats:", err);
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error("No authentication token available. Please sign in again.");
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/all-data`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch data");
      }

      const data = await response.json();
      setAllData(data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error("No authentication token available. Please sign in again.");
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error("No authentication token available. Please sign in again.");
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user role");
      }
      
      // Refresh users list
      fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      console.error("Error updating user role:", err);
      setError(err.message || "Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error("No authentication token available. Please sign in again.");
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/delete/${type}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete");
      }

      // Refresh data
      if (activeTab === "all-data") {
        fetchAllData();
      } else if (activeTab === "users") {
        fetchUsers();
      } else {
        fetchStats();
      }
      setError(null);
    } catch (err) {
      console.error("Error deleting:", err);
      setError(err.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <>
        <SignedIn>
          <Navbar />
          <div style={styles.container}>
            <div style={styles.errorMessage}>
              Access denied. Admin privileges required.
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  }

  return (
    <>
      <SignedIn>
        <Navbar />
        <div style={styles.container}>
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.subtitle}>Full system access and management</p>

          {error && (
            <div style={styles.errorMessage}>
              {error}
              <button onClick={() => setError(null)} style={styles.errorClose}>
                ×
              </button>
            </div>
          )}

          {/* Tabs */}
          <div style={styles.tabsContainer}>
            <button
              onClick={() => {
                setActiveTab("stats");
                fetchStats();
              }}
              className="tab-hover"
              style={{
                ...styles.tab,
                ...(activeTab === "stats" ? styles.activeTab : {}),
              }}
            >
              Statistics
            </button>
            <button
              onClick={() => {
                setActiveTab("all-data");
                fetchAllData();
              }}
              className="tab-hover"
              style={{
                ...styles.tab,
                ...(activeTab === "all-data" ? styles.activeTab : {}),
              }}
            >
              All Data
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                fetchUsers();
              }}
              className="tab-hover"
              style={{
                ...styles.tab,
                ...(activeTab === "users" ? styles.activeTab : {}),
              }}
            >
              Users
            </button>
          </div>

          {/* Content */}
          <div style={styles.content}>
            {loading && !stats && !allData && users.length === 0 ? (
              <p style={styles.placeholderText}>Loading...</p>
            ) : activeTab === "stats" && stats ? (
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Projects</h3>
                  <p style={styles.statValue}>{stats.projects}</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Tasks</h3>
                  <p style={styles.statValue}>{stats.tasks}</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Invoices</h3>
                  <p style={styles.statValue}>{stats.invoices}</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Vendor Bills</h3>
                  <p style={styles.statValue}>{stats.vendorBills}</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Sales Orders</h3>
                  <p style={styles.statValue}>{stats.salesOrders}</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Purchase Orders</h3>
                  <p style={styles.statValue}>{stats.purchaseOrders}</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Expenses</h3>
                  <p style={styles.statValue}>{stats.expenses}</p>
                </div>
              </div>
            ) : activeTab === "all-data" && allData ? (
              <div style={styles.dataContainer}>
                {/* Projects */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Projects ({allData.projects.length})</h2>
                  <div style={styles.itemsList}>
                    {allData.projects.map((item) => (
                      <div key={item._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemTitle}>{item.name || "Untitled"}</h3>
                          <button
                            onClick={() => handleDelete("project", item._id)}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Tasks ({allData.tasks.length})</h2>
                  <div style={styles.itemsList}>
                    {allData.tasks.map((item) => (
                      <div key={item._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemTitle}>{item.name || "Untitled"}</h3>
                          <button
                            onClick={() => handleDelete("task", item._id)}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoices */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Invoices ({allData.invoices.length})</h2>
                  <div style={styles.itemsList}>
                    {allData.invoices.map((item) => (
                      <div key={item._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemTitle}>
                            {item.customerInvoice || "Untitled"}
                          </h3>
                          <button
                            onClick={() => handleDelete("invoice", item._id)}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other sections similarly... */}
              </div>
            ) : activeTab === "users" ? (
              <div style={styles.usersContainer}>
                <h2 style={styles.sectionTitle}>All Users ({users.length})</h2>
                {loading && users.length === 0 ? (
                  <p style={styles.placeholderText}>Loading users...</p>
                ) : users.length > 0 ? (
                  <div style={styles.usersTable}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Avatar</th>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Role</th>
                          <th style={styles.th}>Created</th>
                          <th style={styles.th}>Last Sign In</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td style={styles.td}>
                              {user.imageUrl ? (
                                <img
                                  src={user.imageUrl}
                                  alt={user.fullName}
                                  style={styles.avatar}
                                />
                              ) : (
                                <div style={styles.avatarPlaceholder}>
                                  {user.fullName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </td>
                            <td style={styles.td}>{user.fullName}</td>
                            <td style={styles.td}>{user.email}</td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.roleBadge,
                                  background: user.isAdmin 
                                    ? "#ef4444" 
                                    : user.role === "project_manager" 
                                    ? "#7c3aed" 
                                    : user.role === "team_member"
                                    ? "#10b981"
                                    : user.role === "sales_finance"
                                    ? "#f59e0b"
                                    : "#6b7280",
                                }}
                              >
                                {user.isAdmin 
                                  ? "Admin" 
                                  : user.role === "project_manager" 
                                  ? "Project Manager" 
                                  : user.role === "team_member"
                                  ? "Team Member"
                                  : user.role === "sales_finance"
                                  ? "Sales/Finance"
                                  : "User"}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td style={styles.td}>
                              {user.lastSignInAt
                                ? new Date(user.lastSignInAt).toLocaleDateString()
                                : "Never"}
                            </td>
                            <td style={styles.td}>
                              {!user.isAdmin && (
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowRoleModal(true);
                                  }}
                                  style={styles.editButton}
                                >
                                  Change Role
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={styles.placeholderText}>No users found</p>
                )}
              </div>
            ) : (
              <p style={styles.placeholderText}>No data available</p>
            )}
          </div>
        </div>

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={styles.modalTitle}>Change User Role</h2>
              <p style={styles.modalText}>
                Update role for <strong>{selectedUser.fullName}</strong> ({selectedUser.email})
              </p>
              
              <div style={styles.roleOptions}>
                <button
                  onClick={() => updateUserRole(selectedUser.id, "user")}
                  style={{
                    ...styles.roleButton,
                    background: selectedUser.role === "user" ? "#6b7280" : "var(--bg-primary)",
                  }}
                  disabled={loading}
                >
                  <div>
                    <h3 style={styles.roleButtonTitle}>User</h3>
                    <p style={styles.roleButtonDesc}>Basic access with no special permissions</p>
                  </div>
                </button>

                <button
                  onClick={() => updateUserRole(selectedUser.id, "team_member")}
                  style={{
                    ...styles.roleButton,
                    background: selectedUser.role === "team_member" ? "#10b981" : "var(--bg-primary)",
                  }}
                  disabled={loading}
                >
                  <div>
                    <h3 style={styles.roleButtonTitle}>Team Member</h3>
                    <p style={styles.roleButtonDesc}>
                      Can view assigned tasks, update task status, log hours, and submit expenses
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => updateUserRole(selectedUser.id, "sales_finance")}
                  style={{
                    ...styles.roleButton,
                    background: selectedUser.role === "sales_finance" ? "#f59e0b" : "var(--bg-primary)",
                  }}
                  disabled={loading}
                >
                  <div>
                    <h3 style={styles.roleButtonTitle}>Sales/Finance</h3>
                    <p style={styles.roleButtonDesc}>
                      Can create/manage Sales Orders, Purchase Orders, Invoices, Vendor Bills, and Expenses
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => updateUserRole(selectedUser.id, "project_manager")}
                  style={{
                    ...styles.roleButton,
                    background: selectedUser.role === "project_manager" ? "#7c3aed" : "var(--bg-primary)",
                  }}
                  disabled={loading}
                >
                  <div>
                    <h3 style={styles.roleButtonTitle}>Project Manager</h3>
                    <p style={styles.roleButtonDesc}>
                      Can create/edit projects, assign team members, manage tasks, approve expenses, and generate invoices
                    </p>
                  </div>
                </button>
              </div>

              <div style={styles.modalActions}>
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  style={styles.modalCancelButton}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    padding: "20px",
    transition: "all 0.3s ease",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "var(--text-secondary)",
    marginBottom: "30px",
  },
  errorMessage: {
    background: "#ef4444",
    color: "var(--text-primary)",
    padding: "12px 20px",
    borderRadius: "4px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorClose: {
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    fontSize: "20px",
    cursor: "pointer",
    padding: "0 10px",
  },
  tabsContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  tab: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "14px",
  },
  activeTab: {
    background: "#7c3aed",
    borderColor: "#7c3aed",
  },
  content: {
    background: "var(--bg-secondary)",
    padding: "30px",
    borderRadius: "8px",
    minHeight: "400px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  statCard: {
    background: "var(--bg-primary)",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
  },
  statTitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: "0 0 10px 0",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: 0,
  },
  dataContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "var(--text-primary)",
    marginBottom: "15px",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  itemCard: {
    background: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    padding: "15px",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: "16px",
    color: "var(--text-primary)",
    margin: 0,
  },
  deleteButton: {
    padding: "6px 12px",
    background: "#ef4444",
    color: "var(--text-primary)",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  placeholderText: {
    color: "var(--text-secondary)",
    fontSize: "16px",
    textAlign: "center",
    padding: "40px",
  },
  usersContainer: {
    width: "100%",
  },
  usersTable: {
    background: "var(--bg-primary)",
    borderRadius: "4px",
    overflowX: "auto",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 15px",
    textAlign: "left",
    borderBottom: "2px solid var(--border-color)",
    color: "var(--text-primary)",
    fontWeight: "600",
    fontSize: "14px",
    background: "var(--bg-secondary)",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    fontSize: "14px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#7c3aed",
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
  },
  roleBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-primary)",
    display: "inline-block",
  },
  editButton: {
    padding: "6px 12px",
    background: "#7c3aed",
    color: "var(--text-primary)",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    backdropFilter: "blur(2px)",
  },
  modal: {
    background: "var(--bg-secondary)",
    borderRadius: "8px",
    padding: "30px",
    maxWidth: "600px",
    width: "90%",
    border: "1px solid var(--border-color)",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginTop: 0,
    marginBottom: "10px",
  },
  modalText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "20px",
  },
  roleOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  },
  roleButton: {
    padding: "20px",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.3s ease",
  },
  roleButtonTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: "0 0 8px 0",
  },
  roleButtonDesc: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  modalCancelButton: {
    padding: "10px 20px",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

