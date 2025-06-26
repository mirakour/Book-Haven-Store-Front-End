import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header
      style={{
        backgroundColor: "#2e2e2e",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        borderBottom: "2px solid white",
        padding: "1rem 2rem",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* LEFT: Logo/Title */}
        <div style={{ flex: 1 }}>
          <Link
            to="/"
            style={{
              fontSize: "2.2rem",
              fontWeight: "700",
              color: "white",
              textDecoration: "none",
            }}
          >
            📚 Book Haven 📚
          </Link>
        </div>

        {/* RIGHT: Auth Links */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {token ? (
            <>
              <Link
                to="/account"
                style={{
                  fontSize: "1.5rem",
                  color: "#f97316",
                  textDecoration: "none",
                }}
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#f97316",
                  color: "white",
                  fontSize: "1.5rem",
                  padding: "0.5rem 1rem",
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
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  fontSize: "1.5rem",
                  color: "#f97316",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  fontSize: "1.5rem",
                  color: "#f97316",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
