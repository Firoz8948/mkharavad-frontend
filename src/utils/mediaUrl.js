/**
 * Resolve a media URL stored in the database.
 * Supports full Bunny CDN URLs, legacy /uploads/ paths, and local assets.
 */
export function mediaUrl(path, apiBase) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/assets")) return path;
  const base = apiBase || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${base}${path}`;
}
