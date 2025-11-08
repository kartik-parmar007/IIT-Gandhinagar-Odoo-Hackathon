import { useState, useEffect } from "react";
import { projectAPI } from "../services/api";

export default function ExpenseCreateEdit({ onCancel, onConfirm, editData, fixedProject }) {
  const [name, setName] = useState(editData?.name || "");
  const [expensePeriod, setExpensePeriod] = useState(editData?.expensePeriod || "");
  const [project, setProject] = useState(editData?.project || fixedProject || "");
  const [projects, setProjects] = useState([]);
  const [image, setImage] = useState(editData?.image || null);
  const [imagePreview, setImagePreview] = useState(editData?.image || null);
  const [description, setDescription] = useState(editData?.description || "");

  // Fetch all projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectAPI.getAll();
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Update state when editData changes
  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setExpensePeriod(editData.expensePeriod || "");
      setProject(editData.project || "");
      setImage(editData.image || null);
      setImagePreview(editData.image || null);
      setDescription(editData.description || "");
    } else {
      // Reset form when creating new expense
      setName("");
      setExpensePeriod("");
      setProject("");
      setImage(null);
      setImagePreview(null);
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

          // Calculate new dimensions
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

          // Convert to base64 with compression
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
      // Check file size (max 10MB before compression)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image is too large. Please select an image smaller than 10MB.");
        return;
      }

      try {
        // Compress image before converting to base64
        const compressedBase64 = await compressImage(file);
        setImage(compressedBase64);
        setImagePreview(compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
        // Fallback to original if compression fails
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

  const handleConfirm = () => {
    // Ensure expensePeriod is a string
    const expensePeriodString = expensePeriod ? String(expensePeriod).trim() : "";
    
    const expenseData = {
      name,
      expensePeriod: expensePeriodString,
      project,
      image: image || null,
      description,
    };
    onConfirm(expenseData);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Expense Create/edit view</h2>

      <div style={styles.buttonContainer}>
        <button onClick={handleConfirm} style={styles.confirmButton}>
          Confirm
        </button>
        <button onClick={onCancel} style={styles.cancelButton}>
          Cancel
        </button>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter expense name"
          style={styles.input}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Expense Period</label>
        <input
          type="text"
          value={expensePeriod}
          onChange={(e) => setExpensePeriod(e.target.value)}
          placeholder="Enter expense period (e.g., January 2024)"
          style={styles.input}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Project</label>
        {fixedProject ? (
          <input
            type="text"
            value={project}
            readOnly
            style={styles.input}
          />
        ) : (
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            style={{ ...styles.input, cursor: "pointer" }}
          >
            <option value="">Select a project (optional)</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj.name}>
                {proj.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Image</label>
        <div style={styles.imageContainer}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
            id="image-upload"
          />
          <label htmlFor="image-upload" style={styles.uploadButton}>
            <span style={styles.uploadIcon}>📤</span>
            Upload Image
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
        <label style={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter expense description"
          style={styles.textarea}
          rows={6}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#2a2a2a",
    borderRadius: "8px",
    padding: "30px",
    border: "1px solid #ff4444",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    color: "#ff4444",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
  },
  confirmButton: {
    padding: "10px 20px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)",
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
  },
  fieldGroup: {
    marginBottom: "25px",
  },
  label: {
    color: "#fff",
    fontSize: "14px",
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
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
    color: "#fff",
    border: "1px solid #7c3aed",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "fit-content",
    transition: "background 0.3s ease",
  },
  uploadIcon: {
    fontSize: "18px",
  },
  imagePreview: {
    position: "relative",
    width: "200px",
    height: "200px",
    border: "1px solid #444",
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
    color: "#fff",
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
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
};

