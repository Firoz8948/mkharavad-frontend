"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminLogin } from "@/services/adminService";
import styles from "./FooterAdminLogin.module.css";

export default function FooterAdminLogin() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminLogin("admin", password);
      localStorage.setItem("admin_token", res.data.access_token);
      localStorage.setItem("admin_user", JSON.stringify(res.data.admin));
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setOpen((v) => !v)}
      >
        Admin
      </button>

      {open && (
        <form className={styles.panel} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Username
            <input
              className={styles.input}
              type="text"
              value="admin"
              readOnly
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin"
              autoComplete="current-password"
            />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      )}
    </div>
  );
}
