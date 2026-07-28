import { API_BASE, API_URL } from "@/utils/constants";

export function resolveMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/assets")) return url;
  return `${API_URL}${url}`;
}

export function mapBannerSlides(items) {
  return (items || [])
    .filter((s) => s.image_url || s.image)
    .map((s) => ({
      id: s.id,
      image: resolveMediaUrl(s.image_url || s.image),
      link_url: s.link_url || null,
    }));
}

/** Server-side banner fetch so LCP image URL is in the initial HTML. */
export async function fetchBanners(device) {
  try {
    const url = new URL(`${API_BASE}/banners/`);
    if (device) url.searchParams.set("device", device);
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.data || [];
    return mapBannerSlides(list);
  } catch {
    return [];
  }
}
