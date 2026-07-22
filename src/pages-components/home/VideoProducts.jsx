"use client";

import { useEffect, useRef, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { mediaUrl } from "@/utils/mediaUrl";
import styles from "./VideoProducts.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1"}/video-products`;

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

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
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const isMobile = useIsMobile(768);
  const [hovered, setHovered] = useState(false);

  const discount =
    item.mrp && item.mrp > item.price
      ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
      : 0;

  // Mobile: autoplay only while the card is mostly on screen
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!isMobile || !video || !card || !item.video_url) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 0.55, 0.75, 1], root: null, rootMargin: "0px" }
    );

    observer.observe(card);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [isMobile, item.video_url]);

  // Desktop: play on hover
  useEffect(() => {
    const video = videoRef.current;
    if (isMobile || !video || !item.video_url) return;

    if (hovered) {
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek errors */
      }
    }
  }, [hovered, isMobile, item.video_url]);

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      <div className={styles.videoWrap}>
        {item.video_url ? (
          <video
            ref={videoRef}
            className={styles.video}
            src={mediaUrl(item.video_url, API_BASE)}
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={item.name}
          />
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
        {!isMobile && item.video_url && !hovered && (
          <div className={styles.playHint} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        )}
        {discount > 0 && (
          <span className={styles.discount}>{discount}% OFF</span>
        )}
      </div>

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
