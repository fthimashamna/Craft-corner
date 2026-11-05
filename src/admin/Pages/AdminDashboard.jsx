import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3001/products"),
          axios.get("http://localhost:3001/users"),
          axios.get("http://localhost:3001/orders"),
        ]);

        setProducts(productsRes.data);
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // DASHBOARD COUNTS
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;

  const totalSales = orders
    .filter((order) => order.status === "delivered")
    .reduce(
      (total, order) => total + Number(order.totalPrice || 0),
      0
    );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  // DAY-WISE SALES CALCULATION
  const dailySales = {};

  orders.forEach((order) => {
    if (order.status === "delivered" && order.createdAt) {
      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const dayKey = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      if (!dailySales[dayKey]) {
        dailySales[dayKey] = {
          day: date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
          sales: 0,
        };
      }

      dailySales[dayKey].sales += Number(order.totalPrice || 0);
    }
  });

  const salesData = Object.keys(dailySales)
    .sort()
    .map((dayKey) => dailySales[dayKey]);

  // GET LATEST 5 ORDERS
  const getOrderTimestamp = (order) => {
    const dateValue =
      order.createdAt || order.orderDate || order.date;

    const timestamp = dateValue
      ? new Date(dateValue).getTime()
      : 0;

    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const latestOrders = [...orders]
    .sort(
      (a, b) => getOrderTimestamp(b) - getOrderTimestamp(a)
    )
    .slice(0, 5);

  // CARD NAVIGATION
  const handleCardClick = (path) => {
    navigate(path);
  };

  // CARD STYLE
  const cardStyle = {
    background: "#FFFDF9",
    border: "1px solid #E9DED1",
    borderLeft: "5px solid #5C3A25",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 15px rgba(92, 58, 37, 0.05)",
    cursor: "pointer",
    transition: "all 0.25s ease",
    minWidth: 0,
  };

  const titleStyle = {
    color: "#806C5B",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 18px",
  };

  const valueStyle = {
    color: "#4D3021",
    fontSize: "32px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-1px",
  };

  // CARD HOVER EFFECTS
  const cardClickEvents = {
    onMouseEnter: (event) => {
      const card = event.currentTarget;

      card.style.transform = "translateY(-5px)";
      card.style.background = "#5C3A25";
      card.style.boxShadow =
        "0 10px 25px rgba(92, 58, 37, 0.15)";
      card.style.borderColor = "#5C3A25";
      card.style.borderLeftColor = "#C9AD91";

      card.querySelectorAll("p").forEach((item) => {
        item.style.color = "#E8D8C3";
      });

      card.querySelectorAll("h2").forEach((item) => {
        item.style.color = "#FFFDF9";
      });

      card.querySelectorAll("span").forEach((item) => {
        item.style.color = "#FFFDF9";
      });

      card.querySelectorAll("div").forEach((item) => {
        if (
          item.style.background === "rgb(248, 235, 215)" ||
          item.style.background === "rgb(229, 239, 229)"
        ) {
          item.style.background = "#806047";
        }
      });
    },

    onMouseLeave: (event) => {
      const card = event.currentTarget;

      card.style.transform = "translateY(0)";
      card.style.background = "#FFFDF9";
      card.style.boxShadow =
        "0 4px 15px rgba(92, 58, 37, 0.05)";
      card.style.borderColor = "#E9DED1";
      card.style.borderLeftColor = "#5C3A25";

      card.querySelectorAll("p").forEach((item) => {
        item.style.color = "";
      });

      card.querySelectorAll("h2").forEach((item) => {
        item.style.color = "";
      });

      card.querySelectorAll("span").forEach((item) => {
        item.style.color = "";
      });

      card.querySelectorAll("div").forEach((item) => {
        if (item.style.background === "rgb(128, 96, 71)") {
          item.style.background = "";
        }
      });
    },
  };

  // LOADING
  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          color: "#5C3A25",
          fontSize: "16px",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#F8F4EE",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Georgia, serif",
        boxSizing: "border-box",
      }}
    >
      {/* Dashboard Heading */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div>
          <p
            style={{
              color: "#A1846B",
              fontSize: "12px",
              letterSpacing: "2px",
              fontWeight: "600",
              margin: "0 0 10px",
            }}
          >
            CRAFTIVA / ADMINISTRATION
          </p>

          <h1
            style={{
              color: "#4D3021",
              fontSize: "30px",
              margin: 0,
              fontWeight: "700",
            }}
          >
            Dashboard Overview
          </h1>

          <p
            style={{
              color: "#8C7968",
              fontSize: "14px",
              margin: "10px 0 0",
            }}
          >
            Manage your store and track its performance.
          </p>
        </div>

        <div
          style={{
            background: "#EFE4D7",
            color: "#70452F",
            padding: "12px 18px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Craftiva Store
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        {/* Products */}
        <div
          style={cardStyle}
          onClick={() => handleCardClick("/admin/products")}
          {...cardClickEvents}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={titleStyle}>Total Products</p>
            <span style={iconStyle}>P</span>
          </div>

          <h2 style={valueStyle}>{totalProducts}</h2>
          <p style={bottomTextStyle}>Products in your store</p>
        </div>

        {/* Users */}
        <div
          style={cardStyle}
          onClick={() => handleCardClick("/admin/users")}
          {...cardClickEvents}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={titleStyle}>Total Users</p>
            <span style={iconStyle}>U</span>
          </div>

          <h2 style={valueStyle}>{totalUsers}</h2>
          <p style={bottomTextStyle}>Registered customers</p>
        </div>

        {/* Orders */}
        <div
          style={cardStyle}
          onClick={() => handleCardClick("/admin/orders")}
          {...cardClickEvents}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={titleStyle}>Total Orders</p>
            <span style={iconStyle}>O</span>
          </div>

          <h2 style={valueStyle}>{totalOrders}</h2>
          <p style={bottomTextStyle}>Orders received</p>
        </div>

        {/* Sales */}
        <div
          style={{
            ...cardStyle,
            cursor: "default",
          }}
          {...cardClickEvents}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={titleStyle}>Total Sales</p>
            <span style={iconStyle}>₹</span>
          </div>

          <h2 style={valueStyle}>
            ₹{totalSales.toLocaleString("en-IN")}
          </h2>

          <p style={bottomTextStyle}>
            Revenue from delivered orders
          </p>
        </div>
      </div>

      {/* Order Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Pending Orders */}
        <div
          style={{
            ...cardStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => handleCardClick("/admin/pending-orders")}
          {...cardClickEvents}
        >
          <div>
            <p style={titleStyle}>Pending Orders</p>
            <h2 style={valueStyle}>{pendingOrders}</h2>
            <p style={bottomTextStyle}>Waiting for processing</p>
          </div>

          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "14px",
              background: "#F8EBD7",
              color: "#A16D29",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            P
          </div>
        </div>

        {/* Delivered Orders */}
        <div
          style={{
            ...cardStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => handleCardClick("/admin/delivered-orders")}
          {...cardClickEvents}
        >
          <div>
            <p style={titleStyle}>Delivered Orders</p>
            <h2 style={valueStyle}>{deliveredOrders}</h2>
            <p style={bottomTextStyle}>Successfully delivered</p>
          </div>

          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "14px",
              background: "#E5EFE5",
              color: "#52775B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            D
          </div>
        </div>
      </div>

      {/* Sales Overview */}
      <div
        style={{
          background: "#FFFDF9",
          border: "1px solid #E9DED1",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 5px 20px rgba(92, 58, 37, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          <div>
            <h2
              style={{
                color: "#4D3021",
                fontSize: "22px",
                margin: "0 0 8px",
                fontWeight: "700",
              }}
            >
              Sales Performance
            </h2>

            <p
              style={{
                color: "#9A8776",
                fontSize: "13px",
                margin: 0,
              }}
            >
              Daily revenue from successfully delivered orders
            </p>
          </div>

          <div
            style={{
              background: "#F3EADF",
              color: "#70452F",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Daily Report
          </div>
        </div>

        {salesData.length > 0 ? (
          <div style={{ width: "100%", height: "340px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 15,
                  right: 15,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="#E5E5E5"
                  strokeDasharray="0"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#8C7968",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                  dy={12}
                />

                <YAxis
                  tick={{
                    fill: "#8C7968",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  width={75}
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Sales",
                  ]}
                  contentStyle={{
                    background: "#FFFDF9",
                    border: "1px solid #D6C2B2",
                    borderRadius: "12px",
                    padding: "12px 15px",
                    boxShadow: "0 5px 18px rgba(92, 58, 37, 0.12)",
                  }}
                  labelStyle={{
                    color: "#5C3A25",
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                  itemStyle={{
                    color: "#805638",
                    fontWeight: "600",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="#805638"
                  strokeWidth={3}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "65px 20px",
              background: "#FAF6F0",
              borderRadius: "12px",
              color: "#907B68",
            }}
          >
            <h3
              style={{
                color: "#5C3A25",
                fontSize: "17px",
                marginBottom: "8px",
              }}
            >
              No Sales Data Yet
            </h3>

            <p style={{ fontSize: "13px", margin: 0 }}>
              Delivered order sales will appear here.
            </p>
          </div>
        )}
      </div>

      {/* LATEST ORDERS */}
      <div
        style={{
          background: "#FFFDF9",
          border: "1px solid #E9DED1",
          borderRadius: "18px",
          padding: "28px",
          marginTop: "25px",
          boxShadow: "0 5px 20px rgba(92, 58, 37, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          <div>
            <h2
              style={{
                color: "#4D3021",
                fontSize: "22px",
                margin: "0 0 8px",
                fontWeight: "700",
              }}
            >
              Latest Orders
            </h2>

            <p
              style={{
                color: "#9A8776",
                fontSize: "13px",
                margin: 0,
              }}
            >
              Recently received customer orders
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/orders")}
            style={{
              background: "#70452F",
              color: "#FFFFFF",
              border: "none",
              padding: "11px 18px",
              borderRadius: "9px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View All Orders
          </button>
        </div>

        {latestOrders.length > 0 ? (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: "650px",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F5EBDD",
                    color: "#70452F",
                  }}
                >
                  {[
                    "Order ID",
                    "Customer",
                    "Date",
                    "Total",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "15px",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {latestOrders.map((order) => {
                  const status = String(
                    order.status || "unknown"
                  ).toLowerCase();

                  const statusColors =
                    status === "delivered"
                      ? {
                          background: "#E5EFE5",
                          color: "#52775B",
                        }
                      : status === "pending"
                      ? {
                          background: "#F8EBD7",
                          color: "#A16D29",
                        }
                      : status === "cancelled"
                      ? {
                          background: "#F8E0DC",
                          color: "#A94438",
                        }
                      : {
                          background: "#E8EAF3",
                          color: "#52618A",
                        };

                  const orderDate =
                    order.createdAt ||
                    order.orderDate ||
                    order.date;

                  const date = orderDate
                    ? new Date(orderDate)
                    : null;

                  const formattedDate =
                    date && !Number.isNaN(date.getTime())
                      ? date.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A";

                  const customerName =
                    order.customerName ||
                    order.name ||
                    order.userName ||
                    order.customer?.name ||
                    order.user?.name ||
                    order.email ||
                    order.customerEmail ||
                    "Customer";

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: "1px solid #EEE4D9",
                      }}
                    >
                      <td
                        style={{
                          padding: "17px 15px",
                          color: "#70452F",
                          fontWeight: "700",
                          fontSize: "14px",
                        }}
                      >
                        #{order.id}
                      </td>

                      <td
                        style={{
                          padding: "17px 15px",
                          color: "#5C3A25",
                          fontSize: "14px",
                        }}
                      >
                        {customerName}
                      </td>

                      <td
                        style={{
                          padding: "17px 15px",
                          color: "#806C5B",
                          fontSize: "13px",
                        }}
                      >
                        {formattedDate}
                      </td>

                      <td
                        style={{
                          padding: "17px 15px",
                          color: "#5C3A25",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        ₹
                        {Number(order.totalPrice || 0).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td style={{ padding: "17px 15px" }}>
                        <span
                          style={{
                            ...statusColors,
                            padding: "7px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "45px 20px",
              background: "#FAF6F0",
              borderRadius: "12px",
              color: "#907B68",
            }}
          >
            <h3
              style={{
                color: "#5C3A25",
                fontSize: "17px",
                marginBottom: "8px",
              }}
            >
              No Orders Yet
            </h3>

            <p style={{ fontSize: "13px", margin: 0 }}>
              Customer orders will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ICON STYLE
const iconStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  background: "#F1E6DA",
  color: "#70452F",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  fontWeight: "700",
};

// BOTTOM TEXT STYLE
const bottomTextStyle = {
  color: "#A18D7B",
  fontSize: "12px",
  margin: "12px 0 0",
};

export default AdminDashboard;