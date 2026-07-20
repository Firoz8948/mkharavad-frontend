"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useCart } from "@/hooks/useCart";
import { quoteShipping, validatePromoCode } from "@/services/bannerService";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_CHARGE } from "@/utils/constants";
import { formatPrice } from "@/utils/formatPrice";
import styles from "./OrderSummary.module.css";

export default function OrderSummary({
  promo,
  onPromoChange,
  pincode = "",
  state = "",
  paymentMethod = "razorpay",
}) {
  const { cart } = useCart();
  const subtotal = cart.total_amount;

  const [codeInput, setCodeInput] = useState(promo?.code || "");
  const [applying, setApplying] = useState(false);
  const [zoneQuote, setZoneQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const pin = String(pincode || "").replace(/\D/g, "");
    const hasLocation = (state && state.trim()) || pin.length === 6;

    if (!hasLocation || subtotal <= 0) {
      setZoneQuote(null);
      return;
    }

    const timer = setTimeout(async () => {
      setQuoting(true);
      try {
        const res = await quoteShipping({
          subtotal,
          state: state || null,
          pincode: pin.length === 6 ? pin : null,
          payment_method: paymentMethod === "cod" ? "cod" : "prepaid",
        });
        if (!cancelled) setZoneQuote(res.data);
      } catch {
        if (!cancelled) setZoneQuote(null);
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pincode, state, subtotal, paymentMethod]);

  const fallbackShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal <= 0 ? 0 : FLAT_SHIPPING_CHARGE;
  const baseShipping =
    zoneQuote?.shipping_charge != null ? zoneQuote.shipping_charge : fallbackShipping;

  const shipping =
    promo?.shipping_charge != null ? promo.shipping_charge : baseShipping;
  const discount = promo?.discount_amount || 0;
  const total = Math.max(subtotal - discount, 0) + shipping;

  const handleApply = async () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) {
      toast.error("Enter a promo code");
      return;
    }
    setApplying(true);
    try {
      const res = await validatePromoCode({
        code,
        subtotal,
        shipping_charge: baseShipping,
      });
      onPromoChange?.(res.data);
      toast.success(res.data.message || "Promo applied");
    } catch (err) {
      onPromoChange?.(null);
      toast.error(
        err?.response?.data?.detail || err.message || "Invalid promo code"
      );
    } finally {
      setApplying(false);
    }
  };

  const handleRemove = () => {
    setCodeInput("");
    onPromoChange?.(null);
  };

  useEffect(() => {
    // Zone rate changed — clear applied promo so user re-applies against new shipping
    if (promo?.code) {
      onPromoChange?.(null);
      setCodeInput("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneQuote?.zone_id, zoneQuote?.rate]);

  return (
    <div className={styles.wrap}>
      <h3>Order Summary</h3>
      <div className={styles.items}>
        {cart.items.map((item) => (
          <div key={item.item_id} className={styles.item}>
            <span className={styles.name}>
              {item.name} <em>× {item.quantity}</em>
            </span>
            <span>{formatPrice(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className={styles.promoBox}>
        <label htmlFor="promo-code">Promo code</label>
        <div className={styles.promoRow}>
          <input
            id="promo-code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="FREESHIP"
            disabled={!!promo}
          />
          {promo ? (
            <button type="button" onClick={handleRemove}>
              Remove
            </button>
          ) : (
            <button type="button" onClick={handleApply} disabled={applying}>
              {applying ? "…" : "Apply"}
            </button>
          )}
        </div>
        {promo && (
          <p className={styles.promoOk}>
            Applied: {promo.action_label || promo.code}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className={styles.row}>
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      <div className={styles.row}>
        <span>Shipping</span>
        <span>
          {quoting
            ? "…"
            : shipping === 0
              ? "Free"
              : formatPrice(shipping)}
        </span>
      </div>
      {zoneQuote?.zone_name && !quoting && (
        <p className={styles.zoneNote}>
          Via {zoneQuote.zone_name}
          {zoneQuote.state ? ` · ${zoneQuote.state}` : ""}
        </p>
      )}
      {!zoneQuote && !quoting && !(state || String(pincode).length === 6) && (
        <p className={styles.zoneNote}>Enter pincode to see zone shipping</p>
      )}
      <div className={`${styles.row} ${styles.total}`}>
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
