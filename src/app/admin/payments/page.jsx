"use client";
import { useEffect, useState } from "react";
import { getAdminPayments, refundAdminPayment } from "@/services/adminService";
import styles from "./payments.module.css";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(null);
  const LIMIT = 15;

  const load = () => {
    setLoading(true);
    getAdminPayments({ page, limit: LIMIT })
      .then((res) => {
        setPayments(res.data.payments);
        setTotal(res.data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleRefund = async (payment) => {
    if (!payment?.id || payment.status !== "paid") return;
    const ok = window.confirm(
      `Refund ₹${Number(payment.amount).toLocaleString("en-IN")} for payment ${payment.razorpay_payment_id || payment.id}?`
    );
    if (!ok) return;
    setRefunding(payment.id);
    try {
      await refundAdminPayment(payment.id, { reason: "Admin refund" });
      load();
      alert("Refund initiated successfully");
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || "Refund failed");
    } finally {
      setRefunding(null);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Payments</h2>
          <p className={styles.subtitle}>{total} payment records</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}><div className={styles.spinner} /></div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Razorpay Order ID</th>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.mono}>{p.razorpay_order_id || "—"}</td>
                    <td className={styles.mono}>{p.razorpay_payment_id || "—"}</td>
                    <td className={styles.amount}>
                      ₹{p.amount?.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${
                        p.status === "paid" ? styles.paid :
                        p.status === "failed" ? styles.failed :
                        p.status === "refunded" || p.status === "partially_refunded"
                          ? styles.failed
                          : styles.pending
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      }) : "—"}
                    </td>
                    <td>
                      {p.status === "paid" && p.razorpay_payment_id ? (
                        <button
                          type="button"
                          className={styles.refundBtn}
                          disabled={refunding === p.id}
                          onClick={() => handleRefund(p)}
                        >
                          {refunding === p.id ? "Refunding…" : "Refund"}
                        </button>
                      ) : (
                        <span className={styles.date}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>
                ← Prev
              </button>
              <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
              <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
