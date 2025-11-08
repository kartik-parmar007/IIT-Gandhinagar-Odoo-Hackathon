import { useState, useEffect } from "react";
import { salesOrderAPI, projectAPI } from "../services/api";

export default function SalesOrderCreateEdit({ onCancel, onConfirm, editData, fixedProject }) {
  const [orderNumber, setOrderNumber] = useState(editData?.orderNumber || "");
  const [customer, setCustomer] = useState(editData?.customer || "");
  const [project, setProject] = useState(editData?.project || fixedProject || "");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [orderLines, setOrderLines] = useState(
    editData?.orderLines && editData.orderLines.length > 0
      ? editData.orderLines.map((line, index) => ({
          ...line,
          id: line.id || index + 1,
          amount: calculateLineAmount(line),
        }))
      : [{ id: 1, product: "", quantity: 0, unit: "", unitPrice: 0, taxes: 0, amount: 0 }]
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
    if (!editData && !orderNumber) {
      // Fetch all sales orders to get the next sequential number starting from 1
      const fetchNextOrderNumber = async () => {
        try {
          const response = await salesOrderAPI.getAll();
          const orders = response.data || [];
          
          // Find the highest numeric order number
          let maxNumber = 0;
          orders.forEach((order) => {
            if (order.orderNumber) {
              const orderNumStr = order.orderNumber.toString().trim();
              // Check if it's a pure number
              if (/^\d+$/.test(orderNumStr)) {
                const num = parseInt(orderNumStr, 10);
                if (num > maxNumber) {
                  maxNumber = num;
                }
              } else {
                // Try to extract number from order number (e.g., "SO001" -> 1)
                const match = orderNumStr.match(/\d+/);
                if (match) {
                  const num = parseInt(match[0], 10);
                  if (num > maxNumber) {
                    maxNumber = num;
                  }
                }
              }
            }
          });
          
          // Set next order number (starting from 1 if no orders exist, otherwise maxNumber + 1)
          const nextNumber = maxNumber + 1;
          setOrderNumber(nextNumber.toString());
        } catch (error) {
          console.error("Error fetching sales orders:", error);
          // Default to 1 if fetch fails
          setOrderNumber("1");
        }
      };
      
      fetchNextOrderNumber();
    }
  }, [editData, orderNumber]);

  const calculateLineAmount = (line) => {
    const quantity = parseFloat(line.quantity) || 0;
    const unitPrice = parseFloat(line.unitPrice) || 0;
    const taxes = parseFloat(line.taxes) || 0;
    const baseAmount = quantity * unitPrice;
    const totalAmount = baseAmount * (1 + taxes / 100);
    return parseFloat(totalAmount.toFixed(2));
  };

  const handleAddProduct = () => {
    setOrderLines([
      ...orderLines,
      {
        id: Date.now(),
        product: "",
        quantity: 0,
        unit: "",
        unitPrice: 0,
        taxes: 0,
        amount: 0,
      },
    ]);
  };

  const handleLineChange = (id, field, value) => {
    setOrderLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value };
          // Recalculate amount if quantity, unitPrice, or taxes change
          if (["quantity", "unitPrice", "taxes"].includes(field)) {
            updatedLine.amount = calculateLineAmount(updatedLine);
          }
          return updatedLine;
        }
        return line;
      })
    );
  };

  const calculateTotals = () => {
    let untaxedAmount = 0;
    let totalAmount = 0;

    orderLines.forEach((line) => {
      const quantity = parseFloat(line.quantity) || 0;
      const unitPrice = parseFloat(line.unitPrice) || 0;
      const taxes = parseFloat(line.taxes) || 0;
      const baseAmount = quantity * unitPrice;
      untaxedAmount += baseAmount;
      totalAmount += baseAmount * (1 + taxes / 100);
    });

    return {
      untaxedAmount: untaxedAmount.toFixed(2),
      total: totalAmount.toFixed(2),
    };
  };

  const totals = calculateTotals();

  const handleConfirm = () => {
    if (!orderNumber || orderNumber.trim() === "") {
      alert("Order number is required");
      return;
    }
    const salesOrderData = {
      orderNumber: orderNumber.trim(),
      customer,
      project,
      orderLines: orderLines.filter(
        (line) => line.product.trim() !== ""
      ),
      untaxedAmount: parseFloat(totals.untaxedAmount),
      total: parseFloat(totals.total),
    };
    onConfirm(salesOrderData);
  };

  const handleCreateInvoice = () => {
    // This will be implemented later to create an invoice from the sales order
    alert("Create Invoice functionality will be implemented");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sales order Create/edit view</h2>

      <div style={styles.buttonContainer}>
        <button onClick={handleCreateInvoice} style={styles.createInvoiceButton}>
          Create Invoice
        </button>
        <button onClick={handleConfirm} style={styles.confirmButton}>
          Confirm
        </button>
        <button onClick={onCancel} style={styles.cancelButton}>
          Cancel
        </button>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Order Number</label>
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          style={styles.input}
          readOnly={!editData}
          placeholder={editData ? "Edit order number" : "Auto-generated"}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Customer</label>
        <input
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder="Enter customer name"
          style={styles.input}
        />
      </div>

      <div style={styles.fieldGroup}>
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

      <h3 style={styles.orderLinesHeader}>Order Lines</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Unit</th>
            <th style={styles.th}>Unit Price</th>
            <th style={styles.th}>Taxes</th>
            <th style={styles.th}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orderLines.map((line) => (
            <tr key={line.id}>
              <td style={styles.td}>
                <input
                  type="text"
                  value={line.product}
                  onChange={(e) =>
                    handleLineChange(line.id, "product", e.target.value)
                  }
                  placeholder="Product"
                  style={styles.lineInput}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  value={line.quantity}
                  onChange={(e) =>
                    handleLineChange(line.id, "quantity", e.target.value)
                  }
                  placeholder="0"
                  style={styles.lineInput}
                  min="0"
                />
              </td>
              <td style={styles.td}>
                <select
                  value={line.unit}
                  onChange={(e) =>
                    handleLineChange(line.id, "unit", e.target.value)
                  }
                  style={styles.lineInput}
                >
                  <option value="">Select Unit</option>
                  <option value="Piece">Piece</option>
                  <option value="Pack">Pack</option>
                  <option value="Box">Box</option>
                  <option value="Kilogram">Kilogram</option>
                  <option value="Gram">Gram</option>
                  <option value="Liter">Liter</option>
                  <option value="Meter">Meter</option>
                  <option value="Set">Set</option>
                  <option value="Dozen">Dozen</option>
                  <option value="Bottle">Bottle</option>
                </select>
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  value={line.unitPrice}
                  onChange={(e) =>
                    handleLineChange(line.id, "unitPrice", e.target.value)
                  }
                  placeholder="0.00"
                  style={styles.lineInput}
                  min="0"
                  step="0.01"
                />
              </td>
              <td style={styles.td}>
                <div style={styles.taxesContainer}>
                  <input
                    type="number"
                    value={line.taxes}
                    onChange={(e) =>
                      handleLineChange(line.id, "taxes", e.target.value)
                    }
                    placeholder="0"
                    style={styles.taxesInput}
                    min="0"
                    max="100"
                  />
                  <span style={styles.percent}>%</span>
                </div>
              </td>
              <td style={styles.td}>
                <input
                  type="text"
                  value={line.amount.toFixed(2)}
                  readOnly
                  style={styles.amountInput}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddProduct} style={styles.addProductButton}>
        Add a product
      </button>

      <div style={styles.summary}>
        <div style={styles.summaryLine}>
          <span style={styles.summaryLabel}>UnTaxed Amount:</span>
          <input
            type="text"
            value={totals.untaxedAmount}
            readOnly
            style={styles.summaryValue}
          />
        </div>
        <div style={styles.summaryLine}>
          <span style={styles.summaryLabel}>Total:</span>
          <input
            type="text"
            value={totals.total}
            readOnly
            style={styles.summaryValue}
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
    maxWidth: "1000px",
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
  createInvoiceButton: {
    padding: "10px 20px",
    background: "#7c3aed",
    color: "var(--text-primary)",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease",
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
  fieldGroup: {
    marginBottom: "20px",
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
  orderLinesHeader: {
    color: "var(--text-primary)",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "15px",
    marginTop: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "15px",
  },
  th: {
    borderBottom: "2px solid #444",
    padding: "12px 8px",
    textAlign: "left",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontWeight: "600",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid var(--border-color)",
  },
  lineInput: {
    width: "100%",
    padding: "8px",
    background: "var(--input-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  taxesContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  taxesInput: {
    width: "60px",
    padding: "8px",
    background: "var(--input-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    color: "var(--text-primary)",
    fontSize: "14px",
    textAlign: "center",
    outline: "none",
  },
  percent: {
    color: "var(--text-primary)",
    fontSize: "14px",
  },
  amountInput: {
    width: "100%",
    padding: "8px",
    background: "var(--input-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    textAlign: "right",
  },
  addProductButton: {
    background: "transparent",
    border: "none",
    color: "#ff4444",
    fontSize: "14px",
    cursor: "pointer",
    padding: "10px 0",
    textDecoration: "underline",
    marginTop: "10px",
  },
  summary: {
    marginTop: "30px",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "20px",
    textAlign: "right",
  },
  summaryLine: {
    marginBottom: "15px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "15px",
  },
  summaryLabel: {
    color: "var(--text-primary)",
    fontSize: "16px",
    fontWeight: "600",
  },
  summaryValue: {
    width: "150px",
    padding: "8px 12px",
    background: "var(--input-bg)",
    border: "none",
    borderBottom: "1px solid #444",
    color: "var(--text-primary)",
    fontSize: "16px",
    textAlign: "right",
    outline: "none",
  },
};

