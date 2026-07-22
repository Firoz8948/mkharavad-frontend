"use client";

import { useState } from "react";

import { mediaUrl } from "@/utils/mediaUrl";
import styles from "./ProductImages.module.css";

export default function ProductImages({ images = [], name }) {
  const [active, setActive] = useState(0);
  const resolved = (images || []).map((img) => mediaUrl(img));
  const hasImages = resolved.length > 0;

  return (
    <div className={styles.wrap}>
      {resolved.length > 1 && (
        <div className={styles.thumbs}>
          {resolved.map((img, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.thumb} ${i === active ? styles.activeThumb : ""}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${name} ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      <div className={styles.main}>
        {hasImages ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolved[active]} alt={name} />
        ) : (
          <div className={styles.placeholder}>🥜</div>
        )}
      </div>
    </div>
  );
}
