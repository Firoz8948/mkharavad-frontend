"use client";

import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";

import { useCart } from "@/hooks/useCart";
import styles from "./FloatingCartBar.module.css";
import { formatPrice } from "@/utils/formatPrice";
import { mediaUrl } from "@/utils/mediaUrl";

export default function FloatingCartBar() {
  const { cart, loading } = useCart();

  if (loading || !cart.items.length) return null;

  const first = cart.items[0];
  const more = cart.total_items - first.quantity;
  const thumb = mediaUrl(first.image);

  return (
    <div className={styles.bar} role="status">
      <div className={styles.inner}>
        <div className={styles.preview}>
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" className={styles.thumb} />
          ) : (
            <div className={styles.thumbPlaceholder} />
          )}
          <div className={styles.meta}>
            <strong>
              {cart.total_items} item{cart.total_items === 1 ? "" : "s"} ·{" "}
              {formatPrice(cart.total_amount)}
            </strong>
            <span>
              {first.name}
              {more > 0 ? ` +${more} more` : ""}
            </span>
          </div>
        </div>
        <Link href="/cart" className={styles.cta}>
          View Cart
        </Link>
      </div>
    </div>
  );
}
