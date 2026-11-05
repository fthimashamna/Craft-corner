import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:3001/admins");

      const admin = response.data.find(
        (item) =>
          item.email === email.trim() &&
          item.password === password
      );

      if (admin) {
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        localStorage.setItem("adminId", admin.id);
        localStorage.setItem("role", "admin");

        toast.success("Admin Login Successful");
        navigate("/admin");
      } else {
        toast.error("Invalid Email or Password");
      }
    } catch (error) {
      toast.error(
        "Something went wrong. Check whether JSON Server is running."
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>C</div>

        <h1 style={styles.title}>Craftiva</h1>
        <p style={styles.subtitle}>Admin Panel</p>

        <div style={styles.divider}></div>

        <h2 style={styles.welcome}>Welcome Back!</h2>

        <p style={styles.description}>
          Login to manage your Craftiva store.
        </p>

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Login to Dashboard
          </button>
        </form>

        <p style={styles.footer}>Craftiva Admin Panel</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF6F0",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "Georgia, serif",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#FFFDF9",
    padding: "40px 35px",
    borderRadius: "14px",
    border: "1px solid #E9DED1",
    boxShadow: "0 8px 30px rgba(92, 58, 37, 0.10)",
    boxSizing: "border-box",
    textAlign: "center",
  },

  logo: {
    width: "65px",
    height: "65px",
    backgroundColor: "#5C3A25",
    color: "#FFFDF9",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 auto 12px",
  },

  title: {
    color: "#5C3A25",
    fontSize: "30px",
    margin: "8px 0",
  },

  subtitle: {
    color: "#A17A5B",
    fontSize: "15px",
    margin: "0",
  },

  divider: {
    width: "55px",
    height: "2px",
    backgroundColor: "#C9AD91",
    margin: "22px auto",
  },

  welcome: {
    color: "#5C3A25",
    fontSize: "23px",
    marginBottom: "8px",
  },

  description: {
    color: "#8B7868",
    fontSize: "14px",
    marginBottom: "28px",
  },

  inputGroup: {
    textAlign: "left",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    color: "#5C3A25",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "9px",
  },

  input: {
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
  },

  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#5C3A25",
    color: "#FFFDF9",
    border: "none",
    borderRadius: "7px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
    fontFamily: "Georgia, serif",
  },

  footer: {
    color: "#A17A5B",
    fontSize: "12px",
    marginTop: "28px",
  },
};

export default AdminLogin;