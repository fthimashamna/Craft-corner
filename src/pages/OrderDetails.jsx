import { useEffect, useState } from "react";
import axios from "axios";
import { getUserOrders } from "../services/orderService";
import toast from "react-hot-toast";

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        toast.error("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const data = await getUserOrders(userId);
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Cancel order with toast confirmation
  const handleCancelOrder = (order) => {
    const status = String(order.status || "pending").toLowerCase();

    if (
      ["cancelled", "canceled", "shipped", "delivered"].includes(status)
    ) {
      toast.error("This order can no longer be cancelled.");
      return;
    }

    if (cancellingOrderId !== null) {
      toast.error("Please wait for the current cancellation to finish.");
      return;
    }

    toast(
      (t) => (
        <div
          style={{
            padding: "5px",
            width: "100%",
            maxWidth: "300px",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              color: "#5C3A25",
              fontWeight: "bold",
              fontSize: "16px",
              overflowWrap: "anywhere",
            }}
          >
            Cancel Order #{order.id}?
          </p>

          <p
            style={{
              margin: "0 0 16px",
              color: "#8B6B55",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            Are you sure you want to cancel this order?
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                setCancellingOrderId(order.id);

                try {
                  await axios.patch(
                    `http://localhost:3001/orders/${order.id}`,
                    {
                      status: "cancelled",
                    }
                  );

                  setOrders((previousOrders) =>
                    previousOrders.map((item) =>
                      String(item.id) === String(order.id)
                        ? { ...item, status: "cancelled" }
                        : item
                    )
                  );

                  toast.success(
                    `Order #${order.id} cancelled successfully!`
                  );
                } catch (err) {
                  console.error("Failed to cancel order:", err);

                  toast.error(
                    "Unable to cancel this order. Please try again."
                  );
                } finally {
                  setCancellingOrderId(null);
                }
              }}
              style={{
                padding: "9px 12px",
                backgroundColor: "#B42318",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                maxWidth: "100%",
              }}
            >
              Confirm Cancellation
            </button>

            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "9px 12px",
                backgroundColor: "#F5EBDD",
                color: "#70452F",
                border: "1px solid #D8C7B5",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Keep Order
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
        style: {
          background: "#FFFFFF",
          border: "1px solid #E8D5BE",
          borderRadius: "12px",
          padding: "15px",
          boxShadow: "0 4px 15px rgba(92,58,37,0.15)",
          maxWidth: "95vw",
          boxSizing: "border-box",
        },
      }
    );
  };

  // Order status styling
  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "pending").toLowerCase();

    if (["cancelled", "canceled"].includes(normalizedStatus)) {
      return {
        backgroundColor: "#FCE8E6",
        color: "#B42318",
      };
    }

    if (normalizedStatus === "delivered") {
      return {
        backgroundColor: "#E2F3E5",
        color: "#246B35",
      };
    }

    if (normalizedStatus === "shipped") {
      return {
        backgroundColor: "#E5EEFF",
        color: "#2457A7",
      };
    }

    return {
      backgroundColor: "#FFF0D9",
      color: "#70452F",
    };
  };

  return (
    <div
      style={{
        backgroundColor: "#F5EBDD",
        minHeight: "100vh",
        padding: "40px 20px",
        color: "#5C3A25",
        boxSizing: "border-box",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <style>
        {`
          .order-page-title {
            font-size: 36px;
          }

          .order-card {
            max-width: 950px;
            width: 100%;
            margin: 25px auto;
            padding: 25px;
            background-color: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(92,58,37,0.08);
            border: 1px solid #E8D5BE;
            box-sizing: border-box;
            min-width: 0;
          }

          .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            padding-bottom: 15px;
            border-bottom: 2px solid #E8D5BE;
          }

          .order-header-details {
            min-width: 0;
            overflow-wrap: anywhere;
          }

          .order-status {
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 13px;
            text-transform: capitalize;
            max-width: 100%;
            box-sizing: border-box;
            overflow-wrap: anywhere;
          }

          .ordered-product {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 15px;
            margin-bottom: 12px;
            background-color: #FFFCF8;
            border: 1px solid #F0E2D2;
            border-radius: 10px;
            flex-wrap: wrap;
            box-sizing: border-box;
            min-width: 0;
          }

          .ordered-product-image {
            width: 100px;
            height: 100px;
            flex-shrink: 0;
            object-fit: contain;
            background-color: #FFFFFF;
            border-radius: 8px;
          }

          .ordered-product-details {
            flex: 1;
            min-width: 150px;
            overflow-wrap: anywhere;
          }

          .order-total-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
            padding: 18px;
            background-color: #F5EBDD;
            border-radius: 8px;
          }

          .order-delivery-box {
            margin-top: 25px;
            padding: 20px;
            background-color: #FFFCF8;
            border: 1px solid #E8D5BE;
            border-radius: 10px;
            overflow-wrap: anywhere;
          }

          .order-delivery-box p {
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          .order-cancel-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }

          .order-cancel-button {
            max-width: 100%;
            box-sizing: border-box;
          }

          @media (max-width: 768px) {
            .order-page-title {
              font-size: 30px;
            }

            .order-card {
              padding: 20px;
            }

            .ordered-product {
              gap: 15px;
            }

            .order-total-box {
              padding: 16px;
            }
          }

          @media (max-width: 480px) {
            .order-page-title {
              font-size: 26px;
            }

            .order-page-subtitle {
              font-size: 14px;
              margin-bottom: 25px !important;
            }

            .order-card {
              padding: 15px;
              margin: 18px auto;
            }

            .order-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .order-number-title {
              font-size: 20px !important;
            }

            .order-status {
              padding: 7px 12px;
            }

            .ordered-products-title {
              font-size: 18px !important;
              margin-top: 20px !important;
            }

            .ordered-product {
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
              padding: 12px;
            }

            .ordered-product-image {
              width: 100%;
              height: 150px;
            }

            .ordered-product-details {
              width: 100%;
              min-width: 0;
            }

            .order-total-box {
              flex-direction: column;
              align-items: flex-start;
              padding: 15px;
            }

            .order-total-box h3 {
              font-size: 15px;
            }

            .order-total-box h2 {
              font-size: 22px;
              overflow-wrap: anywhere;
            }

            .order-delivery-box {
              padding: 15px;
              margin-top: 18px;
            }

            .order-delivery-box h3 {
              font-size: 18px;
            }

            .order-cancel-container {
              justify-content: stretch;
            }

            .order-cancel-button {
              width: 100%;
              padding: 12px !important;
            }
          }
        `}
      </style>

      <h1
        className="order-page-title"
        style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "#70452F",
          overflowWrap: "break-word",
        }}
      >
        My Order Details
      </h1>

      <p
        className="order-page-subtitle"
        style={{
          textAlign: "center",
          color: "#8B6B55",
          marginBottom: "35px",
        }}
      >
        View your ordered products and delivery information.
      </p>

      {loading ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          Loading your orders...
        </p>
      ) : orders.length === 0 ? (
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            boxSizing: "border-box",
            margin: "40px auto",
            padding: "40px 20px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(92,58,37,0.08)",
          }}
        >
          <h2>No Orders Yet</h2>
          <p>Your ordered products will appear here.</p>
        </div>
      ) : (
        orders.map((order) => {
          const orderStatus = String(
            order.status || "pending"
          ).toLowerCase();

          const canCancelOrder = ![
            "cancelled",
            "canceled",
            "shipped",
            "delivered",
          ].includes(orderStatus);

          const isCancelling =
            String(cancellingOrderId) === String(order.id);

          return (
            <div key={order.id} className="order-card">
              {/* Order header */}
              <div className="order-header">
                <div className="order-header-details">
                  <h2
                    className="order-number-title"
                    style={{
                      margin: "0 0 8px",
                      fontSize: "22px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    Order #{order.id}
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: "#8B6B55",
                    }}
                  >
                    Order Date:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString(
                          "en-IN"
                        )
                      : "Not available"}
                  </p>
                </div>

                <span
                  className="order-status"
                  style={{
                    ...getStatusStyle(order.status),
                  }}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              {/* Ordered products */}
              <h3
                className="ordered-products-title"
                style={{
                  marginTop: "25px",
                  marginBottom: "15px",
                  fontSize: "20px",
                }}
              >
                Ordered Products
              </h3>

              {(order.items || []).map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="ordered-product"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="ordered-product-image"
                  />

                  <div className="ordered-product-details">
                    <h3
                      style={{
                        margin: "0 0 10px",
                        fontSize: "18px",
                        color: "#5C3A25",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {product.name}
                    </h3>

                    <p
                      style={{
                        margin: "6px 0",
                        color: "#8B6B55",
                      }}
                    >
                      Quantity: {product.quantity || 1}
                    </p>

                    <p
                      style={{
                        margin: "6px 0",
                        fontWeight: "bold",
                        color: "#70452F",
                      }}
                    >
                      Price: ₹
                      {(
                        Number(product.price) *
                        Number(product.quantity || 1)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Total amount */}
              <div className="order-total-box">
                <h3 style={{ margin: 0 }}>
                  Total Order Amount
                </h3>

                <h2
                  style={{
                    margin: 0,
                    color: "#70452F",
                  }}
                >
                  ₹
                  {Number(order.totalPrice || 0).toLocaleString(
                    "en-IN"
                  )}
                </h2>
              </div>

              {/* Delivery details */}
              <div className="order-delivery-box">
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "15px",
                  }}
                >
                  Delivery Details
                </h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {order.customer?.name || "N/A"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.customer?.email || "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {order.customer?.phone || "N/A"}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.customer?.address || "N/A"}
                </p>

                <p>
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMethod || "N/A"}
                </p>

                <p>
                  <strong>Payment Status:</strong>{" "}
                  {order.paymentStatus || "Pending"}
                </p>
              </div>

              {/* Cancel order button */}
              {canCancelOrder && (
                <div className="order-cancel-container">
                  <button
                    type="button"
                    className="order-cancel-button"
                    onClick={() => handleCancelOrder(order)}
                    disabled={isCancelling}
                    style={{
                      padding: "12px 22px",
                      backgroundColor: isCancelling
                        ? "#C8B8AC"
                        : "#B42318",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: isCancelling
                        ? "not-allowed"
                        : "pointer",
                      opacity: isCancelling ? 0.7 : 1,
                      transition:
                        "background-color 0.25s ease, transform 0.25s ease",
                    }}
                    onMouseEnter={(event) => {
                      if (!isCancelling) {
                        event.currentTarget.style.backgroundColor =
                          "#8F1D14";
                        event.currentTarget.style.transform =
                          "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (!isCancelling) {
                        event.currentTarget.style.backgroundColor =
                          "#B42318";
                        event.currentTarget.style.transform =
                          "translateY(0)";
                      }
                    }}
                  >
                    {isCancelling
                      ? "Cancelling..."
                      : "✕ Cancel Order"}
                  </button>
                </div>
              )}

              {/* Cancelled order message */}
              {["cancelled", "canceled"].includes(orderStatus) && (
                <p
                  style={{
                    marginTop: "20px",
                    padding: "12px",
                    backgroundColor: "#FCE8E6",
                    color: "#B42318",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    overflowWrap: "anywhere",
                  }}
                >
                  This order has been cancelled.
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default OrderDetails;