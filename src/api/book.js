export async function fetchBookById(id) {
  const res = await fetch(`http://localhost:3000/books/${id}`);
  if (!res.ok) throw new Error("Failed to fetch book");
  return await res.json();
}
