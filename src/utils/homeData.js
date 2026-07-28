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

/** Server-side banner fetch for LCP (HTML-discoverable first slide). */
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

export function cdnOrigin() {
  const host =
    process.env.NEXT_PUBLIC_BUNNY_CDN_HOST || "mkharavad-media.b-cdn.net";
  return `https://${host}`;
}

export function apiOrigin() {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "https://api.mkharavad.com";
  }
}
