"use client";

import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

export default function ProductGrid({ products = [], loading }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`skeleton ${styles.skeletonCard}`} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className={styles.empty}>
        <span>🔍</span>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
