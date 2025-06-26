import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("http://localhost:3000/books");
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem", backgroundColor: "#2e2e2e"}}>
      <h2 style={{ color: "gray", fontSize: "3.0rem", textAlign: "center", marginBottom: "1rem", font: "-apple-system"}}>Book Store Catalog</h2>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            width: "300px",
            fontSize: "1.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center"
        }}
      >
        {filteredBooks.map((book) => (
          <div
          key={book.id}
          style={{
           backgroundColor: "gray",
           padding: "1rem",
           width: "220px",
           borderRadius: "8px",
           boxShadow: "0 0 10px rgba(0,0,0,0.2)",
           textAlign: "center",
           border: "2px solid white",
           transition: "transform 0.3s ease, box-shadow 0.3s ease",
           cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(255,255,255,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
          }}
        >
            {book.image_url && (
              <img
                src={book.image_url}
                alt={book.title}
                style={{
                  width: "220px",
                  height: "320px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginBottom: "0.5rem"
                }}
              />
            )}
            <h3 style={{ color: "#002", fontSize: "1.5rem" }}>{book.title}</h3>
            <p style={{ color: "#fff", fontWeight: "bold", fontSize: "1.3rem" }}>${book.price}</p>
            <Link to={`/books/${book.id}`}>
              <button
                style={{
                  backgroundColor: "#f97316",
                  color: "#fff",
                  fontSize: "1.2rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "5px",
                  border: "none",
                  marginTop: "0.5rem",
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
                View Details + Review 📦 BUY
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
