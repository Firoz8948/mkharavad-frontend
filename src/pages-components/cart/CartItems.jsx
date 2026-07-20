"use client";

import Link from "next/link";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import styles from "./CartItems.module.css";

export default function CartItems() {
  const { cart, updateItem, removeItem } = useCart();

  return (
    <div className={styles.list}>
      {cart.items.map((item) => (
        <div key={item.item_id} className={styles.item}>
          <Link href={`/product/${item.slug}`} className={styles.image}>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} />
            ) : (
              <span>🥜</span>
            )}
          </Link>

          <div className={styles.details}>
            <Link href={`/product/${item.slug}`} className={styles.name}>
              {item.name}
            </Link>
            {item.weight ? (
              <span className={styles.weight}>{item.weight}</span>
            ) : null}
            <span className={styles.price}>{formatPrice(item.price)}</span>
          </div>

          <div className={styles.qty}>
            <button
              onClick={() => updateItem(item.item_id, Math.max(1, item.quantity - 1))}
            >
              <FiMinus size={14} />
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => updateItem(item.item_id, item.quantity + 1)}>
              <FiPlus size={14} />
            </button>
          </div>

          <span className={styles.subtotal}>{formatPrice(item.subtotal)}</span>

          <button
            className={styles.remove}
            onClick={() => removeItem(item.item_id)}
            aria-label="Remove"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
