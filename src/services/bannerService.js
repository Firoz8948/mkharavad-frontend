import api from "./api";

export const getBanners = (device) =>
  api.get("/banners/", { params: device ? { device } : {} });

export const validatePromoCode = (data) =>
  api.post("/promocodes/validate", data);

export const quoteShipping = (data) =>
  api.post("/shipping-zones/quote", data);
