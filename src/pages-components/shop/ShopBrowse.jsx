"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";

import { getCategories } from "@/services/categoryService";
import styles from "./ShopBrowse.module.css";

/**
 * Selection is exclusive:
 * - All → no filter
 * - Category → only ?category= (all products under that category’s subcategories)
 * - Subcategory → only ?subcategory= (products of that subcategory)
 * Never set both params together.
 */
export default function ShopBrowse() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeSub = searchParams.get("subcategory") || "";

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allSubs = categories.flatMap((cat) =>
    (cat.subcategories || []).map((sub) => ({
      ...sub,
      parentSlug: cat.slug,
    }))
  );

  const goToShop = ({ category = "", subcategory = "" } = {}) => {
    const params = new URLSearchParams();
    // Keep search query if present, but filters are exclusive
    const q = searchParams.get("q");
    if (q) params.set("q", q);

    if (subcategory) {
      params.set("subcategory", subcategory);
    } else if (category) {
      params.set("category", category);
    }

    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  };

  if (loading) {
    return (
      <div className={styles.wrap}>
        <div className={styles.catSkeleton} />
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <nav className={`${styles.nav} ${styles.navDesktop}`} aria-label="Categories">
        <button
          type="button"
          className={`${styles.allBtn} ${!activeCategory && !activeSub ? styles.active : ""}`}
          onClick={() => goToShop()}
        >
          All
        </button>

        <div className={styles.catColumns}>
          {categories.map((cat) => {
            const subs = cat.subcategories || [];
            const catActive = activeCategory === cat.slug && !activeSub;
            return (
              <div key={cat.id} className={styles.catColumn}>
                <button
                  type="button"
                  className={`${styles.catHead} ${catActive ? styles.active : ""}`}
                  onClick={() => goToShop({ category: cat.slug })}
                >
                  <span>{cat.name}</span>
                  <FiChevronDown
                    size={16}
                    className={styles.chevron}
                    aria-hidden
                  />
                </button>

                <div className={styles.subList}>
                  {subs.length === 0 ? (
                    <span className={styles.emptySub}>No subcategories</span>
                  ) : (
                    subs.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        className={`${styles.subItem} ${
                          activeSub === sub.slug ? styles.subActive : ""
                        }`}
                        onClick={() => goToShop({ subcategory: sub.slug })}
                      >
                        {sub.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      <nav className={styles.navMobile} aria-label="Categories">
        <div className={styles.mobileCatRow}>
          <button
            type="button"
            className={`${styles.chip} ${styles.chipCat} ${
              !activeCategory && !activeSub ? styles.chipActive : ""
            }`}
            onClick={() => goToShop()}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.chip} ${styles.chipCat} ${
                activeCategory === cat.slug && !activeSub ? styles.chipActive : ""
              }`}
              onClick={() => goToShop({ category: cat.slug })}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {allSubs.length > 0 && (
          <div className={styles.mobileSubRow}>
            {allSubs.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className={`${styles.chip} ${styles.chipSub} ${
                  activeSub === sub.slug ? styles.chipActive : ""
                }`}
                onClick={() => goToShop({ subcategory: sub.slug })}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
