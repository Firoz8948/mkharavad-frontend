import api from "./api";

export const productService = {
  getProducts: (params = {}) =>
    api.get("/products/", { params }).then((r) => r.data),
  getProduct: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
  getByCategory: (name, params = {}) =>
    api.get(`/products/category/${name}`, { params }).then((r) => r.data),
  search: (q, params = {}) =>
    api.get("/products/search", { params: { q, ...params } }).then((r) => r.data),
  getFeatured: () => api.get("/products/featured").then((r) => r.data),
  getCategories: () => api.get("/categories/").then((r) => r.data),
};
