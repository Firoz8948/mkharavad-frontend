import axios from "axios";

import { API_BASE } from "@/utils/constants";

const adminApi = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.startsWith("/admin") && path !== "/admin/login") {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          window.location.href = "/admin/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
