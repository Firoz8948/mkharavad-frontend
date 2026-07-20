import api from "./api";

export const paymentService = {
  getConfig: () => api.get("/payments/config").then((r) => r.data),
  createOrder: (payload) =>
    api.post("/payments/create-order", payload).then((r) => r.data),
  verify: (payload) => api.post("/payments/verify", payload).then((r) => r.data),
};
