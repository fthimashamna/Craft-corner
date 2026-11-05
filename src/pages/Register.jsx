import { useState } from "react";
import { registerUser } from "../services/userService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password!== confirmPassword){
        setMessage("Passwords do not match!");
        return;
    }

    const userData = {
      name,
      email,
      password,
    };

    try {
      await registerUser(userData);
      setMessage("Registration successful!");
    } catch (error) {
      setMessage("Registration failed, Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5EBDD",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#5C3A25",
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Create Your Account
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#8B6B55",
            fontSize: "16px",
            marginBottom: "25px",
          }}
        >
          Join the Craftiva community
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "550px",
            padding: "35px",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 5px 20px rgba(92, 58, 37, 0.15)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              border: "1px solid #D8C7B5",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              border: "1px solid #D8C7B5",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              border: "1px solid #D8C7B5",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />
        
          <input type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}required
          style={{
            width:"100%",
            padding:"13px",
            border:"1px solid #D8C7B5",
            borderRadius:"8px",
            boxSizing:"border-box",
            fontSize:"15px",
          }}
           />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: "#70452F",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>

        {message && (
          <p
            style={{
              color: "#5C3A25",
              backgroundColor: "#E8D8C3",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              marginTop: "18px",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;