"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Loader from "@/components/Loader/Loader";
import { useAuth } from "@/hooks/useAuth";
import { orderService } from "@/services/orderService";
import { formatDate, formatPrice } from "@/utils/formatPrice";
import styles from "./orders.module.css";

function OrdersContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const highlightedId = searchParams.get("order");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    orderService
      .getMyOrders()
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) return <Loader fullScreen />;

  if (!isAuthenticated) {
    return (
      <div className={`container section ${styles.empty}`}>
        <span>🔐</span>
        <h2>Sign in to view orders</h2>
        <p className="text-muted">Mobile OTP login is required to place and track orders.</p>
        <Link href="/login?redirect=/orders" className={styles.shopLink}>
          Sign In
        </Link>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className={`container section ${styles.empty}`}>
        <span>📦</span>
        <h2>No orders yet</h2>
        <p className="text-muted">Your order history will appear here after checkout.</p>
        <Link href="/shop" className={styles.shopLink}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className={styles.heading}>My Orders</h1>
      {highlightedId && (
        <p className={styles.success}>Thank you! Your order has been placed successfully.</p>
      )}

      <div className={styles.list}>
        {orders.map((order) => {
          const isHighlighted = highlightedId === order.order_id;
          return (
            <div
              key={order.order_id}
              className={`${styles.card} ${isHighlighted ? styles.highlighted : ""}`}
            >
              <div className={styles.top}>
                <div>
                  <strong>#{order.order_id}</strong>
                  <span className={styles.date}>{formatDate(order.created_at)}</span>
                </div>
                <span className={styles.status}>{order.order_status}</span>
              </div>

              <div className={styles.items}>
                {(order.items || []).map((item, i) => (
                  <span key={i} className={styles.itemLine}>
                    {item.name} × {item.qty || item.quantity}
                  </span>
                ))}
              </div>

              <div className={styles.bottom}>
                <div className={styles.meta}>
                  <span>{formatPrice(order.total)}</span>
                  <span className={styles.payment}>
                    {order.payment_method?.toUpperCase()} · {order.payment_status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="container section">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
