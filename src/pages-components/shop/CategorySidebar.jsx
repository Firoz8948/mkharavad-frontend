"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getCategories } from "@/services/categoryService";
import styles from "./CategorySidebar.module.css";

export default function CategorySidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIds, setOpenIds] = useState(() => new Set());
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeSub = searchParams.get("subcategory") || "";

  useEffect(() => {
    getCategories()
      .then((res) => {
        const list = res.data || [];
        setCategories(list);
        const match = list.find((c) => c.slug === activeCategory);
        if (match) setOpenIds(new Set([match.id]));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const pushParams = (next) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  };

  const handleCategory = (cat) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(cat.id)) next.delete(cat.id);
      else next.add(cat.id);
      return next;
    });
    pushParams({ category: cat.slug, subcategory: "" });
  };

  const handleSub = (cat, sub) => {
    pushParams({ category: cat.slug, subcategory: sub.slug });
  };

  return (
    <aside className={styles.sidebar} aria-label="Categories">
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>Categories</h3>
      </div>

      {loading ? (
        <div className={styles.skeletons}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : (
        <nav className={styles.catList}>
          <button
            type="button"
            className={`${styles.catItem} ${!activeCategory && !activeSub ? styles.catActive : ""}`}
            onClick={() => pushParams({ category: "", subcategory: "" })}
          >
            View All
          </button>

          {categories.map((cat) => {
            const open = openIds.has(cat.id) || activeCategory === cat.slug;
            const subs = cat.subcategories || [];
            return (
              <div key={cat.id} className={styles.catGroup}>
                <button
                  type="button"
                  className={`${styles.catItem} ${
                    activeCategory === cat.slug && !activeSub ? styles.catActive : ""
                  }`}
                  onClick={() => handleCategory(cat)}
                >
                  <span>{cat.name}</span>
                  {subs.length > 0 && (
                    <span className={styles.chevron}>{open ? "▾" : "▸"}</span>
                  )}
                </button>
                {open &&
                  subs.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      className={`${styles.subItem} ${
                        activeSub === sub.slug ? styles.catActive : ""
                      }`}
                      onClick={() => handleSub(cat, sub)}
                    >
                      {sub.name}
                    </button>
                  ))}
              </div>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
