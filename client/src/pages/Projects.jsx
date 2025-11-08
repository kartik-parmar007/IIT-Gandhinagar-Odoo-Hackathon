import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import ProjectCreateEdit from "../components/ProjectCreateEdit";
import { projectAPI } from "../services/api";

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [changingCoverId, setChangingCoverId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('[data-menu-container]')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjects(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
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
      Services: "#10b981",
      "Customer Care": "#ec4899",
      Help: "#10b981",
      Payments: "#ec4899",
      UI: "#3b82f6",
      Upgrade: "#10b981",
      Migration: "#ec4899",
      Feedback: "#10b981",
      Bug: "#ef4444",
    };
    return colors[tag] || "#7c3aed";
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    try {
      setLoading(true);
      await projectAPI.delete(projectId);
      setProjects(projects.filter((p) => (p._id || p.id) !== projectId));
      setOpenMenuId(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCover = (project) => {
    setChangingCoverId(project._id || project.id);
    setEditingProject(project);
    setShowCreateForm(true);
    setOpenMenuId(null);
  };

  const handleCoverImageChange = async (e, projectId) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image is too large. Please select an image smaller than 10MB.");
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        const project = projects.find((p) => (p._id || p.id) === projectId);
        if (project) {
          const updatedProject = await projectAPI.update(projectId, {
            ...project,
            image: base64String,
          });
          setProjects(
            projects.map((p) =>
              (p._id || p.id) === projectId ? updatedProject.data : p
            )
          );
        }
        setChangingCoverId(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error changing cover:", err);
      setError("Failed to change cover image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <Navbar />
        <div style={styles.container}>
          {/* New Button */}
          <div style={styles.actionBar}>
            <button
              onClick={() => {
                setEditingProject(null);
                setShowCreateForm(true);
                setError(null);
              }}
              style={styles.newButton}
              disabled={loading}
            >
              New
            </button>
          </div>

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

              {/* Content Area */}
              {showCreateForm ? (
                <ProjectCreateEdit
                  editData={editingProject}
                  onSave={async (projectData) => {
                    try {
                      setLoading(true);
                      setError(null);
                      if (editingProject) {
                        const response = await projectAPI.update(
                          editingProject._id || editingProject.id,
                          projectData
                        );
                        setProjects(
                          projects.map((p) =>
                            p._id === response.data._id ||
                            p.id === response.data._id
                              ? response.data
                              : p
                          )
                        );
                        setEditingProject(null);
                      } else {
                        const response = await projectAPI.create(projectData);
                        setProjects([response.data, ...projects]);
                      }
                      setShowCreateForm(false);
                    } catch (err) {
                      console.error("Error saving project:", err);
                      setError(
                        err.message || "Failed to save project. Please try again."
                      );
                    } finally {
                      setLoading(false);
                    }
                  }}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setEditingProject(null);
                  }}
                />
              ) : (
                <div style={styles.projectsContainer}>
                  {loading && projects.length === 0 ? (
                    <p style={styles.placeholderText}>Loading projects...</p>
                  ) : projects.length > 0 ? (
                    <div style={styles.cardsGrid}>
                      {projects.map((project) => (
                        <div
                          key={project._id || project.id}
                          style={styles.projectCard}
                          className="card-hover"
                          onClick={() => navigate(`/projects/${project._id || project.id}`)}
                        >
                          {/* Header with Project Name and Menu */}
                          <div style={styles.cardHeader}>
                            <div style={styles.cardHeaderLeft}>
                              <div style={styles.projectNameLabel}>Project:</div>
                              <h3 style={styles.cardTitle}>{project.name}</h3>
                            </div>
                            <div style={styles.cardHeaderRight}>
                              {/* Rating Stars */}
                              <div style={styles.ratingStars}>
                                {[1, 2, 3].map((star) => (
                                  <span
                                    key={star}
                                    className="icon-hover"
                                    style={{
                                      ...styles.star,
                                      color:
                                        star <= (project.rating || 0)
                                          ? "#fbbf24"
                                          : "#666",
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              {/* Kebab Menu */}
                              <div style={styles.menuContainer} data-menu-container>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(
                                      openMenuId === (project._id || project.id)
                                        ? null
                                        : project._id || project.id
                                    );
                                  }}
                                  style={styles.kebabButton}
                                >
                                  ⋮
                                </button>
                                {openMenuId === (project._id || project.id) && (
                                  <div style={styles.dropdownMenu}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingProject(project);
                                        setShowCreateForm(true);
                                        setOpenMenuId(null);
                                      }}
                                      style={styles.menuItem}
                                      className="tab-hover"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleChangeCover(project);
                                      }}
                                      style={styles.menuItem}
                                      className="tab-hover"
                                    >
                                      Change Cover
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(project._id || project.id);
                                      }}
                                      style={{ ...styles.menuItem, color: "#ef4444" }}
                                      className="tab-hover"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div style={styles.tagsContainer}>
                              {project.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="icon-hover"
                                  style={{
                                    ...styles.tag,
                                    background: getTagColor(tag),
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Project Image */}
                          {project.image ? (
                            <div style={styles.cardImageContainer}>
                              <img
                                src={project.image}
                                alt={project.name}
                                style={styles.cardImage}
                              />
                            </div>
                          ) : (
                            <div style={styles.placeholderImage}>
                              No cover image
                            </div>
                          )}

                          {/* Footer */}
                          <div style={styles.cardFooter}>
                            <span style={styles.cardDate}>
                              {formatDate(project.createdAt)}
                            </span>
                            {project.assigneeImage ? (
                              <img
                                src={project.assigneeImage}
                                alt="Assignee"
                                style={styles.assigneeImage}
                                className="icon-hover"
                              />
                            ) : (
                              <div style={styles.avatar} className="icon-hover">👤</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <p style={styles.placeholderText}>
                        No projects yet. Click "New" to create one.
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
  actionBar: {
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
    transition: "background 0.3s ease",
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
  projectsContainer: {
    width: "100%",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  projectCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "0",
    cursor: "default",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
  },
  cardHeaderLeft: {
    flex: 1,
  },
  projectNameLabel: {
    fontSize: "11px",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  cardHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "relative",
  },
  ratingStars: {
    display: "flex",
    gap: "2px",
  },
  star: {
    fontSize: "16px",
    color: "#666",
  },
  menuContainer: {
    position: "relative",
  },
  kebabButton: {
    background: "transparent",
    border: "none",
    color: "#6b7280",
    fontSize: "20px",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "4px",
    transition: "background 0.2s ease",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: "0",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    minWidth: "150px",
    zIndex: 1000,
    marginTop: "5px",
  },
  menuItem: {
    display: "block",
    width: "100%",
    padding: "10px 15px",
    background: "transparent",
    border: "none",
    textAlign: "left",
    color: "#374151",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    padding: "0 15px 10px 15px",
  },
  tag: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#fff",
  },
  cardImageContainer: {
    width: "100%",
    height: "180px",
    overflow: "hidden",
    background: "#f3f4f6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "180px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontSize: "14px",
  },
  cardTitle: {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
  },
  cardDate: {
    color: "#6b7280",
    fontSize: "12px",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 15px",
    borderTop: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  assigneeImage: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    objectFit: "cover",
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
