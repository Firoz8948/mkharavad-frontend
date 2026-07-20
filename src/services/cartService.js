import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart/").then((r) => r.data),
  addToCart: (product_id, quantity = 1) =>
    api.post("/cart/add", { product_id, quantity }).then((r) => r.data),
  updateItem: (itemId, quantity) =>
    api.put(`/cart/update/${itemId}`, { quantity }).then((r) => r.data),
  removeItem: (itemId) =>
    api.delete(`/cart/remove/${itemId}`).then((r) => r.data),
  clearCart: () => api.delete("/cart/clear").then((r) => r.data),
};
