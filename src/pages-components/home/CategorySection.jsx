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

  const reelsCategory = {
    id: "reels-hardcoded",
    name: "Reels",
    slug: "reels",
    image_url: null,
    is_reels: true,
  };
  const displayCategories = [...categories, reelsCategory];

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

        <div className={styles.desktopRow} ref={scrollRef}>
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.is_reels ? "/reels" : `/shop?category=${cat.slug}`}
              className={`${styles.catCard} ${cat.is_reels ? styles.reelsCard : ""}`}
            >
              <div className={styles.catImgWrap}>
                {cat.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(cat.image_url)}
                    alt={cat.name}
                    className={styles.catImg}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                {!cat.image_url || cat.is_reels ? (
                  <div className={styles.catPlaceholder}>
                    {cat.is_reels ? "▶" : (cat.name || "?").charAt(0)}
                  </div>
                ) : null}
              </div>
              <span className={styles.catLabel}>{cat.name}</span>
            </Link>
          ))}
        </div>

        <div className={styles.mobileList}>
          {displayCategories.map((cat) => {
            if (cat.is_reels) {
              return (
                <Link key={cat.id} href="/reels" className={styles.accReelsLink}>
                  <span>▶ Reels</span>
                  <span aria-hidden>›</span>
                </Link>
              );
            }
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
