"use client";

import { formatDate, formatPrice } from "@/utils/formatPrice";
import styles from "./PaymentTable.module.css";

export default function PaymentTable({ payments = [] }) {
  if (!payments.length) {
    return <p className="text-muted">No payments found.</p>;
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Order</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td className={styles.mono}>{p.razorpay_payment_id || p.id}</td>
              <td className={styles.mono}>{p.order_id}</td>
              <td>{formatPrice(p.amount)}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    p.status === "paid" ? styles.paid : ""
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td>{formatDate(p.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
