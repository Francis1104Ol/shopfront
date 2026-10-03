const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

   listProducts: (search) => {
    const trimmed = search?.trim();
    const path = trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products";
    return request(path);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (payload, token) => request("/products", { method: "POST", body: payload, token }),
  updateProduct: (id, payload, token) => request(`/products/${id}`, { method: "PUT", body: payload, token }),
  deleteProduct: (id, token) => request(`/products/${id}`, { method: "DELETE", token }),

  checkout: (items, token) => request("/orders/checkout", { method: "POST", body: { items }, token }),
  myOrders: (token) => request("/orders", { token }),
  allOrders: (token) => request("/orders/all", { token }),
  updateOrderStatus: (id, status, token) =>
    request(`/orders/${id}/status`, { method: "PUT", body: { status }, token }),
  getReviews:(productId) =>request(`/reviews/product/${productId}`),
  createReview: (productId, payload, token) =>request(`/reviews/product/${productId}`,{method: "POST", body: payload, token}),
  updateReview: (reviewId, payload, token) =>request(`/reviews/${reviewId}`, {method: "PUT", body: payload, token }),
  forgotPassword: (email) =>
  request("/password-reset/forgot-password", { method: "POST", body: { email } }),
resetPassword: (token, newPassword) =>
  request("/password-reset/reset-password", { method: "POST", body: { token, newPassword } }),
googleLogin: (credential) => request("/auth/google", { method: "POST", body: { credential } }),
};
