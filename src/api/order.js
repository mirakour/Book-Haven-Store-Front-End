export async function placeOrder(date, note, bookId, quantity) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, note, bookId, quantity }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to place order");
  }

  return await res.json();
}

export async function fetchOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch orders");
  return await res.json();
}

export async function cancelOrder(orderId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to cancel order");
  return await res.json();
}
