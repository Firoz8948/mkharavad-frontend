"use client";

import { FiCreditCard, FiDollarSign } from "react-icons/fi";

import Button from "@/components/Button/Button";
import styles from "./PaymentSection.module.css";

const METHODS = [
  {
    value: "razorpay",
    label: "Pay Online (Razorpay)",
    desc: "Cards, UPI, Netbanking & Wallets",
    icon: FiCreditCard,
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    icon: FiDollarSign,
  },
];

export default function PaymentSection({ method, onChange, onPlaceOrder, loading }) {
  return (
    <div className={styles.wrap}>
      <h3>Payment Method</h3>
      <div className={styles.options}>
        {METHODS.map(({ value, label, desc, icon: Icon }) => (
          <label
            key={value}
            className={`${styles.option} ${method === value ? styles.active : ""}`}
          >
            <input
              type="radio"
              name="payment"
              value={value}
              checked={method === value}
              onChange={() => onChange(value)}
            />
            <Icon size={22} />
            <div>
              <strong>{label}</strong>
              <span>{desc}</span>
            </div>
          </label>
        ))}
      </div>

      <Button fullWidth size="lg" loading={loading} onClick={onPlaceOrder}>
        Place Order
      </Button>
    </div>
  );
}
