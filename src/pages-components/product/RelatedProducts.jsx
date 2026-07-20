"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard/ProductCard";
import { productService } from "@/services/productService";
import styles from "./RelatedProducts.module.css";

export default function RelatedProducts({ category, currentId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;
    let active = true;
    productService
      .getByCategory(category, { page: 1, page_size: 5 })
      .then((res) => {
        if (!active) return;
        setProducts((res.items || []).filter((p) => p.id !== currentId).slice(0, 4));
      })
      .catch(() => active && setProducts([]));
    return () => {
      active = false;
    };
  }, [category, currentId]);

  if (!products.length) return null;

  return (
    <section className={styles.wrap}>
      <h2>Related Products</h2>
      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
