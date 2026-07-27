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

/** Must match HeroSection.module.css aspect ratios. */
const ASPECT = {
  desktop: 21 / 8,
  mobile: 4 / 5,
};

function imageSrc(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("/assets")) return url;
  return `${API_URL}${url}`;
}

/**
 * Shows live (cover) crop + full image with cut zones dimmed.
 */
function CropPreview({ src, aspect, deviceLabel }) {
  const [nat, setNat] = useState(null);

  if (!src) {
    return (
      <div className={styles.previewEmpty}>
        <span>No image — upload to see crop preview</span>
      </div>
    );
  }

  let cutNote = "Loading…";
  let windowStyle = { left: "0%", top: "0%", width: "100%", height: "100%" };

  if (nat?.w && nat?.h) {
    const imgAspect = nat.w / nat.h;
    if (imgAspect > aspect) {
      // Image wider than frame → left/right cut
      const visibleW = (aspect / imgAspect) * 100;
      const left = (100 - visibleW) / 2;
      windowStyle = { left: `${left}%`, top: "0%", width: `${visibleW}%`, height: "100%" };
      const cutPct = Math.round(100 - visibleW);
      cutNote =
        cutPct > 1
          ? `~${cutPct}% of width is cut (left & right edges)`
          : "Almost no crop — image matches the frame";
    } else if (imgAspect < aspect) {
      // Image taller than frame → top/bottom cut
      const visibleH = (imgAspect / aspect) * 100;
      const top = (100 - visibleH) / 2;
      windowStyle = { left: "0%", top: `${top}%`, width: "100%", height: `${visibleH}%` };
      const cutPct = Math.round(100 - visibleH);
      cutNote =
        cutPct > 1
          ? `~${cutPct}% of height is cut (top & bottom)`
          : "Almost no crop — image matches the frame";
    } else {
      cutNote = "No crop — image matches the frame exactly";
    }
  }

  return (
    <div className={styles.cropBlock}>
      <div className={styles.cropLabel}>Live preview ({deviceLabel})</div>
      <div
        className={styles.liveFrame}
        style={{ aspectRatio: String(aspect) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" />
      </div>

      <div className={styles.cropLabel}>Full image — shaded = cut off on site</div>
      <div className={styles.fullFrame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          onLoad={(e) =>
            setNat({
              w: e.currentTarget.naturalWidth,
              h: e.currentTarget.naturalHeight,
            })
          }
        />
        <div className={styles.cutOverlay} aria-hidden>
          <div className={styles.cutWindow} style={windowStyle} />
        </div>
      </div>
      <p className={styles.cutNote}>{cutNote}</p>
    </div>
  );
}

export default function BannerManager({ device }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const isDesktop = device === "desktop";
  const aspect = ASPECT[device] || ASPECT.desktop;

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
        title: null,
        title_highlight: null,
        subtitle: null,
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
        title: null,
        title_highlight: null,
        subtitle: null,
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
            Image + optional link only. Preview shows exactly what visitors see
            and which edges get cropped ({isDesktop ? "21∶8" : "4∶5"}).
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
                  <CropPreview
                    src={imageSrc(slide.image_url)}
                    aspect={aspect}
                    deviceLabel={isDesktop ? "desktop" : "mobile"}
                  />
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

                  <label>
                    Link URL (optional)
                    <input
                      value={slide.link_url || ""}
                      onChange={(e) =>
                        updateLocal(slide.id, { link_url: e.target.value })
                      }
                      placeholder="/shop or https://…"
                    />
                  </label>
                  <p className={styles.fieldHint}>
                    When someone clicks the banner, they go to this URL. Leave
                    blank to send them to Shop.
                  </p>
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
