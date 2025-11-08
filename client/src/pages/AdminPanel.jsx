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

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error("No authentication token available");
      }
      
      console.log("Fetching stats with token (first 30 chars):", token.substring(0, 30) + "...");
      
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/admin/all-data`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setAllData(data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
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
      const response = await fetch(`${API_BASE_URL}/admin/delete/${type}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
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
      setError("Failed to delete item");
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
                                  background: user.isAdmin ? "#ef4444" : "#6b7280",
                                }}
                              >
                                {user.isAdmin ? "Admin" : "User"}
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
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#888",
    marginBottom: "30px",
  },
  errorMessage: {
    background: "#ef4444",
    color: "#fff",
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
    color: "#fff",
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
    border: "1px solid #444",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "14px",
  },
  activeTab: {
    background: "#7c3aed",
    borderColor: "#7c3aed",
  },
  content: {
    background: "#2a2a2a",
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
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #444",
  },
  statTitle: {
    fontSize: "14px",
    color: "#888",
    margin: "0 0 10px 0",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#fff",
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
    color: "#fff",
    marginBottom: "15px",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  itemCard: {
    background: "#1a1a1a",
    border: "1px solid #444",
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
    color: "#fff",
    margin: 0,
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
  },
  placeholderText: {
    color: "#888",
    fontSize: "16px",
    textAlign: "center",
    padding: "40px",
  },
  usersContainer: {
    width: "100%",
  },
  usersTable: {
    background: "#1a1a1a",
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
    borderBottom: "2px solid #444",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    background: "#2a2a2a",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #444",
    color: "#ccc",
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
    color: "#fff",
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
    color: "#fff",
    display: "inline-block",
  },
};

