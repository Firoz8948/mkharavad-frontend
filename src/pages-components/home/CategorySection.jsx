"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { getCategories } from "@/services/categoryService";
import styles from "./CategorySection.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function mediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIds, setOpenIds] = useState(() => new Set());
  const scrollRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const toggleOpen = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <section className={`section ${styles.wrap}`}>
        <div className="container">
          <h2 className={`section-title ${styles.headerTitle}`}>Shop by Category</h2>
          <div className={styles.skeletonRow}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.headerText}>
            <span className="section-tag">Browse</span>
            <h2 className={`section-title ${styles.headerTitle}`}>Shop by Category</h2>
          </div>
          <div className={styles.scrollBtns}>
            <button
              type="button"
              className={styles.scrollBtn}
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.scrollBtn}
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>

        {/* Desktop / tablet: large image cards */}
        <div className={styles.desktopRow} ref={scrollRef}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={styles.catCard}
            >
              <div className={styles.catImgWrap}>
                {cat.image_url ? (
                  <img
                    src={mediaUrl(cat.image_url)}
                    alt={cat.name}
                    className={styles.catImg}
                  />
                ) : (
                  <div className={styles.catPlaceholder}>
                    {(cat.name || "?").charAt(0)}
                  </div>
                )}
              </div>
              <span className={styles.catLabel}>{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile: accordion — category only, expand for subcategories */}
        <div className={styles.mobileList}>
          {categories.map((cat) => {
            const open = openIds.has(cat.id);
            const subs = cat.subcategories || [];
            return (
              <div
                key={cat.id}
                className={`${styles.accItem} ${open ? styles.accOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.accTrigger}
                  onClick={() => toggleOpen(cat.id)}
                  aria-expanded={open}
                >
                  <span className={styles.accName}>{cat.name}</span>
                  <span className={styles.accChevron} aria-hidden>
                    {open ? "▾" : "▸"}
                  </span>
                </button>
                {open && (
                  <div className={styles.accBody}>
                    {subs.length === 0 ? (
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className={styles.accSubLink}
                      >
                        View all
                      </Link>
                    ) : (
                      subs.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop?subcategory=${sub.slug}`}
                          className={styles.accSubLink}
                        >
                          {sub.name}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
