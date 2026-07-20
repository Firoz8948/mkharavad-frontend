"use client";

import { useEffect, useState } from "react";

import {
  getAdminMetafields,
  createMetafield,
  updateMetafield,
  deleteMetafield,
} from "@/services/adminService";
import styles from "./metafields.module.css";

export default function AdminMetafieldsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getAdminMetafields();
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createMetafield({ name: name.trim() });
      setName("");
      fetchItems();
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to create metafield.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await updateMetafield(item.id, { is_active: !item.is_active });
      fetchItems();
    } catch {
      alert("Failed to update metafield.");
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"? Product content for this section will remain but won't display.`)) {
      return;
    }
    setDeleting(item.id);
    try {
      await deleteMetafield(item.id);
      fetchItems();
    } catch {
      alert("Failed to delete metafield.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Metafields</h2>
          <p className={styles.subtitle}>
            Define sections like &quot;Key Features&quot; or &quot;Nutrition&quot;. Fill content per product in the product editor.
          </p>
        </div>
      </div>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <input
          className={styles.input}
          placeholder='e.g. Key Features'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className={styles.addBtn} disabled={saving || !name.trim()}>
          {saving ? "Adding…" : "+ Add Metafield"}
        </button>
      </form>

      {loading ? (
        <div className={styles.loader}>
          <div className={styles.spinner} />
        </div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <span>📋</span>
          <p>No metafields yet. Add one above to show accordion sections on product pages.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.id} className={`${styles.row} ${!item.is_active ? styles.inactive : ""}`}>
              <div>
                <div className={styles.rowName}>{item.name}</div>
                <div className={styles.rowKey}>key: {item.key}</div>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.toggleBtn}
                  onClick={() => toggleActive(item)}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
