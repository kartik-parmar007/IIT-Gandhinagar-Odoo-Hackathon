import { useState, useEffect } from "react";
import { projectAPI } from "../services/api";

export default function InvoiceCreateEdit({ onCancel, onConfirm, editData, fixedProject }) {
  const [customerInvoice, setCustomerInvoice] = useState(
    editData?.customerInvoice || ""
  );
  const [project, setProject] = useState(editData?.project || fixedProject || "");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [invoiceLines, setInvoiceLines] = useState(
    editData?.invoiceLines || [{ id: 1, product: "" }]
  );

  // Fetch existing projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await projectAPI.getAll();
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    
    fetchProjects();
  }, []);

  useEffect(() => {
    if (fixedProject) {
      setProject(fixedProject);
    }
  }, [fixedProject]);

  const handleAddProduct = () => {
    setInvoiceLines([
      ...invoiceLines,
      { id: Date.now(), product: "" },
    ]);
  };

  const handleProductChange = (id, value) => {
    setInvoiceLines(
      invoiceLines.map((line) =>
        line.id === id ? { ...line, product: value } : line
      )
    );
  };

  const handleConfirm = () => {
    const invoiceData = {
      customerInvoice,
      project,
      invoiceLines: invoiceLines.filter((line) => line.product.trim() !== ""),
    };
    onConfirm(invoiceData);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Invoice Create/edit view</h2>

      <div style={styles.buttonContainer}>
        <button onClick={handleConfirm} style={styles.confirmButton}>
          Confirm
        </button>
        <button onClick={onCancel} style={styles.cancelButton}>
          Cancel
        </button>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Customer Invoice</label>
        <input
          type="text"
          value={customerInvoice}
          onChange={(e) => setCustomerInvoice(e.target.value)}
          placeholder="Enter customer invoice"
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Project</label>
        {loadingProjects ? (
          <input
            type="text"
            value="Loading projects..."
            readOnly
            style={styles.input}
          />
        ) : (
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            style={styles.input}
            disabled={!!fixedProject}
          >
            <option value="">Select a project</option>
            {projects.map((proj) => (
              <option key={proj._id || proj.id} value={proj.name}>
                {proj.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Invoice Lines</h3>
        {invoiceLines.map((line) => (
          <div key={line.id} style={styles.productSection}>
            <label style={styles.label}>Product</label>
            <input
              type="text"
              value={line.product}
              onChange={(e) => handleProductChange(line.id, e.target.value)}
              placeholder="Enter product"
              style={styles.input}
            />
          </div>
        ))}
        <button onClick={handleAddProduct} style={styles.addProductButton}>
          Add a product
        </button>
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
    maxWidth: "600px",
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
    color: "var(--text-primary)",
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
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    color: "var(--text-primary)",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "15px",
  },
  label: {
    color: "var(--text-primary)",
    fontSize: "14px",
    display: "block",
    marginBottom: "8px",
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
  },
  productSection: {
    marginBottom: "20px",
  },
  addProductButton: {
    background: "transparent",
    border: "none",
    color: "#ff4444",
    fontSize: "14px",
    cursor: "pointer",
    padding: "10px 0",
    textDecoration: "underline",
  },
};

