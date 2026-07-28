"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ReelsCategoryPreview from "@/components/ReelsCategoryPreview/ReelsCategoryPreview";
import { getCategories } from "@/services/categoryService";
import { mediaUrl } from "@/utils/mediaUrl";
import styles from "./CategorySection.module.css";

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

  if (!categories.length) return null;

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
          {categories.map((cat) => {
            const isReels = !!cat.is_reels || cat.slug === "reels";
            const imgSrc = mediaUrl(cat.image_url);
            return (
              <Link
                key={cat.id}
                href={isReels ? "/reels" : `/shop?category=${cat.slug}`}
                className={`${styles.catCard} ${isReels ? styles.reelsCard : ""}`}
              >
                <div className={styles.catImgWrap}>
                  {isReels ? (
                    <ReelsCategoryPreview />
                  ) : imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 1100px) 240px, 280px"
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
            );
          })}
        </div>

        <div className={styles.mobileList}>
          {categories.map((cat) => {
            const isReels = !!cat.is_reels || cat.slug === "reels";
            if (isReels) {
              return (
                <Link key={cat.id} href="/reels" className={styles.accReelsLink}>
                  <span className={styles.accReelsPreview}>
                    <ReelsCategoryPreview />
                  </span>
                  <span className={styles.accReelsMeta}>
                    <strong>{cat.name}</strong>
                    <em>Watch & shop</em>
                  </span>
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
