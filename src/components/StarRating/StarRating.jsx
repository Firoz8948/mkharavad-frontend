/** Five filled stars — uses unicode escapes so source encoding never breaks. */
export const STAR_ROW = "\u2605\u2605\u2605\u2605\u2605";

export default function StarRating({
  className = "",
  ratingClassName = "",
  reviewsClassName = "",
  proof,
  showRating = true,
  showReviews = true,
}) {
  if (!proof) return null;
  return (
    <div className={className} aria-label={`${proof.rating} stars`}>
      <span className={ratingClassName} aria-hidden>
        {STAR_ROW}
      </span>
      {showRating ? <span>{proof.ratingLabel || `(${proof.rating})`}</span> : null}
      {showReviews ? <span className={reviewsClassName}>{proof.label}</span> : null}
    </div>
  );
}
