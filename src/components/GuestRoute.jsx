import { Navigate, Outlet, useLocation } from "react-router-dom";

function GuestRoute() {
  const location = useLocation();

  const userId = localStorage.getItem("userId");
  const adminId = localStorage.getItem("adminId");
  const role = localStorage.getItem("role");

  // Admin login page should be accessible to customers too.
  if (location.pathname === "/admin/login") {
    if (adminId && role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
  }

  if (adminId && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (userId && role === "user") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;