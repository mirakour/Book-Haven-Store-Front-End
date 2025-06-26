import { useEffect, useState } from "react";
import { fetchMe } from "../api/auth";
import { fetchOrders, cancelOrder } from "../api/order";

function Account() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("date-desc");

  useEffect(() => {
    async function fetchAccountData() {
      try {
        const me = await fetchMe();
        setUser({ username: me.username });
        setReviews(me.reviews || []);
      } catch (err) {
        setError("❌ Could not load account data.");
        console.error(err);
      }

      try {
        const orderData = await fetchOrders();
        setOrders(orderData);
      } catch (err) {
        console.error("Error loading orders:", err);
      }
    }

    fetchAccountData();
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortOption === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sortOption === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortOption === "title-asc") return a.book_title.localeCompare(b.book_title);
    if (sortOption === "title-desc") return b.book_title.localeCompare(a.book_title);
    return 0;
  });

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Failed to cancel order:", err.message);
    }
  };

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!user) return <p style={{ color: "white", textAlign: "center" }}>Loading account...</p>;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#2e2e2e", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", color: "white", textAlign: "center", minHeight: "100vh" }}>
      <div style={{
        backgroundColor: "#4a4a4a",
        padding: "2rem",
        borderRadius: "10px",
        border: "2px solid white",
        maxWidth: "600px",
        margin: "0 auto",
        marginBottom: "2rem"
      }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "2rem" }}>👤 My Account</h2>
        <p style={{ marginBottom: "1rem", fontSize: "1.3rem" }}><strong>Username:</strong> {user.username}</p>
      </div>

      <div style={{
        backgroundColor: "#4a4a4a",
        padding: "2rem",
        borderRadius: "10px",
        border: "2px solid white",
        maxWidth: "800px",
        margin: "0 auto",
        marginBottom: "2rem"
      }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "2rem" }}>📝 My Reviews</h3>
        {reviews.length === 0 ? (
          <p style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>You haven't left any reviews yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviews.map((review) => (
              <li key={review.id} style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>
                <strong>{review.book_title}:</strong> Rated {review.rating}/5 — <em>{review.content}</em>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{
        backgroundColor: "#4a4a4a",
        padding: "2rem",
        borderRadius: "10px",
        border: "2px solid white",
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "2rem" }}>📦 My Orders</h3>
        <div style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
          <label htmlFor="sort"><strong>🔃 Sort by: </strong></label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: "0.3rem 0.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              margin: "0 auto",
              fontSize: "1.2rem"
            }}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>

        {sortedOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sortedOrders.map((order) => (
              <li
                key={order.id}
                style={{
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  backgroundColor: "#3b3b3b",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #888",
                  fontSize: "1.3rem"
                }}
              >
                <img
                  src={order.image_url}
                  alt={order.book_title}
                  style={{ width: "200px", height: "auto", borderRadius: "6px"}}
                />
                <div style={{ textAlign: "left"}}>
                  <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                  <p><strong>Book:</strong> {order.book_title}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Total:</strong> ${(order.quantity * order.price).toFixed(2)}</p>
                  <p><strong>Note:</strong> {order.note || "No note provided."}</p>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      fontSize: "1.2rem",
                      borderRadius: "5px",
                      padding: "0.4rem 0.8rem",
                      cursor: "pointer",
                      marginTop: "0.5rem",
                      transition: "transform 0.2s ease, filter 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.filter = "brightness(1.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.filter = "brightness(1)";
                    }}
                  >
                    🗑️ Cancel Order
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Account;
