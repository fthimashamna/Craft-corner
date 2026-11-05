import { Navigate, Outlet } from "react-router-dom";

function AdminProtectRoute() {
  const adminId = localStorage.getItem("adminId");
  const role = localStorage.getItem("role");

  if (role === "user") {
    return <Navigate to="/" replace />;
  }

  if (!adminId || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectRoute;