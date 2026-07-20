import api from "./api";

export const getCategories = () => api.get("/categories/");

export const getCategoryBySlug = (slug) => api.get(`/categories/slug/${slug}`);

export const getSubCategoryBySlug = (slug) =>
  api.get(`/categories/subcategories/slug/${slug}`);

export const getCategoryProducts = (id, params) =>
  api.get(`/categories/${id}/products`, { params });

export const getSubCategoryProducts = (id, params) =>
  api.get(`/categories/subcategories/${id}/products`, { params });
