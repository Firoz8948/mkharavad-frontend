"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import styles from "./VideoProducts.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1"}/video-products`;

export default function VideoProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(API_ENDPOINT)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-tag">In Action</span>
          <h2 className={`section-title ${styles.title}`}>See Our Products Live</h2>
          <p className="section-subtitle">Watch before you buy</p>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeletonCard}`} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <VideoProductCard
                key={item.id}
                item={item}
                onAdd={() =>
                  addToCart(
                    {
                      id: item.product_id || item.id,
                      name: item.name,
                      price: item.price,
                      mrp: item.mrp,
                      slug: `product-${item.product_id || item.id}`,
                      images: [],
                      stock: item.stock,
                    },
                    1
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function VideoProductCard({ item, onAdd }) {
  const [playing, setPlaying] = useState(false);
  const discount =
    item.mrp && item.mrp > item.price
      ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
      : 0;

  return (
    <div className={styles.card}>
      {/* Video area */}
      <div className={styles.videoWrap}>
        {item.video_url ? (
          <>
            <video
              className={styles.video}
              src={`${API_BASE}${item.video_url}`}
              loop
              muted
              playsInline
              poster=""
              ref={(el) => {
                if (!el) return;
                if (playing) el.play().catch(() => {});
                else el.pause();
              }}
            />
            {!playing && (
              <button
                className={styles.playBtn}
                onClick={() => setPlaying(true)}
                aria-label="Play video"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className={styles.videoPlaceholder}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="2" width="20" height="20" rx="3" />
              <polygon points="10,8 16,12 10,16" fill="currentColor" />
            </svg>
            <span>No video yet</span>
          </div>
        )}
        {discount > 0 && (
          <span className={styles.discount}>{discount}% OFF</span>
        )}
      </div>

      {/* Card body */}
      <div className={styles.body}>
        <span className={styles.category}>{item.category}</span>
        <h3 className={styles.name}>{item.name}</h3>
        {item.description && (
          <p className={styles.desc}>{item.description}</p>
        )}

        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatPrice(item.price)}</span>
            {item.mrp > item.price && (
              <span className={styles.mrp}>{formatPrice(item.mrp)}</span>
            )}
          </div>
          <button
            className={styles.addBtn}
            onClick={onAdd}
            disabled={item.stock === 0}
            aria-label="Add to cart"
          >
            <FiShoppingCart size={16} />
            {item.stock === 0 ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
