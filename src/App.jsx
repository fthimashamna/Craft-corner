import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectRouter from "./components/ProtectRoute";
import AdminProtectRoute from "./admin/Componenets/AdminProtectRoute";
import GuestRoute from "./components/GuestRoute";

import {
  fetchUserCart,
  clearCart,
} from "./redux/slices/cartSlice";

import {
  fetchUserWishlist,
  clearWishlist,
} from "./redux/slices/wishlistSlice";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrderDetails from "./pages/OrderDetails";

import AdminDashboard from "./admin/Pages/AdminDashboard";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminProducts from "./admin/Pages/AdminProducts.jsx";
import AdminTrash from "./admin/Pages/AdminTrash.jsx";
import AdminOrders from "./admin/Pages/AdminOrders.jsx";
import AdminUsers from "./admin/Pages/AdminUsers.jsx";
import AdminPendingOrders from "./admin/Pages/AdminPendingOrders.jsx";
import AdminDeliveredOrders from "./admin/Pages/AdminDeliveredOrders.jsx";

// Prevent admin from accessing user-side public pages
function PublicRoute() {
  const adminId = localStorage.getItem("adminId");
  const role = localStorage.getItem("role");

  if (adminId && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();

  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const loadUserData = () => {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");

      if (userId && role === "user") {
        dispatch(fetchUserCart(userId));
        dispatch(fetchUserWishlist(userId));
      } else {
        dispatch(clearCart());
        dispatch(clearWishlist());
      }
    };

    loadUserData();

    window.addEventListener("loginStatusChanged", loadUserData);

    return () => {
      window.removeEventListener("loginStatusChanged", loadUserData);
    };
  }, [dispatch]);

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* User-side public pages */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/productdetails/:id"
            element={<ProductDetails />}
          />
        </Route>

        {/* Common login and register */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Old admin login URL */}
        <Route
          path="/admin/login"
          element={<Navigate to="/login" replace />}
        />

        {/* User protected pages */}
        <Route element={<ProtectRouter />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orderdetails" element={<OrderDetails />} />
        </Route>

        {/* Admin protected pages */}
        <Route element={<AdminProtectRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="trash" element={<AdminTrash />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />

            <Route
              path="pending-orders"
              element={<AdminPendingOrders />}
            />

            <Route
              path="delivered-orders"
              element={<AdminDeliveredOrders />}
            />
          </Route>
        </Route>

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#5C3A25",
            color: "#FFFDF9",
            fontFamily: "Georgia, serif",
          },
        }}
      />

      <AppContent />
    </BrowserRouter>
  );
}

export default App;