"use client";

import { useEffect, useRef, useState } from "react";
import {
  getAdminVideoProducts,
  createVideoProduct,
  updateVideoProduct,
  deleteVideoProduct,
} from "@/services/adminService";
import styles from "./video-products.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  category: "",
  stock: "0",
  unit: "piece",
  position: "0",
  is_active: true,
};

export default function AdminVideoProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const fileRef = useRef();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getAdminVideoProducts();
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setVideoFile(null);
    setVideoPreview(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      mrp: String(item.mrp),
      category: item.category,
      stock: String(item.stock),
      unit: item.unit || "piece",
      position: String(item.position),
      is_active: item.is_active,
    });
    setVideoFile(null);
    setVideoPreview(item.video_url ? `${API_BASE}${item.video_url}` : null);
    setModalOpen(true);
  };

  const handleVideoFile = (file) => {
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.mrp || !form.category.trim()) {
      alert("Name, price, MRP and category are required.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append("price", form.price);
      fd.append("mrp", form.mrp);
      fd.append("category", form.category.trim());
      fd.append("stock", form.stock);
      fd.append("unit", form.unit);
      fd.append("position", form.position);
      fd.append("is_active", form.is_active);
      if (videoFile) fd.append("video", videoFile);

      if (editing) {
        await updateVideoProduct(editing.id, fd);
      } else {
        await createVideoProduct(fd);
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    setDeleting(item.id);
    try {
      await deleteVideoProduct(item.id);
      fetchItems();
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Video Products</h2>
          <p className={styles.subtitle}>{items.length} video products</p>
        </div>
        <button type="button" className={styles.addBtn} onClick={openAdd}>
          + Add Video Product
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}><div className={styles.spinner} /></div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <span>🎬</span>
          <p>No video products yet.</p>
          <button type="button" className={styles.addBtn} onClick={openAdd}>
            Add First Video Product
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={`${styles.card} ${!item.is_active ? styles.inactive : ""}`}>
              <div className={styles.videoWrap}>
                {item.video_url ? (
                  <video
                    src={`${API_BASE}${item.video_url}`}
                    className={styles.video}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                ) : (
                  <div className={styles.noVideo}>🎬 No video</div>
                )}
                {!item.is_active && <div className={styles.inactiveBadge}>Hidden</div>}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <span className={styles.itemCategory}>{item.category}</span>
                <div className={styles.itemPrices}>
                  <span className={styles.itemPrice}>₹{item.price.toLocaleString("en-IN")}</span>
                  {item.mrp > item.price && (
                    <span className={styles.itemMrp}>₹{item.mrp.toLocaleString("en-IN")}</span>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <button type="button" className={styles.editBtn} onClick={() => openEdit(item)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item)}
                    disabled={deleting === item.id}
                  >
                    {deleting === item.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editing ? `Edit — ${editing.name}` : "New Video Product"}
              </h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGrid}>
                {/* Left — fields */}
                <div className={styles.formLeft}>
                  <div className={styles.field}>
                    <label className={styles.label}>Product Name *</label>
                    <input
                      className={styles.input}
                      placeholder="e.g. Iron Sheet 0.5mm"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Description</label>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      placeholder="Short description…"
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>

                  <div className={styles.row2}>
                    <div className={styles.field}>
                      <label className={styles.label}>Price (₹) *</label>
                      <input
                        className={styles.input}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={form.price}
                        onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>MRP (₹) *</label>
                      <input
                        className={styles.input}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={form.mrp}
                        onChange={(e) => setForm((p) => ({ ...p, mrp: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.row2}>
                    <div className={styles.field}>
                      <label className={styles.label}>Category *</label>
                      <input
                        className={styles.input}
                        placeholder="Iron Sheet"
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Stock</label>
                      <input
                        className={styles.input}
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className={styles.row2}>
                    <div className={styles.field}>
                      <label className={styles.label}>Unit</label>
                      <input
                        className={styles.input}
                        placeholder="piece"
                        value={form.unit}
                        onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Display Order</label>
                      <input
                        className={styles.input}
                        type="number"
                        min="0"
                        value={form.position}
                        onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Visibility</label>
                    <div className={styles.toggleRow}>
                      <span className={styles.toggleLabel}>
                        {form.is_active ? "Active" : "Hidden"}
                      </span>
                      <button
                        type="button"
                        className={`${styles.toggle} ${form.is_active ? styles.toggleOn : ""}`}
                        onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
                        aria-pressed={form.is_active}
                      >
                        <span className={styles.toggleThumb} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right — video upload */}
                <div className={styles.formRight}>
                  <label className={styles.label}>Product Video</label>
                  <div
                    className={styles.videoDropZone}
                    onClick={() => fileRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
                    }}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/avi"
                      style={{ display: "none" }}
                      onChange={(e) => handleVideoFile(e.target.files?.[0])}
                    />
                    {videoPreview ? (
                      <video
                        src={videoPreview}
                        className={styles.videoPreview}
                        controls
                        muted
                        playsInline
                      />
                    ) : (
                      <div className={styles.dropPlaceholder}>
                        <div className={styles.dropIcon}>🎬</div>
                        <p className={styles.dropText}>
                          <strong>Click to upload</strong> video
                        </p>
                        <p className={styles.dropSub}>MP4, WEBM, MOV · max recommended 50 MB</p>
                      </div>
                    )}
                  </div>
                  {videoFile && <p className={styles.fileName}>📎 {videoFile.name}</p>}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? <><span className={styles.btnSpinner} /> Saving…</> : editing ? "Save Changes" : "Create Video Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
