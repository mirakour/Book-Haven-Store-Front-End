export async function fetchReviewsByBook(bookId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:3000/books/${bookId}/reviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return await res.json();
}
