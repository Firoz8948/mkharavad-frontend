"use client";

import { FiStar } from "react-icons/fi";

import styles from "./ProductReviews.module.css";

const SAMPLE = [
  { name: "Meera J.", rating: 5, text: "Absolutely fresh and tasty. Will order again!" },
  { name: "Karan S.", rating: 4, text: "Good quality, nicely packed. Delivery was on time." },
];

export default function ProductReviews() {
  return (
    <section className={styles.wrap}>
      <h2>Customer Reviews</h2>
      <div className={styles.list}>
        {SAMPLE.map((r) => (
          <div key={r.name} className={styles.review}>
            <div className={styles.head}>
              <span className={styles.avatar}>{r.name.charAt(0)}</span>
              <div>
                <strong>{r.name}</strong>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      size={13}
                      fill={i < r.rating ? "var(--color-accent)" : "none"}
                      color="var(--color-accent)"
                    />
                  ))}
                </div>
              </div>
            </div>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
