"use client";

import { useEffect, useState } from "react";

import { mediaUrl } from "@/utils/mediaUrl";
import styles from "./ProductVideos.module.css";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1"}/video-products`;

export default function ProductVideos({ productId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(API_ENDPOINT)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const all = Array.isArray(data) ? data : [];
        const linked = productId
          ? all.filter(
              (v) =>
                v.is_active !== false &&
                String(v.product_id) === String(productId)
            )
          : [];
        // Prefer videos linked to this product; otherwise show a few active ones
        setItems(
          linked.length
            ? linked.slice(0, 4)
            : all.filter((v) => v.is_active !== false && v.video_url).slice(0, 3)
        );
      })
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [productId]);

  if (loading || !items.length) return null;

  return (
    <section className={styles.wrap}>
      <div className="container">
        <h2 className={styles.title}>See it in action</h2>
        <p className={styles.sub}>Watch how our cookware performs in real kitchens</p>
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={styles.card}>
              <video
                className={styles.video}
                src={mediaUrl(item.video_url)}
                controls
                playsInline
                preload="metadata"
              />
              {item.name ? <p className={styles.caption}>{item.name}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
