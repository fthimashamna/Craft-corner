import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUsers } from "../services/userService";

const linkStyle = {
  textDecoration: "none",
  color: "#493326",
  fontSize: "13px",
  fontWeight: "500",
  whiteSpace: "nowrap",
};

function Navbar() {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState("");
  const [orderCount, setOrderCount] = useState(0);

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.whishlist.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  const wishlistCount = wishlistItems.length;

  // Update user details
  useEffect(() => {
    const updateUser = async () => {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");

      if (!userId || role !== "user") {
        setUser(null);
        setUsername("");
        setOrderCount(0);
        return;
      }

      setUser({ id: userId, role });

      try {
        const users = await getUsers();

        const loggedInUser = users.find(
          (item) => String(item.id) === String(userId)
        );

        setUsername(loggedInUser?.name || "User");
      } catch (error) {
        console.error("Failed to load user details:", error);
        setUsername("User");
      }
    };

    updateUser();

    window.addEventListener("loginStatusChanged", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("loginStatusChanged", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  // Fetch order count
  useEffect(() => {
    const fetchOrderCount = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId || localStorage.getItem("role") !== "user") {
        setOrderCount(0);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/orders?userId=${encodeURIComponent(userId)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const orders = await response.json();

        setOrderCount(orders.length);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrderCount(0);
      }
    };

    fetchOrderCount();

    window.addEventListener("loginStatusChanged", fetchOrderCount);
    window.addEventListener("storage", fetchOrderCount);

    return () => {
      window.removeEventListener("loginStatusChanged", fetchOrderCount);
      window.removeEventListener("storage", fetchOrderCount);
    };
  }, []);

  // Search products
  const handleSearch = (event) => {
    event.preventDefault();

    const searchText = search.trim();

    if (searchText) {
      navigate(`/products?search=${encodeURIComponent(searchText)}`);
    } else {
      navigate("/products");
    }
  };

  // User Logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    setUser(null);
    setUsername("");
    setOrderCount(0);
    setShowProfile(false);

    window.dispatchEvent(new Event("loginStatusChanged"));

    navigate("/login", { replace: true });
  };

  const badgeStyle = {
    position: "absolute",
    top: "-7px",
    right: "-11px",
    fontSize: "10px",
    fontWeight: "bold",
    color: "#70452f",
    backgroundColor: "#E8D8C3",
    minWidth: "17px",
    height: "17px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2px",
    boxSizing: "border-box",
  };

  const iconLinkStyle = {
    ...linkStyle,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    fontSize: "12px",
    minWidth: "42px",
  };

  return (
    <>
      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: auto minmax(180px, 1fr) auto;
          align-items: center;
          gap: 25px;
          padding: 15px 30px;
          background-color: #e8d2b8;
          box-shadow: 0 2px 8px rgba(73, 51, 38, 0.08);
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 25px;
          min-width: 0;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .navbar-menu a {
          display: inline-block;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .navbar-menu a:hover {
          transform: scale(1.12);
          color: #70452a !important;
        }

        .navbar-center {
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 0;
        }

        .navbar-search {
          width: 100%;
          max-width: 360px;
          height: 42px;
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #dfd2c5;
          border-radius: 25px;
          padding: 0 15px;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .navbar-search:focus-within {
          border-color: #70452a;
          box-shadow: 0 0 0 2px rgba(112, 69, 42, 0.1);
        }

        .navbar-search input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          min-width: 0;
          padding: 8px;
          font-size: 13px;
          color: #493326;
        }

        .navbar-search button {
          background: none;
          border: none;
          font-size: 19px;
          cursor: pointer;
          color: #70452a;
          padding: 0;
          flex-shrink: 0;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 22px;
          flex-shrink: 0;
        }

        .navbar-profile-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #493326;
          font-size: 12px;
          white-space: nowrap;
          min-width: 42px;
        }

        .navbar-menu a:hover,
        .navbar-right a:hover {
          color: #9b7655 !important;
        }

        @media (max-width: 1250px) {
          .navbar-container {
            gap: 15px;
            padding: 14px 20px;
          }

          .navbar-left {
            gap: 15px;
          }

          .navbar-menu {
            gap: 15px;
          }

          .navbar-right {
            gap: 16px;
          }

          .navbar-logo h2 {
            font-size: 23px !important;
          }
        }

        @media (max-width: 1000px) {
          .navbar-container {
            grid-template-columns: 1fr auto;
            gap: 18px;
          }

          .navbar-left {
            grid-column: 1 / -1;
            justify-content: space-between;
          }

          .navbar-center {
            grid-column: 1;
            grid-row: 2;
          }

          .navbar-right {
            grid-column: 2;
            grid-row: 2;
            gap: 18px;
          }
        }

        @media (max-width: 650px) {
          .navbar-container {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 14px;
          }

          .navbar-left {
            grid-column: 1;
            flex-wrap: wrap;
            gap: 15px;
          }

          .navbar-menu {
            gap: 16px;
            flex-wrap: wrap;
          }

          .navbar-center {
            grid-column: 1;
            grid-row: 2;
          }

          .navbar-right {
            grid-column: 1;
            grid-row: 3;
            justify-content: space-around;
            gap: 18px;
            flex-wrap: wrap;
          }
        }
      `}</style>

      <nav className="navbar-container">
        {/* LOGO AND NAVIGATION */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span style={{ fontSize: "30px" }}>🌿</span>

            <h2
              style={{
                fontSize: "27px",
                fontWeight: "bold",
                color: "#70452a",
                margin: 0,
                fontFamily: "Georgia, serif",
                whiteSpace: "nowrap",
              }}
            >
              Craft Corner
            </h2>
          </Link>

          <div className="navbar-menu">
            <Link to="/" style={linkStyle}>
              Home
            </Link>

            <Link to="/products" style={linkStyle}>
              Products
            </Link>

            <Link to="/about" style={linkStyle}>
              About
            </Link>

            <Link to="/contact" style={linkStyle}>
              Contact
            </Link>
          </div>
        </div>

        {/* SEARCH BOX */}
        <div className="navbar-center">
          <form onSubmit={handleSearch} className="navbar-search">
            <button type="submit" aria-label="Search products">
              🔍
            </button>

            <input
              type="search"
              placeholder="Search for products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>
        </div>

        {/* RIGHT SIDE LINKS */}
        <div className="navbar-right">
          <Link to="/wishlist" style={iconLinkStyle}>
            <span style={{ position: "relative", fontSize: "23px" }}>
              ❤️
              <span style={badgeStyle}>{wishlistCount}</span>
            </span>
            Wishlist
          </Link>

          <Link to="/cart" style={iconLinkStyle}>
            <span style={{ position: "relative", fontSize: "23px" }}>
              🛒
              <span style={badgeStyle}>{cartCount}</span>
            </span>
            Cart
          </Link>

          {user && (
            <Link to="/orderdetails" style={iconLinkStyle}>
              <span style={{ position: "relative", fontSize: "23px" }}>
                📦
                <span style={badgeStyle}>{orderCount}</span>
              </span>
              Orders
            </Link>
          )}

          {/* PROFILE */}
          {user && (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowProfile((previous) => !previous)}
                aria-expanded={showProfile}
                className="navbar-profile-button"
              >
                <span style={{ fontSize: "23px" }}>👤</span>
                Profile
              </button>

              {showProfile && (
                <div
                  style={{
                    position: "absolute",
                    top: "55px",
                    right: 0,
                    width: "220px",
                    maxWidth: "calc(100vw - 28px)",
                    backgroundColor: "#fff",
                    border: "1px solid #e0cdbb",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    textAlign: "center",
                    zIndex: 1001,
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ fontSize: "35px" }}>👤</div>

                  <h3
                    style={{
                      color: "#493326",
                      fontSize: "17px",
                      margin: "10px 0",
                    }}
                  >
                    {username || "User"}
                  </h3>

                  <p
                    style={{
                      color: "#806b5c",
                      fontSize: "13px",
                      marginBottom: "15px",
                    }}
                  >
                    Role: {user.role}
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#70452f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LOGIN AND REGISTER */}
          {!user && (
            <>
              <Link to="/login" style={linkStyle}>
                Login
              </Link>

              <Link to="/register" style={linkStyle}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;