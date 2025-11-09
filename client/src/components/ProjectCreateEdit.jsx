import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProjectCreateEdit({ onCancel, onSave, editData }) {
  const { getToken } = useAuth();
  const [name, setName] = useState(editData?.name || "");
  const [tags, setTags] = useState(editData?.tags || []);
  const [projectManager, setProjectManager] = useState(
    editData?.projectManager || ""
  );
  const [deadline, setDeadline] = useState(editData?.deadline || "");
  const [priority, setPriority] = useState(editData?.priority || "Medium");
  const [rating, setRating] = useState(editData?.rating || 0);
  const [image, setImage] = useState(editData?.image || null);
  const [imagePreview, setImagePreview] = useState(editData?.image || null);
  const [assigneeImage, setAssigneeImage] = useState(editData?.assigneeImage || null);
  const [assigneeImagePreview, setAssigneeImagePreview] = useState(
    editData?.assigneeImage || null
  );
  const [description, setDescription] = useState(editData?.description || "");
  const [tagInput, setTagInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Available options for dropdowns
  const availableTags = [
    "Services",
    "Customer Care",
    "Help",
    "Payments",
    "UI",
    "Upgrade",
    "Migration",
  ];

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const token = await getToken();
        
        if (!token) {
          console.warn("No authentication token available");
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/users`, {
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
      } catch (err) {
        console.error("Error fetching users:", err);
        // Set empty array on error, so UI doesn't break
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [getToken]);

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setTags(editData.tags || []);
      setProjectManager(editData.projectManager || "");
      setDeadline(editData.deadline || "");
      setPriority(editData.priority || "Medium");
      setRating(editData.rating || 0);
      setImage(editData.image || null);
      setImagePreview(editData.image || null);
      setAssigneeImage(editData.assigneeImage || null);
      setAssigneeImagePreview(editData.assigneeImage || null);
      setDescription(editData.description || "");
    } else {
      setName("");
      setTags([]);
      setProjectManager("");
      setDeadline("");
      setPriority("Medium");
      setRating(0);
      setImage(null);
      setImagePreview(null);
      setAssigneeImage(null);
      setAssigneeImagePreview(null);
      setDescription("");
    }
  }, [editData]);

  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image is too large. Please select an image smaller than 10MB.");
        return;
      }

      try {
        const compressedBase64 = await compressImage(file);
        setImage(compressedBase64);
        setImagePreview(compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setImage(base64String);
          setImagePreview(base64String);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAssigneeImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large. Please select an image smaller than 5MB.");
        return;
      }

      try {
        const compressedBase64 = await compressImage(file, 200, 200, 0.9);
        setAssigneeImage(compressedBase64);
        setAssigneeImagePreview(compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setAssigneeImage(base64String);
          setAssigneeImagePreview(base64String);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    const projectData = {
      name: name.trim(),
      tags: tags || [],
      projectManager: projectManager || "",
      deadline: deadline ? String(deadline) : "",
      priority: priority || "Medium",
      rating: rating !== undefined ? rating : 0,
      image: image || null,
      assigneeImage: assigneeImage || null,
      description: description || "",
    };
    onSave(projectData);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.breadcrumbs}>
          <span style={styles.breadcrumbItem}>Projects</span>
          <span style={styles.breadcrumbSeparator}> &gt; </span>
          <span style={styles.breadcrumbItem}>
            {editData ? editData.name : "New Project"}
          </span>
        </div>
        <div style={styles.headerButtons}>
          <button onClick={onCancel} style={styles.discardButton}>
            Discard
          </button>
          <button onClick={handleSave} style={styles.saveButton}>
            Save
          </button>
        </div>
      </div>

      <h2 style={styles.title}>Project create/edit view</h2>

      <div style={styles.form}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Project Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Tags</label>
          <div style={styles.tagContainer}>
            <div style={styles.selectedTags}>
              {tags.map((tag, index) => (
                <span key={index} style={styles.tag}>
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    style={styles.removeTag}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <select
              value={tagInput}
              onChange={(e) => {
                if (e.target.value) {
                  handleAddTag(e.target.value);
                }
              }}
              style={styles.select}
            >
              <option value="">Select a tag...</option>
              {availableTags
                .filter((tag) => !tags.includes(tag))
                .map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
            </select>
            <span style={styles.fieldHint}>Multi Selection Dropdown</span>
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Project Manager</label>
          {loadingUsers ? (
            <div style={styles.loadingText}>Loading users...</div>
          ) : (
            <select
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
              style={styles.select}
            >
              <option value="">Select project manager...</option>
              {users.map((user) => {
                const userName = user.fullName || user.name || user.email || "Unknown User";
                return (
                  <option key={user.id} value={user.id}>
                    {userName}
                  </option>
                );
              })}
            </select>
          )}
          <span style={styles.fieldHint}>Single Selection Dropdown</span>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={styles.input}
          />
          <span style={styles.fieldHint}>Date Selection Field</span>
          {deadline && (
            <div style={styles.deadlineInfo}>
              Days remaining: D-{calculateDaysRemaining(deadline) || "N/A"}
            </div>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Priority</label>
          <div style={styles.radioGroup}>
            {["Low", "Medium", "High"].map((p) => (
              <label key={p} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={(e) => setPriority(e.target.value)}
                  style={styles.radio}
                />
                {p}
              </label>
            ))}
          </div>
          <span style={styles.fieldHint}>Single Radio Selection</span>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Rating (Priority Stars)</label>
          <div style={styles.ratingContainer}>
            {[1, 2, 3].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={styles.starButton}
              >
                <span
                  style={{
                    ...styles.star,
                    color: star <= (rating || 0) ? "#fbbf24" : "#666",
                  }}
                >
                  ★
                </span>
              </button>
            ))}
            <span style={styles.ratingText}>
              {(rating || 0) > 0 ? `${rating || 0} of 3 stars` : "No rating"}
            </span>
          </div>
          <span style={styles.fieldHint}>Click stars to set rating (0-3)</span>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Project Cover Image</label>
          <div style={styles.imageContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
              id="project-image-upload"
            />
            <label htmlFor="project-image-upload" style={styles.uploadButton}>
              <span style={styles.uploadIcon}>📤</span>
              Upload Cover Image
            </label>
            {imagePreview && (
              <div style={styles.imagePreview}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={styles.previewImage}
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  style={styles.removeImage}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Assignee Image</label>
          <div style={styles.imageContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={handleAssigneeImageChange}
              style={styles.fileInput}
              id="assignee-image-upload"
            />
            <label htmlFor="assignee-image-upload" style={styles.uploadButton}>
              <span style={styles.uploadIcon}>📤</span>
              Upload Assignee Image
            </label>
            {assigneeImagePreview && (
              <div style={styles.imagePreview}>
                <img
                  src={assigneeImagePreview}
                  alt="Assignee Preview"
                  style={styles.previewImage}
                />
                <button
                  onClick={() => {
                    setAssigneeImage(null);
                    setAssigneeImagePreview(null);
                  }}
                  style={styles.removeImage}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            style={styles.textarea}
            rows={6}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "var(--bg-secondary)",
    borderRadius: "8px",
    padding: "30px",
    border: "1px solid #ff4444",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #444",
  },
  breadcrumbs: {
    color: "var(--text-primary)",
    fontSize: "14px",
  },
  breadcrumbItem: {
    color: "#a78bfa",
  },
  breadcrumbSeparator: {
    color: "#666",
    margin: "0 5px",
  },
  headerButtons: {
    display: "flex",
    gap: "10px",
  },
  discardButton: {
    padding: "10px 20px",
    background: "#3b82f6",
    color: "var(--text-primary)",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 20px",
    background: "#10b981",
    color: "var(--text-primary)",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  title: {
    color: "#ff4444",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "var(--text-primary)",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  fieldHint: {
    color: "#888",
    fontSize: "12px",
    fontStyle: "italic",
  },
  loadingText: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontStyle: "italic",
    padding: "10px 0",
  },
  tagContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  selectedTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 12px",
    background: "#7c3aed",
    color: "var(--text-primary)",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  removeTag: {
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0",
    marginLeft: "5px",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--text-primary)",
    fontSize: "14px",
    cursor: "pointer",
  },
  radio: {
    cursor: "pointer",
  },
  deadlineInfo: {
    color: "#a78bfa",
    fontSize: "12px",
    marginTop: "5px",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  fileInput: {
    display: "none",
  },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "#7c3aed",
    color: "var(--text-primary)",
    border: "1px solid #7c3aed",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "fit-content",
  },
  uploadIcon: {
    fontSize: "18px",
  },
  imagePreview: {
    position: "relative",
    width: "200px",
    height: "200px",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  removeImage: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "#ef4444",
    color: "var(--text-primary)",
    border: "none",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  starButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "5px",
  },
  star: {
    fontSize: "24px",
    transition: "color 0.2s ease",
  },
  ratingText: {
    color: "#888",
    fontSize: "14px",
    marginLeft: "10px",
  },
};

