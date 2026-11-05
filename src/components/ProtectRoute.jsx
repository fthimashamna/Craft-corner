import { Navigate, Outlet } from "react-router-dom";

function ProtectRoute() {
  const userId = localStorage.getItem("userId");
  const adminId = localStorage.getItem("adminId");
  const role = localStorage.getItem("role");

  // If admin is logged in, don't allow user-side access
  if (role === "admin" && adminId) {
    return <Navigate to="/admin" replace />;
  }

  // If user is not logged in, redirect to login
  if (!userId || role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectRoute;