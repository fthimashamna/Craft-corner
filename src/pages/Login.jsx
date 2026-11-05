import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // Check Admin Details
      const adminResponse = await axios.get(
        "http://localhost:3001/admins"
      );

      const normalizedEmail = email.trim().toLowerCase();

      const admin = adminResponse.data.find(
        (item) =>
          item.email.trim().toLowerCase() === normalizedEmail &&
          item.password === password
      );

      if (admin) {
        try{
          await axios.patch(`http://localhost:3001/admins/${admin.id}`,{
            lastLoginAt:new Date().toISOString(),
          }
        );
        }catch(error){
          console.error("Failed to update admin login date:",error);
        }
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        localStorage.setItem("adminId", admin.id);
        localStorage.setItem("role", "admin");

        window.dispatchEvent(new Event("loginStatusChanged"));

        toast.success("Admin Login Successful");
        navigate("/admin", { replace: true });
        return;
      }

      // Check Customer Details
      const userResponse = await axios.get(
        "http://localhost:3001/users"
      );

      const emailUsers = userResponse.data.filter(
        (item) =>
          item.email.trim().toLowerCase() === normalizedEmail
      );

      // Check blocked account
      const blockedUser = emailUsers.find(
        (item) => item.status === "blocked"
      );

      if (blockedUser) {
        toast.error("Your account is blocked");
        return;
      }

      // Check email and password
      const user = emailUsers.find(
        (item) => item.password === password
      );

      if (user) {
        
        localStorage.removeItem("adminId");

        localStorage.setItem("userId", user.id);
        localStorage.setItem("role", "user");
        localStorage.setItem("user", JSON.stringify(user));

        window.dispatchEvent(new Event("loginStatusChanged"));

        toast.success("Login Successful");
        navigate("/", { replace: true });
      } else {
        toast.error("Invalid Email or Password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Check JSON Server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF6F0",
        padding: "25px",
        boxSizing: "border-box",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#FFFDF9",
          padding: "40px 35px",
          borderRadius: "14px",
          boxShadow: "0 5px 25px rgba(92, 58, 37, 0.12)",
          border: "1px solid #E9DED1",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              color: "#5C3A25",
              fontSize: "30px",
              margin: "0 0 10px",
              fontWeight: "bold",
            }}
          >
            Welcome Back!
          </h1>

          <p
            style={{
              color: "#92765D",
              fontSize: "15px",
              margin: 0,
            }}
          >
            Login to your Craftiva account
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#5C3A25",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "9px",
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "13px 14px",
                border: "1px solid #D8C4AE",
                borderRadius: "7px",
                backgroundColor: "#FAF6F0",
                color: "#5C3A25",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "Georgia, serif",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                color: "#5C3A25",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "9px",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "13px 14px",
                border: "1px solid #D8C4AE",
                borderRadius: "7px",
                backgroundColor: "#FAF6F0",
                color: "#5C3A25",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "Georgia, serif",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#92765D" : "#5C3A25",
              color: "#FFFDF9",
              border: "none",
              borderRadius: "7px",
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Georgia, serif",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#92765D",
            fontSize: "13px",
            marginTop: "25px",
            marginBottom: 0,
          }}
        >
          Welcome to Craftiva – Create with elegance.
        </p>
      </div>
    </div>
  );
}

export default Login; 