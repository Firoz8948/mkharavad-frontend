"use client";

import { CATEGORIES } from "@/utils/constants";
import styles from "./FilterSidebar.module.css";

export default function FilterSidebar({ activeCategory, onCategoryChange }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.block}>
        <h4>Categories</h4>
        <ul className={styles.list}>
          <li>
            <button
              className={!activeCategory ? styles.active : ""}
              onClick={() => onCategoryChange("")}
            >
              All Products
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <button
                className={activeCategory === cat.slug ? styles.active : ""}
                onClick={() => onCategoryChange(cat.slug)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
