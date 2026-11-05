import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceSort,setPriceSort]=useState("none");

  const ordersPerPage = 5;

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/orders");
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Search orders by ID, customer name or email
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const orderId = String(order.id || "").toLowerCase();

    const customerName = (
      order.customer?.name || order.customerName || ""
    ).toLowerCase();

    const customerEmail = (
      order.customer?.email || order.customerEmail || ""
    ).toLowerCase();

    return (
      orderId.includes(search) ||
      customerName.includes(search) ||
      customerEmail.includes(search)
    );
  });

  const sortedOrder =[...filteredOrders].sort((a,b)=>{
    const priceA = Number(a.totalPrice ||0);
    const priceB =Number(b.totalPrice ||0);

    if(priceSort === "asc") return priceA-priceB;
    if(priceSort==="desc") return priceB-priceA;

    return priceSort ==="asc"? priceA-priceB:priceB-priceA;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const startIndex = (currentPage - 1) * ordersPerPage;

  const displayedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  // Update Order Status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:3001/orders/${id}`, {
        status: status,
      });

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          String(order.id) === String(id)
            ? { ...order, status: status }
            : order
        )
      );

      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <p style={{ fontFamily: "Georgia, serif", fontSize: "16px" }}>
        Loading orders...
      </p>
    );
  }

  return (
    <div
      style={{
        padding: "25px",
        color: "#5C3A25",
        fontFamily: "Georgia, serif",
        fontSize: "16px",
      }}
    >
      <h2 style={{ fontSize: "16px", fontFamily: "Georgia, serif" }}>
        Manage Orders
      </h2>
      <select 
      value={priceSort}
      onChange={(e)=>setPriceSort(e.target.value)}>
        <option value="none">All</option>
        <option value="asc">High to Low</option>
        <option value="desc">Low To High</option>
      </select>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Order ID, Customer name or Email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "15px",
          marginBottom: "15px",
          border: "1px solid #D2B48C",
          borderRadius: "6px",
          fontFamily: "Georgia, serif",
          fontSize: "14px",
          outline: "none",
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#FFF8F0",
            fontFamily: "Georgia, serif",
            fontSize: "16px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#5C3A25",
                color: "white",
              }}
            >
              {[
                "Order ID",
                "Customer",
                "Total Price",
                "Date",
                "Status",
                "Update Status",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    padding: "12px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{ padding: "20px", textAlign: "center" }}
                >
                  No orders found
                </td>
              </tr>
            )}

            {sortedOrder.map((order) => (
              <tr key={order.id}>
                <td style={{ padding: "12px", fontSize: "16px" }}>
                  {order.id}
                </td>

                <td style={{ padding: "12px", fontSize: "16px" }}>
                  {order.customer?.name || order.customerName || "N/A"}
                </td>

                <td style={{ padding: "12px", fontSize: "16px" }}>
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                </td>

                <td style={{ padding: "12px", fontSize: "16px" }}>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN")
                    : "N/A"}
                </td>

                <td style={{ padding: "12px", fontSize: "16px" }}>
                  {order.status || "pending"}
                </td>

                <td style={{ padding: "12px" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      minWidth: "150px",
                    }}
                  >
                    <select
                      value={order.status || "pending"}
                      onChange={(event) =>
                        updateStatus(order.id, event.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "11px 35px 11px 14px",
                        backgroundColor: "#F5E6D3",
                        color: "#5C3A25",
                        border: "1px solid #D2B48C",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontFamily: "Georgia, serif",
                        fontWeight: "500",
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                        WebkitAppearance: "none",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>

                    <span
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#5C3A25",
                        pointerEvents: "none",
                        fontSize: "16px",
                      }}
                    >
                      ▼
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "8px 15px",
            backgroundColor: currentPage === 1 ? "#D2B48C" : "#5C3A25",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            fontFamily: "Georgia, serif",
          }}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{
            padding: "8px 15px",
            backgroundColor:
              currentPage === totalPages || totalPages === 0
                ? "#D2B48C"
                : "#5C3A25",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor:
              currentPage === totalPages || totalPages === 0
                ? "not-allowed"
                : "pointer",
            fontFamily: "Georgia, serif",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminOrders;