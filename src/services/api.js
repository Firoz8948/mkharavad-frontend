import axios from "axios";
import Cookies from "js-cookie";

import { API_BASE, TOKEN_COOKIE } from "@/utils/constants";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("user_token") || Cookies.get(TOKEN_COOKIE);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let detail = error?.response?.data?.detail;
    if (Array.isArray(detail)) {
      detail = detail
        .map((d) => d?.msg || d?.message || JSON.stringify(d))
        .join("; ");
    } else if (detail && typeof detail === "object") {
      detail = detail.message || JSON.stringify(detail);
    }
    const message =
      detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    return Promise.reject({ ...error, message });
  }
);

export default api;
