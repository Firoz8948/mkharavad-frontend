import { API_BASE } from "@/utils/constants";
import { SITE_URL } from "@/utils/seo";

async function fetchAllProductSlugs() {
  const slugs = [];
  let page = 1;
  const pageSize = 100;

  try {
    while (page <= 20) {
      const res = await fetch(
        `${API_BASE}/products/?page=${page}&page_size=${pageSize}`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) break;
      const data = await res.json();
      const items = data.items || data || [];
      if (!Array.isArray(items) || items.length === 0) break;
      for (const p of items) {
        if (p?.slug) slugs.push(p.slug);
      }
      const totalPages = data.total_pages || data.pages;
      if (totalPages && page >= totalPages) break;
      if (items.length < pageSize) break;
      page += 1;
    }
  } catch {
    // Sitemap still returns static routes if API is unreachable at build time
  }

  return slugs;
}

/** @type {import('next').MetadataRoute.Sitemap} */
export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "daily" },
    { path: "/shop", priority: 0.9, changeFrequency: "daily" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const slugs = await fetchAllProductSlugs();
  const productRoutes = slugs.map((slug) => ({
    url: `${SITE_URL}/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
