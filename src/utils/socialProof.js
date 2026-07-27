/**
 * Deterministic fake rating/review counts for display (not real reviews).
 * Same product id always gets the same review count in 2000–2500.
 */
export function getProductSocialProof(id) {
  const n = Number(id) || 0;
  const reviews = 2000 + (Math.abs(n * 7919) % 501); // 2000..2500
  return {
    rating: 4.9,
    reviews,
    label: `${reviews.toLocaleString("en-IN")}+ Reviews`,
  };
}
