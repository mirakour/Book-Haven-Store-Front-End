import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("token", data.token);
      navigate("/account");
    } catch (err) {
      setError("❌ Invalid credentials. Please try again.");
      console.error(err);
    }
  }

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#2e2e2e",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#4a4a4a",
          padding: "2rem",
          borderRadius: "10px",
          border: "2px solid white",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>🔐 Log In</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "0.75rem",
              marginBottom: "1rem",
              width: "90%",
              fontSize: "1.3rem",
              borderRadius: "6px",
              backgroundColor: "gray",
              color: "white",
              border: "none",
            }}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "0.75rem",
              marginBottom: "1.5rem",
              width: "90%",
              fontSize: "1.3rem",
              borderRadius: "6px",
              backgroundColor: "gray",
              color: "white",
              border: "none",
            }}
          /><br />
          <button
            type="submit"
            style={{
              backgroundColor: "#f97316",
              color: "white",
              fontSize: "1.3rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s ease, filter 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Log In
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
