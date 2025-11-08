import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import TaskCreateEdit from "../components/TaskCreateEdit";
import { taskAPI, projectAPI } from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "list"
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(12);
  const [draggedTask, setDraggedTask] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAll();
      setTasks(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
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

  const calculateDaysRemaining = (deadline) => {
    if (!deadline) return null;
    try {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      Feedback: "#10b981",
      Bug: "#ef4444",
      Feature: "#3b82f6",
      Enhancement: "#8b5cf6",
      Urgent: "#f59e0b",
    };
    return colors[tag] || "#7c3aed";
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTask) return;

    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      setLoading(true);
      const updatedTask = await taskAPI.update(draggedTask._id || draggedTask.id, {
        ...draggedTask,
        status: newStatus,
      });
      setTasks(
        tasks.map((t) =>
          (t._id || t.id) === (draggedTask._id || draggedTask.id)
            ? updatedTask.data
            : t
        )
      );
      setDraggedTask(null);
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status");
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const kanbanColumns = ["New", "In Progress", "Done"];

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Responsive breakpoints
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isLaptop = windowWidth >= 1024;

  // Get responsive styles
  const getResponsiveStyles = () => {
    const baseStyles = { ...styles };
    
    if (isMobile) {
      return {
        ...baseStyles,
        container: { ...baseStyles.container, padding: "10px" },
        header: { ...baseStyles.header, flexDirection: "column", gap: "15px", alignItems: "flex-start" },
        title: { ...baseStyles.title, fontSize: "20px" },
        viewControls: { ...baseStyles.viewControls, width: "100%" },
        viewButton: { ...baseStyles.viewButton, flex: 1, fontSize: "12px", padding: "8px 12px" },
        controlsBar: { ...baseStyles.controlsBar, flexDirection: "column", gap: "10px", alignItems: "stretch" },
        newButton: { ...baseStyles.newButton, width: "100%", fontSize: "14px", padding: "10px 20px" },
        kanbanBoard: { ...baseStyles.kanbanBoard, gridTemplateColumns: "1fr", gap: "15px" },
        kanbanColumn: { ...baseStyles.kanbanColumn, minHeight: "300px", padding: "10px" },
        columnTitle: { ...baseStyles.columnTitle, fontSize: "16px" },
        taskCard: { ...baseStyles.taskCard, padding: "10px" },
        cardTitle: { ...baseStyles.cardTitle, fontSize: "12px" },
        cardImageContainer: { ...baseStyles.cardImageContainer, height: "100px" },
        listItem: { ...baseStyles.listItem, flexDirection: "column", gap: "10px" },
        listImage: { ...baseStyles.listImage, width: "100%", height: "150px" },
        listTitle: { ...baseStyles.listTitle, fontSize: "14px" },
        listMeta: { ...baseStyles.listMeta, flexDirection: "column", gap: "8px" },
      };
    } else if (isTablet) {
      return {
        ...baseStyles,
        container: { ...baseStyles.container, padding: "15px" },
        kanbanBoard: { ...baseStyles.kanbanBoard, gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" },
        kanbanColumn: { ...baseStyles.kanbanColumn, minHeight: "400px", padding: "12px" },
        columnTitle: { ...baseStyles.columnTitle, fontSize: "16px" },
        taskCard: { ...baseStyles.taskCard, padding: "10px" },
        cardTitle: { ...baseStyles.cardTitle, fontSize: "13px" },
        cardImageContainer: { ...baseStyles.cardImageContainer, height: "110px" },
      };
    }
    
    return baseStyles;
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <>
      <SignedIn>
        <Navbar />
        <div style={responsiveStyles.container}>
          {/* Header with View Switcher */}
          <div style={responsiveStyles.header}>
            <h1 style={responsiveStyles.title}>Tasks View</h1>
            <div style={responsiveStyles.viewControls}>
              <button
                onClick={() => setViewMode("kanban")}
                style={{
                  ...responsiveStyles.viewButton,
                  ...(viewMode === "kanban" ? responsiveStyles.activeViewButton : {}),
                }}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  ...responsiveStyles.viewButton,
                  ...(viewMode === "list" ? responsiveStyles.activeViewButton : {}),
                }}
              >
                List
              </button>
            </div>
          </div>

          {/* Pagination and New Button */}
          <div style={responsiveStyles.controlsBar}>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowCreateForm(true);
                setError(null);
              }}
              style={responsiveStyles.newButton}
              disabled={loading}
            >
              New
            </button>
            {viewMode === "list" && tasks.length > 0 && (
              <div style={responsiveStyles.pagination}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={responsiveStyles.pageButton}
                >
                  ←
                </button>
                <span style={responsiveStyles.pageInfo}>
                  {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, tasks.length)}/{tasks.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  style={responsiveStyles.pageButton}
                >
                  →
                </button>
              </div>
            )}
          </div>

          {error && (
            <div style={responsiveStyles.errorMessage}>
              {error}
              <button onClick={() => setError(null)} style={responsiveStyles.errorClose}>
                ×
              </button>
            </div>
          )}

          {/* Content Area */}
          {showCreateForm ? (
            <TaskCreateEdit
              editData={editingTask}
              projects={projects}
              onSave={async (taskData) => {
                try {
                  setLoading(true);
                  setError(null);
                  if (editingTask) {
                    const response = await taskAPI.update(
                      editingTask._id || editingTask.id,
                      taskData
                    );
                    setTasks(
                      tasks.map((t) =>
                        (t._id || t.id) === response.data._id ||
                        t.id === response.data._id
                          ? response.data
                          : t
                      )
                    );
                    setEditingTask(null);
                  } else {
                    const response = await taskAPI.create(taskData);
                    setTasks([response.data, ...tasks]);
                  }
                  setShowCreateForm(false);
                } catch (err) {
                  console.error("Error saving task:", err);
                  setError(
                    err.message || "Failed to save task. Please try again."
                  );
                } finally {
                  setLoading(false);
                }
              }}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingTask(null);
              }}
            />
          ) : viewMode === "kanban" ? (
            <div style={responsiveStyles.kanbanBoard}>
              {kanbanColumns.map((column) => (
                <div
                  key={column}
                  style={responsiveStyles.kanbanColumn}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column)}
                >
                  <div style={responsiveStyles.columnHeader}>
                    <h3 style={responsiveStyles.columnTitle}>{column}</h3>
                    <span style={responsiveStyles.columnCount}>
                      {getTasksByStatus(column).length}
                    </span>
                  </div>
                  <div style={responsiveStyles.columnContent}>
                    {getTasksByStatus(column).map((task) => (
                      <div
                        key={task._id || task.id}
                        style={responsiveStyles.taskCard}
                        draggable={!isMobile}
                        onDragStart={(e) => !isMobile && handleDragStart(e, task)}
                        onClick={() => {
                          setEditingTask(task);
                          setShowCreateForm(true);
                        }}
                      >
                        {task.image && (
                          <div style={responsiveStyles.cardImageContainer}>
                            <img
                              src={task.image}
                              alt={task.name}
                              style={responsiveStyles.cardImage}
                            />
                          </div>
                        )}
                        <div style={responsiveStyles.cardContent}>
                          <div style={responsiveStyles.cardHeader}>
                            <h4 style={responsiveStyles.cardTitle}>{task.name}</h4>
                            {/* Rating Stars */}
                            <div style={responsiveStyles.ratingStars}>
                              {[1, 2, 3].map((star) => (
                                <span
                                  key={star}
                                  style={{
                                    ...responsiveStyles.star,
                                    color:
                                      star <= (task.rating || 0)
                                        ? "#fbbf24"
                                        : "#666",
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          {task.tags && task.tags.length > 0 && (
                            <div style={responsiveStyles.cardTags}>
                              {task.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    ...responsiveStyles.tag,
                                    background: getTagColor(tag),
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={responsiveStyles.cardMeta}>
                            <span style={responsiveStyles.cardDate}>
                              {formatDate(task.createdAt)}
                            </span>
                            {task.deadline && (
                              <span style={responsiveStyles.dueDate}>
                                D-{calculateDaysRemaining(task.deadline) || "N/A"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={responsiveStyles.listView}>
              {loading && tasks.length === 0 ? (
                <p style={responsiveStyles.placeholderText}>Loading tasks...</p>
              ) : currentTasks.length > 0 ? (
                <div style={responsiveStyles.listContainer}>
                  {currentTasks.map((task) => (
                    <div
                      key={task._id || task.id}
                      style={responsiveStyles.listItem}
                      onClick={() => {
                        setEditingTask(task);
                        setShowCreateForm(true);
                      }}
                    >
                      {task.image && (
                        <img
                          src={task.image}
                          alt={task.name}
                          style={responsiveStyles.listImage}
                        />
                      )}
                      <div style={responsiveStyles.listContent}>
                        <h4 style={responsiveStyles.listTitle}>{task.name}</h4>
                        <div style={responsiveStyles.listMeta}>
                          <span>Status: {task.status}</span>
                          <span>Priority: {task.priority}</span>
                          {task.project && <span>Project: {task.project}</span>}
                          <span>{formatDate(task.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={responsiveStyles.emptyState}>
                  <p style={responsiveStyles.placeholderText}>
                    No tasks yet. Click "New" to create one.
                  </p>
                </div>
              )}
            </div>
          )}
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#fff",
    margin: 0,
  },
  viewControls: {
    display: "flex",
    gap: "10px",
  },
  viewButton: {
    padding: "8px 16px",
    background: "transparent",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#888",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  activeViewButton: {
    background: "#7c3aed",
    borderColor: "#7c3aed",
    color: "#fff",
  },
  controlsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
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
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  pageButton: {
    padding: "8px 12px",
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  pageInfo: {
    color: "#888",
    fontSize: "14px",
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
  kanbanBoard: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
  },
  kanbanColumn: {
    background: "#2a2a2a",
    borderRadius: "8px",
    padding: "15px",
    minHeight: "500px",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #444",
  },
  columnTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
    margin: 0,
  },
  columnCount: {
    background: "#444",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  columnContent: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  taskCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    cursor: "grab",
  },
  cardImageContainer: {
    width: "100%",
    height: "120px",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "10px",
    background: "#f3f4f6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
    flex: 1,
  },
  ratingStars: {
    display: "flex",
    gap: "2px",
  },
  star: {
    fontSize: "12px",
    color: "#666",
  },
  cardTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  tag: {
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "600",
    color: "#fff",
  },
  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#6b7280",
  },
  cardDate: {
    color: "#6b7280",
  },
  dueDate: {
    color: "#a78bfa",
    fontWeight: "600",
  },
  listView: {
    marginTop: "20px",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  listItem: {
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    gap: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  listImage: {
    width: "80px",
    height: "80px",
    borderRadius: "4px",
    objectFit: "cover",
    background: "#1a1a1a",
  },
  listContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    margin: 0,
  },
  listMeta: {
    display: "flex",
    gap: "15px",
    fontSize: "12px",
    color: "#888",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  placeholderText: {
    color: "#888",
    fontSize: "16px",
  },
};
