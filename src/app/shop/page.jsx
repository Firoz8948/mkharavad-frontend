"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ShopBrowse from "@/pages-components/shop/ShopBrowse";
import { ProductGrid, SortBar } from "@/pages-components/shop";
import { VideoProducts, SubCategoryStrip } from "@/pages-components/home";
import { productService } from "@/services/productService";
import {
  getCategoryBySlug,
  getSubCategoryBySlug,
} from "@/services/categoryService";
import styles from "./shop.module.css";

function ShopContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "";
  const subcategorySlug = searchParams.get("subcategory") || "";
  const query = searchParams.get("q") || "";

  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, total_pages: 0 });
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("All Products");

  useEffect(() => {
    setPage(1);
  }, [categorySlug, subcategorySlug, query, sort]);

  useEffect(() => {
    let active = true;

    async function loadMeta() {
      if (query) {
        setTitle(`Search: "${query}"`);
        return;
      }
      if (subcategorySlug) {
        try {
          const res = await getSubCategoryBySlug(subcategorySlug);
          if (!active) return;
          setTitle(res.data.name || subcategorySlug);
        } catch {
          if (active) setTitle(subcategorySlug);
        }
        return;
      }
      if (categorySlug) {
        try {
          const res = await getCategoryBySlug(categorySlug);
          if (!active) return;
          setTitle(res.data.name);
        } catch {
          if (active) setTitle(categorySlug);
        }
        return;
      }
      setTitle("All Products");
    }

    loadMeta();
    return () => {
      active = false;
    };
  }, [categorySlug, subcategorySlug, query]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const params = { page, page_size: 12, sort };
    if (subcategorySlug) params.subcategory_slug = subcategorySlug;
    else if (categorySlug) params.category_slug = categorySlug;

    const fetcher = query
      ? productService.search(query, { page, page_size: 12 })
      : productService.getProducts(params);

    fetcher
      .then((res) => active && setData(res))
      .catch(() => active && setData({ items: [], total: 0, total_pages: 0 }))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [categorySlug, subcategorySlug, query, sort, page]);

  return (
    <>
      <div className={`container section ${styles.page}`}>
        <h1 className={styles.heading}>{title}</h1>

        {!query && (
          <Suspense fallback={null}>
            <ShopBrowse />
          </Suspense>
        )}

        <SortBar total={data.total} sort={sort} onSortChange={setSort} />
        <ProductGrid products={data.items} loading={loading} />

        {data.total_pages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {data.total_pages}
            </span>
            <button
              type="button"
              disabled={page >= data.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <VideoProducts />
      <SubCategoryStrip />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container section">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
