"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { getCategories } from "@/services/categoryService";
import styles from "./SubCategoryStrip.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function mediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export default function SubCategoryStrip({
  title = "Shop by Subcategory",
  tag = "Explore",
}) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then((res) => {
        const list = (res.data || []).flatMap((cat) =>
          (cat.subcategories || []).map((sub) => ({
            ...sub,
            parentSlug: cat.slug,
          }))
        );
        setSubs(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className={`section ${styles.wrap}`}>
        <div className="container">
          <div className={styles.header}>
            <span className="section-tag">{tag}</span>
            <h2 className="section-title">{title}</h2>
          </div>
          <div className={styles.skeletonRow}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!subs.length) return null;

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className="section-tag">{tag}</span>
            <h2 className={`section-title ${styles.title}`}>{title}</h2>
          </div>
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.track} ref={scrollRef}>
          {subs.map((sub) => (
            <Link
              key={sub.id}
              href={`/shop?subcategory=${sub.slug}`}
              className={styles.card}
            >
              <div className={styles.imageWrap}>
                {sub.image_url ? (
                  <img
                    src={mediaUrl(sub.image_url)}
                    alt={sub.name}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    {(sub.name || "?").charAt(0)}
                  </div>
                )}
              </div>
              <span className={styles.name}>{sub.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
