import { API_BASE } from "../config/api";

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email,
      role:"customer"

     }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "Failed to send reset email");
  return data;
};

export const resetPassword = async (token, password) => {
  const response = await fetch(`${API_BASE}/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "Failed to reset password");
  return data;
};