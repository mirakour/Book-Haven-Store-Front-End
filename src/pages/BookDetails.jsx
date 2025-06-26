import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBookById } from "../api/book";
import { fetchReviewsByBook } from "../api/reviews";
import { placeOrder } from "../api/order";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    async function loadBookDetails() {
      try {
        const fetchedBook = await fetchBookById(id);
        setBook(fetchedBook);
      } catch (err) {
        setError("❌ Failed to load book details.");
        console.error(err);
      }
    }

    async function loadReviewsIfLoggedIn() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const fetchedReviews = await fetchReviewsByBook(id);
        setReviews(fetchedReviews);
      } catch (err) {
        console.warn("🔐 Reviews not loaded (probably not logged in).");
      }
    }

    loadBookDetails();
    loadReviewsIfLoggedIn();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const res = await fetch(`http://localhost:3000/books/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          rating: newRating,
          content: newContent,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      const newReview = await res.json();
      setReviews((prev) => [...prev, newReview]);
      setNewRating(5);
      setNewContent("");
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderMessage("");

    const today = new Date().toISOString().split("T")[0];

    try {
      await placeOrder(today, note, Number(id), quantity);
      setOrderMessage("✅ Order placed successfully!");
      setNote("");
      setQuantity(1);
    } catch (err) {
      setOrderMessage(`❌ Failed to place order: ${err.message}`);
    }
  };

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!book) return <p style={{ color: "white", textAlign: "center" }}>Loading book details...</p>;

  return (
    <div style={{
      padding: "2rem",
      backgroundColor: "#2e2e2e",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      color: "white",
      minHeight: "100vh",
      textAlign: "center"
    }}>
      <div style={{
        backgroundColor: "#4a4a4a",
        padding: "2rem",
        borderRadius: "10px",
        border: "2px solid white",
        maxWidth: "700px",
        margin: "0 auto",
        marginBottom: "2rem"
      }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{book.title}</h2>
        <img
          src={book.image_url}
          alt={book.title}
          style={{ width: "200px", height: "auto", borderRadius: "6px", marginBottom: "1rem" }}
        />
        <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}><strong>Price:</strong> ${book.price}</p>
        <p style={{ fontSize: "1.4rem", marginBottom: "1rem" }}><strong>Synopsis:</strong> {book.synopsis}</p>
      </div>

      <div style={{
        backgroundColor: "#4a4a4a",
        padding: "2rem",
        borderRadius: "10px",
        border: "2px solid white",
        maxWidth: "700px",
        margin: "0 auto",
        marginBottom: "2rem"
      }}>
        <h3 style={{ fontSize: "2rem", marginBottom: "1rem" }}>📝 Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviews.map((review) => (
              <li key={review.id} style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>
                <strong>{review.username}</strong> rated it {review.rating}/5: <em>{review.content}</em>
              </li>
            ))}
          </ul>
        )}
      </div>

      {localStorage.getItem("token") && (
        <>
          <div style={{
            backgroundColor: "#4a4a4a",
            padding: "2rem",
            borderRadius: "10px",
            border: "2px solid white",
            maxWidth: "700px",
            margin: "0 auto",
            marginBottom: "2rem"
          }}>
            <h3 style={{ fontSize: "2rem", marginBottom: "1rem" }}>✍️ Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <input
                type="number"
                min="1"
                max="5"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                required
                style={{ padding: "0.5rem", fontSize: "1.5rem", borderRadius: "5px", width: "8%", marginBottom: "1rem", backgroundColor: "gray", color: "white" }}
              /><br />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                placeholder="Your review..."
                style={{
                  padding: "0.5rem",
                  fontSize: "1.4rem",
                  backgroundColor: "gray",
                  borderRadius: "5px",
                  width: "90%",
                  height: "100px",
                  marginBottom: "1rem",
                  color: "white"
                }}
              /><br />
              <button
                type="submit"
                style={{
                  backgroundColor: "#f97316",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  fontSize: "1.3rem",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, filter 0.2s ease"
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
                Submit Review
              </button>
              {submitError && <p style={{ color: "red" }}>{submitError}</p>}
            </form>
          </div>

          <div style={{
            backgroundColor: "#4a4a4a",
            padding: "2rem",
            borderRadius: "10px",
            border: "2px solid white",
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            <h3 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛒 Place an Order</h3>
            <form onSubmit={handlePlaceOrder}>
              <label style={{ fontSize: "1.3rem" }}>Quantity:</label><br />
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ padding: "0.5rem", fontSize: "1.5rem", borderRadius: "5px", width: "8%", marginBottom: "1rem", backgroundColor: "gray", color: "white" }}
              /><br />
              <label style={{ fontSize: "1.3rem" }}>Note (optional):</label><br />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ padding: "0.5rem", fontSize: "1.5rem", borderRadius: "5px", width: "80%", marginBottom: "1rem", backgroundColor: "gray", color: "white"}}
              /><br />
              <button
                type="submit"
                style={{
                  backgroundColor: "#22c55e",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  fontSize: "1.3rem",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, filter 0.2s ease"
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
                Place Order
              </button>
            </form>
            {orderMessage && (
              <p style={{ marginTop: "1rem", fontSize: "1.3rem",color: orderMessage.startsWith("✅") ? "lightgreen" : "red" }}>
                {orderMessage}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BookDetails;
