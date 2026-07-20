"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  createPromoCode,
  deletePromoCode,
  getAdminPromoCodes,
  updatePromoCode,
} from "@/services/adminService";
import styles from "./promocodes.module.css";

const emptyForm = {
  code: "",
  action_type: "free_shipping",
  percent_value: 20,
  valid_from: "",
  valid_to: "",
  is_active: true,
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminPromoCodesPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    ...emptyForm,
    valid_from: todayISO(),
    valid_to: todayISO(),
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminPromoCodes();
      setPromos(res.data || []);
    } catch (e) {
      toast.error(e.message || "Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      valid_from: todayISO(),
      valid_to: todayISO(),
    });
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (promo) => {
    setEditingId(promo.id);
    setForm({
      code: promo.code,
      action_type: promo.action_type,
      percent_value: promo.percent_value || 20,
      valid_from: promo.valid_from,
      valid_to: promo.valid_to,
      is_active: promo.is_active,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Enter a promo code");
      return;
    }
    if (!form.valid_from || !form.valid_to) {
      toast.error("Select validity dates");
      return;
    }
    if (
      form.action_type === "percent_off" &&
      (!form.percent_value || Number(form.percent_value) <= 0)
    ) {
      toast.error("Enter a valid percent");
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      action_type: form.action_type,
      percent_value:
        form.action_type === "percent_off" ? Number(form.percent_value) : null,
      valid_from: form.valid_from,
      valid_to: form.valid_to,
      is_active: form.is_active,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updatePromoCode(editingId, payload);
        toast.success("Promo code updated");
      } else {
        await createPromoCode(payload);
        toast.success("Promo code created");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (promo) => {
    if (!confirm(`Delete promo code ${promo.code}?`)) return;
    try {
      await deletePromoCode(promo.id);
      toast.success("Deleted");
      if (editingId === promo.id) resetForm();
      load();
    } catch (e) {
      toast.error(e.message || "Failed to delete");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Promo Codes</h2>
          <p className={styles.subtitle}>
            Create coupons like FREESHIP or SAVE20 with free shipping or % off,
            and a validity date range.
          </p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit promo code" : "Create promo code"}</h3>
        <div className={styles.grid}>
          <label>
            Code
            <input
              name="code"
              value={form.code}
              onChange={onChange}
              placeholder="FREESHIP"
              required
            />
          </label>

          <label>
            Action
            <select
              name="action_type"
              value={form.action_type}
              onChange={onChange}
            >
              <option value="free_shipping">Free shipping</option>
              <option value="percent_off">Percent off</option>
            </select>
          </label>

          {form.action_type === "percent_off" && (
            <label>
              Percent
              <div className={styles.percentRow}>
                <select
                  value={[10, 20, 30].includes(Number(form.percent_value))
                    ? String(form.percent_value)
                    : "custom"}
                  onChange={(e) => {
                    if (e.target.value === "custom") return;
                    setForm((prev) => ({
                      ...prev,
                      percent_value: Number(e.target.value),
                    }));
                  }}
                >
                  <option value="10">10% off</option>
                  <option value="20">20% off</option>
                  <option value="30">30% off</option>
                  <option value="custom">Custom</option>
                </select>
                <input
                  name="percent_value"
                  type="number"
                  min={1}
                  max={100}
                  value={form.percent_value}
                  onChange={onChange}
                />
              </div>
            </label>
          )}

          <label>
            Valid from
            <input
              type="date"
              name="valid_from"
              value={form.valid_from}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Valid to
            <input
              type="date"
              name="valid_to"
              value={form.valid_to}
              onChange={onChange}
              required
            />
          </label>

          <label className={styles.check}>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={onChange}
            />
            Active
          </label>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving
              ? "Saving…"
              : editingId
                ? "Update Promo"
                : "Create Promo"}
          </button>
          {editingId && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.tableWrap}>
        <h3>All coupons</h3>
        {loading ? (
          <p className={styles.muted}>Loading…</p>
        ) : promos.length === 0 ? (
          <p className={styles.muted}>No promo codes yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Action</th>
                <th>Valid from</th>
                <th>Valid to</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.id}>
                  <td>
                    <strong>{promo.code}</strong>
                  </td>
                  <td>{promo.action_label}</td>
                  <td>{promo.valid_from}</td>
                  <td>{promo.valid_to}</td>
                  <td>
                    <span
                      className={
                        promo.is_active ? styles.active : styles.inactive
                      }
                    >
                      {promo.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className={styles.rowActions}>
                    <button type="button" onClick={() => handleEdit(promo)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.danger}
                      onClick={() => handleDelete(promo)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
