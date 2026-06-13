const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const fetchMyOrders = async () => {
  const token = localStorage.getItem("butterBowlToken");

  const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
};

export const fetchOrderByOrderNumber = async (orderNumber) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/track/${orderNumber.trim()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Order not found");
  }

  return data;
};