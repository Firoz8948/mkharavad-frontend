import api from "./api";

export const orderService = {
  createOrder: (payload) =>
    api.post("/orders/create", payload).then((r) => r.data),
  getMyOrders: () => api.get("/orders/my").then((r) => r.data),
};
