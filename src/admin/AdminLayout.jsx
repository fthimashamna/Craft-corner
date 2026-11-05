import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminLayout() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const navigate = useNavigate();

    const menuItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Products", path: "/admin/products" },
        { name: "Orders", path: "/admin/orders" },
        { name: "Users", path: "/admin/users" },
        { name: "Trash Bin", path: "/admin/trash" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("adminId");
        localStorage.removeItem("role");

        toast.success("Admin logged out successfully");

        navigate("/", { replace: true });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                backgroundColor: "#FAF6F0",
                fontFamily: "Georgia, serif",
                fontSize: "16px",
            }}
        >
            {/* Sidebar */}
            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    left: sidebarVisible ? 0 : "-260px",
                    width: "240px",
                    height: "100vh",
                    overflowY: "auto",
                    backgroundColor: "#FFF8EF",
                    color: "#5C3A25",
                    padding: "24px 16px",
                    boxSizing: "border-box",
                    zIndex: 1001,
                    boxShadow: sidebarVisible
                        ? "4px 0 14px rgba(92, 58, 37, 0.12)"
                        : "none",
                    transition: "left 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <h2
                    style={{
                        margin: "0 0 8px",
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                >
                    Craftiva
                </h2>

                <p
                    style={{
                        color: "#D6BFA8",
                        fontSize: "16px",
                        margin: 0,
                    }}
                >
                    ADMIN PANEL
                </p>

                <nav style={{ marginTop: "30px" }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === "/admin"}
                            style={({ isActive }) => ({
                                display: "block",
                                padding: "13px 16px",
                                marginBottom: "8px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                color: "#5C3A25",
                                backgroundColor: isActive
                                    ? "#E8D8C3"
                                    : "transparent",
                                fontWeight: isActive ? "600" : "400",
                                fontSize: "16px",
                            })}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                        marginTop: "auto",
                        width: "100%",
                        border: "none",
                        backgroundColor: "#5C3A25",
                        color: "#FFFDF9",
                        borderRadius: "8px",
                        padding: "13px 16px",
                        fontSize: "15px",
                        fontFamily: "Georgia, serif",
                        cursor: "pointer",
                        textAlign: "left",
                    }}
                >
                    Logout
                </button>
            </aside>

            {/* Overlay */}
            {sidebarVisible && (
                <div
                    onClick={() => setSidebarVisible(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.18)",
                        zIndex: 1000,
                    }}
                />
            )}

            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
            >
                {/* Sticky Header */}
                <header
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 999,
                        backgroundColor: "#FFFDF8",
                        padding: "20px 28px",
                        borderBottom: "1px solid #E8D8C3",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <button
                        type="button"
                        onClick={() =>
                            setSidebarVisible((visible) => !visible)
                        }
                        aria-label={
                            sidebarVisible ? "Hide sidebar" : "Show sidebar"
                        }
                        aria-expanded={sidebarVisible}
                        style={{
                            border: "1px solid #D2B99B",
                            backgroundColor: "#FAF6F0",
                            color: "#5C3A25",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            fontSize: "16px",
                            fontFamily: "Georgia, serif",
                            lineHeight: 1,
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    >
                        ☰
                    </button>

                    <h2
                        style={{
                            margin: 0,
                            color: "#5C3A25",
                            fontSize: "16px",
                            fontWeight: "bold",
                            flex: 1,
                        }}
                    >
                        Craftiva Admin Panel
                    </h2>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/trash")}
                        aria-label="Open Trash Bin"
                        title="Trash Bin"
                        style={{
                            border: "1px solid #D2B99B",
                            backgroundColor: "#FAF6F0",
                            color: "#5C3A25",
                            borderRadius: "8px",
                            padding: "9px 12px",
                            fontSize: "16px",
                            fontFamily: "Georgia, serif",
                            lineHeight: 1,
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    >
                        🗑
                    </button>
                </header>

                <main
                    style={{
                        padding: "24px",
                        width: "100%",
                        boxSizing: "border-box",
                        fontFamily: "Georgia, serif",
                        fontSize: "16px",
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;