"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { adminLogin } from "@/services/adminService";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const stored = localStorage.getItem("admin_user");
    if (token && stored) {
      setAdmin(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await adminLogin(username, password);
    const { access_token, admin: adminData } = res.data;
    localStorage.setItem("admin_token", access_token);
    localStorage.setItem("admin_user", JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAdmin(null);
    router.push("/admin/login");
  };

  const refreshAdmin = async () => {
    const { getAdminMe } = await import("@/services/adminService");
    const res = await getAdminMe();
    const adminData = res.data;
    localStorage.setItem("admin_user", JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, login, logout, refreshAdmin, setAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
