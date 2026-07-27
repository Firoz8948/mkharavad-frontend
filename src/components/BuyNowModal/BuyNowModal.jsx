"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button/Button";
import { useCart } from "@/hooks/useCart";
import styles from "./BuyNowModal.module.css";

/**
 * When Buy Now is clicked and cart already has other items,
 * ask: clear & buy this only, or keep cart and go to checkout.
 */
export default function BuyNowModal({ open, onClose, product, quantity = 1, options = {} }) {
  const router = useRouter();
  const { cart, addToCart, clearCart } = useCart();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Empty cart (or only this product) → add & go checkout without asking
  useEffect(() => {
    if (!open || !product) return;
    const others = cart.items.filter((i) => String(i.product_id) !== String(product.id)).length;
    if (others > 0) return;
    const ok = addToCart(product, quantity, options);
    if (ok) {
      onClose?.();
      router.push("/checkout");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id]);

  if (!open || !product) return null;

  const goCheckout = () => {
    onClose?.();
    router.push("/checkout");
  };

  const buyOnly = async () => {
    setBusy(true);
    clearCart();
    const ok = addToCart(product, quantity, options);
    setBusy(false);
    if (ok) goCheckout();
  };

  const addAndCheckout = () => {
    setBusy(true);
    const ok = addToCart(product, quantity, options);
    setBusy(false);
    if (ok) goCheckout();
  };

  const otherItems = cart.items.filter((i) => String(i.product_id) !== String(product.id)).length;
  if (otherItems === 0) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3>Items already in your cart</h3>
        <p>
          Your cart has {otherItems} other product{otherItems > 1 ? "s" : ""}. What would
          you like to do?
        </p>
        <div className={styles.actionsCol}>
          <Button onClick={buyOnly} loading={busy} fullWidth>
            Buy only this item
          </Button>
          <Button variant="outline" onClick={addAndCheckout} loading={busy} fullWidth>
            Keep cart & checkout all
          </Button>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function useBuyNow() {
  const [state, setState] = useState({ open: false, product: null, quantity: 1, options: {} });
  const openBuyNow = (product, quantity = 1, options = {}) => {
    setState({ open: true, product, quantity, options });
  };
  const closeBuyNow = () => setState((s) => ({ ...s, open: false }));
  return { ...state, openBuyNow, closeBuyNow };
}
