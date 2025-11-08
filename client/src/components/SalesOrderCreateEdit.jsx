import { useState, useEffect } from "react";

export default function SalesOrderCreateEdit({ onCancel, onConfirm, editData }) {
  const [orderNumber, setOrderNumber] = useState(editData?.orderNumber || "");
  const [customer, setCustomer] = useState(editData?.customer || "");
  const [project, setProject] = useState(editData?.project || "");
  const [orderLines, setOrderLines] = useState(
    editData?.orderLines && editData.orderLines.length > 0
      ? editData.orderLines.map((line, index) => ({
          ...line,
          id: line.id || index + 1,
          amount: calculateLineAmount(line),
        }))
      : [{ id: 1, product: "", quantity: 0, unit: "", unitPrice: 0, taxes: 0, amount: 0 }]
  );

  useEffect(() => {
    if (!editData && !orderNumber) {
      // Generate order number for new orders
      const timestamp = Date.now();
      setOrderNumber(`S${timestamp.toString().slice(-6)}`);
    }
  }, []);

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
    const salesOrderData = {
      orderNumber: orderNumber || `S${Date.now().toString().slice(-6)}`,
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
        <input
          type="text"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="Enter project name"
          style={styles.input}
        />
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
                <input
                  type="text"
                  value={line.unit}
                  onChange={(e) =>
                    handleLineChange(line.id, "unit", e.target.value)
                  }
                  placeholder="Unit"
                  style={styles.lineInput}
                />
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
    background: "#2a2a2a",
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
    color: "#fff",
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
    marginBottom: "20px",
  },
  label: {
    color: "#fff",
    fontSize: "14px",
    display: "block",
    marginBottom: "8px",
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
  },
  orderLinesHeader: {
    color: "#fff",
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
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #333",
  },
  lineInput: {
    width: "100%",
    padding: "8px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  taxesContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  taxesInput: {
    width: "60px",
    padding: "8px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "14px",
    textAlign: "center",
    outline: "none",
  },
  percent: {
    color: "#fff",
    fontSize: "14px",
  },
  amountInput: {
    width: "100%",
    padding: "8px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#fff",
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
    borderTop: "1px solid #444",
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
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
  },
  summaryValue: {
    width: "150px",
    padding: "8px 12px",
    background: "#1a1a1a",
    border: "none",
    borderBottom: "1px solid #444",
    color: "#fff",
    fontSize: "16px",
    textAlign: "right",
    outline: "none",
  },
};

