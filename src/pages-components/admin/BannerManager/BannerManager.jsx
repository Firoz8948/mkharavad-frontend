"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  createBanner,
  deleteBanner,
  getAdminBanners,
  updateBanner,
  uploadBannerImage,
} from "@/services/adminService";
import { API_URL } from "@/utils/constants";
import styles from "./banners.module.css";

function imageSrc(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("/assets")) return url;
  return `${API_URL}${url}`;
}

export default function BannerManager({ device }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const isDesktop = device === "desktop";

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminBanners(device);
      setSlides(res.data || []);
    } catch (e) {
      toast.error(e.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [device]);

  const handleAdd = async () => {
    try {
      await createBanner({
        device,
        position: slides.length,
        is_active: true,
        title: isDesktop ? "Premium Iron Cookware," : null,
        title_highlight: isDesktop ? "Built to Last" : null,
        subtitle: isDesktop
          ? "Durable, traditional craftsmanship for your kitchen."
          : null,
      });
      toast.success("Slide added");
      load();
    } catch (e) {
      toast.error(e.message || "Failed to add slide");
    }
  };

  const handleSave = async (slide) => {
    setSavingId(slide.id);
    try {
      await updateBanner(slide.id, {
        title: slide.title,
        title_highlight: slide.title_highlight,
        subtitle: slide.subtitle,
        link_url: slide.link_url || null,
        position: Number(slide.position) || 0,
        is_active: slide.is_active,
      });
      toast.success("Slide saved");
      load();
    } catch (e) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (slide) => {
    if (slides.length <= 1) {
      toast.error("Keep at least one slide");
      return;
    }
    if (!confirm("Delete this slide?")) return;
    try {
      await deleteBanner(slide.id);
      toast.success("Slide deleted");
      load();
    } catch (e) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const handleImage = async (slide, file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setSavingId(slide.id);
    try {
      await uploadBannerImage(slide.id, fd);
      toast.success("Image uploaded");
      load();
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setSavingId(null);
    }
  };

  const updateLocal = (id, patch) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            {isDesktop ? "Desktop Banner" : "Mobile Banner"}
          </h2>
          <p className={styles.subtitle}>
            Manage homepage {device} slides. Add at least 3 slides; you can add
            more anytime.
          </p>
        </div>
        <button type="button" className={styles.addBtn} onClick={handleAdd}>
          + Add Slide
        </button>
      </div>

      {loading ? (
        <p className={styles.muted}>Loading…</p>
      ) : slides.length === 0 ? (
        <div className={styles.empty}>
          <p>No slides yet. Add your first slide to get started.</p>
          <button type="button" className={styles.addBtn} onClick={handleAdd}>
            + Add Slide
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.card} ${!slide.is_active ? styles.inactive : ""}`}
            >
              <div className={styles.cardTop}>
                <strong>Slide {index + 1}</strong>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={!!slide.is_active}
                    onChange={(e) =>
                      updateLocal(slide.id, { is_active: e.target.checked })
                    }
                  />
                  Active
                </label>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.imageCol}>
                  <div className={styles.preview}>
                    {slide.image_url ? (
                      <img
                        src={imageSrc(slide.image_url)}
                        alt={`Slide ${index + 1}`}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>
                  <label className={styles.uploadBtn}>
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        handleImage(slide, e.target.files?.[0])
                      }
                    />
                  </label>
                </div>

                <div className={styles.fields}>
                  <label>
                    Position
                    <input
                      type="number"
                      min={0}
                      value={slide.position ?? index}
                      onChange={(e) =>
                        updateLocal(slide.id, {
                          position: Number(e.target.value),
                        })
                      }
                    />
                  </label>

                  {isDesktop && (
                    <>
                      <label>
                        Title
                        <input
                          value={slide.title || ""}
                          onChange={(e) =>
                            updateLocal(slide.id, { title: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        Title highlight
                        <input
                          value={slide.title_highlight || ""}
                          onChange={(e) =>
                            updateLocal(slide.id, {
                              title_highlight: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Subtitle
                        <textarea
                          rows={3}
                          value={slide.subtitle || ""}
                          onChange={(e) =>
                            updateLocal(slide.id, { subtitle: e.target.value })
                          }
                        />
                      </label>
                    </>
                  )}

                  <label>
                    Link URL (optional)
                    <input
                      value={slide.link_url || ""}
                      onChange={(e) =>
                        updateLocal(slide.id, { link_url: e.target.value })
                      }
                      placeholder="/shop"
                    />
                  </label>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.saveBtn}
                  disabled={savingId === slide.id}
                  onClick={() => handleSave(slide)}
                >
                  {savingId === slide.id ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(slide)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && slides.length > 0 && slides.length < 3 && (
        <p className={styles.hint}>
          Tip: add at least 3 slides for a full carousel experience.
        </p>
      )}
    </div>
  );
}
