"use client";

import { FiStar } from "react-icons/fi";
import styles from "./Testimonials.module.css";

const REVIEWS_ROW1 = [
  {
    name: "Rajesh Kumar",
    city: "Mumbai",
    rating: 5,
    text: "The iron sheets are incredibly sturdy. Perfect for our roofing project. Quality is top notch and delivery was fast!",
  },
  {
    name: "Sunita Patel",
    city: "Ahmedabad",
    rating: 5,
    text: "Best cast iron cookware I've ever used. The heat retention is amazing and food doesn't stick at all.",
  },
  {
    name: "Vikram Singh",
    city: "Delhi",
    rating: 5,
    text: "Ordered galvanized iron sheets in bulk for construction. Exceptional quality and great pricing for the quantity.",
  },
  {
    name: "Meena Joshi",
    city: "Pune",
    rating: 4,
    text: "The cast iron pan is heavy and solid. Heats evenly. My rotis come out perfectly every single time.",
  },
  {
    name: "Arjun Nair",
    city: "Kochi",
    rating: 5,
    text: "Iron sheets arrived on time, well packed. No dents or damage. Will definitely order again for the next phase.",
  },
  {
    name: "Priya Sharma",
    city: "Jaipur",
    rating: 5,
    text: "Superb cast iron tawa. Seasoned it once and it performs flawlessly. Worth every rupee spent on it.",
  },
];

function StarRating({ rating }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          fill={i < rating ? "var(--color-gold)" : "none"}
          color="var(--color-gold)"
          size={14}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className={styles.card}>
      <StarRating rating={review.rating} />
      <p className={styles.text}>&ldquo;{review.text}&rdquo;</p>
      <div className={styles.author}>
        <span className={styles.avatar}>{review.name.charAt(0)}</span>
        <div>
          <strong>{review.name}</strong>
          <span>{review.city}</span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-subtitle">Real reviews from real customers</p>
      </div>

      <div className={styles.marqueeOuter}>
        <div className={`${styles.marqueeTrack} ${styles.marqueeLeft}`}>
          <div className={styles.marqueeGroup}>
            {REVIEWS_ROW1.map((r) => (
              <ReviewCard key={`a-${r.name}`} review={r} />
            ))}
          </div>
          <div className={styles.marqueeGroup} aria-hidden>
            {REVIEWS_ROW1.map((r) => (
              <ReviewCard key={`b-${r.name}`} review={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
