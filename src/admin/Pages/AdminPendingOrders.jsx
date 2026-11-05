import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminPendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/orders");

      const pendingOrders = response.data.filter(
        (order) =>
          String(order.status || "").toLowerCase() === "pending"
      );

      setOrders(pendingOrders);
    } catch (error) {
      toast.error("Failed to load pending orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString();
  };

  const styles = {
    page: {
      padding: "30px",
      background: "#FAF6F0",
      minHeight: "100vh",
      fontFamily: "Georgia, serif",
      fontSize: "16px",
    },

    heading: {
      color: "#5C3A25",
      fontSize: "16px",
      marginBottom: "8px",
      fontFamily: "Georgia, serif",
      fontWeight: "normal",
    },

    description: {
      color: "#8A715E",
      marginBottom: "25px",
      fontSize: "16px",
      fontFamily: "Georgia, serif",
    },

    tableWrapper: {
      width: "100%",
      overflowX: "auto",
      background: "#FFFDF8",
      borderRadius: "12px",
      border: "1px solid #E5D5C4",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "750px",
      fontFamily: "Georgia, serif",
      fontSize: "16px",
    },

    th: {
      padding: "15px",
      background: "#5C3A25",
      color: "#FFFDF8",
      textAlign: "left",
      fontSize: "16px",
      fontWeight: "normal",
    },

    td: {
      padding: "15px",
      borderBottom: "1px solid #EADFD2",
      color: "#5C3A25",
      fontSize: "16px",
    },

    badge: {
      background: "#FFF0D6",
      color: "#9A641D",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "16px",
      fontFamily: "Georgia, serif",
    },

    button: {
      padding: "8px 14px",
      background: "#70452F",
      color: "#FFFDF8",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontFamily: "Georgia, serif",
    },

    empty: {
      textAlign: "center",
      padding: "30px",
      color: "#8A715E",
      fontSize: "16px",
    },

    loading: {
      fontSize: "16px",
      fontFamily: "Georgia, serif",
      color: "#8A715E",
    },
  };

  return (
    <div style={styles.page}>
      <button
        onClick={() => navigate("/admin")}
        style={{ ...styles.button, marginBottom: "20px" }}
      >
        Back to Dashboard
      </button>

      <h2 style={styles.heading}>Pending Orders</h2>

      <p style={styles.description}>
        View all orders that are waiting to be processed.
      </p>

      {loading ? (
        <p style={styles.loading}>Loading pending orders...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Total Price</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.empty}>
                    No pending orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td style={styles.td}>#{order.id}</td>

                    <td style={styles.td}>
                      {order.customerName || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {order.email || "N/A"}
                    </td>

                    <td style={styles.td}>
                      ₹
                      {Number(order.totalPrice || 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td style={styles.td}>
                      {formatDate(order.createdAt)}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.badge}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPendingOrders;