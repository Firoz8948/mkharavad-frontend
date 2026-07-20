"use client";

import Link from "next/link";

import Loader from "@/components/Loader/Loader";
import { CartItems, CartSummary } from "@/pages-components/cart";
import { useCart } from "@/hooks/useCart";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cart, loading } = useCart();

  if (loading) return <Loader fullScreen />;

  if (!cart.items.length) {
    return (
      <div className={`container section ${styles.empty}`}>
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <p className="text-muted">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" className={styles.link}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className={styles.heading}>Shopping Cart</h1>
      <div className={styles.layout}>
        <CartItems />
        <CartSummary />
      </div>
    </div>
  );
}
