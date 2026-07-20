"use client";
import { useEffect, useState } from "react";
import { FiBox, FiDollarSign, FiPackage, FiTruck } from "react-icons/fi";

import { getDashboardStats } from "@/services/adminService";
import styles from "./dashboard.module.css";

const STAT_CARDS = [
  {
    key: "total_orders",
    label: "Total Orders",
    Icon: FiPackage,
    color: "var(--color-primary)",
    format: (v) => v?.toLocaleString(),
  },
  {
    key: "total_revenue",
    label: "Total Revenue",
    Icon: FiDollarSign,
    color: "var(--secondary)",
    format: (v) => `₹${v?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
  },
  {
    key: "total_products",
    label: "Total Products",
    Icon: FiBox,
    color: "var(--success)",
    format: (v) => v?.toLocaleString(),
  },
  {
    key: "total_shipped",
    label: "Shipped Orders",
    Icon: FiTruck,
    color: "var(--info)",
    format: (v) => v?.toLocaleString(),
  },
];

const STATUS_COLORS = {
  pending: "var(--warning)",
  confirmed: "var(--info)",
  processing: "var(--secondary)",
  shipped: "var(--success)",
  delivered: "var(--success)",
  cancelled: "var(--error)",
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className={styles.loader}>
      <div className={styles.spinner} />
      <p>Loading dashboard…</p>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dashboard</h2>
        <p className={styles.subtitle}>
          Welcome back! Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((card) => {
          const Icon = card.Icon;
          return (
          <div key={card.key} className={styles.statCard} style={{ "--accent": card.color }}>
            <div className={styles.statIcon}>
              <Icon className={styles.statIconSvg} aria-hidden />
            </div>
            <div className={styles.statBody}>
              <div className={styles.statValue}>
                {card.format(stats?.[card.key] ?? 0)}
              </div>
              <div className={styles.statLabel}>{card.label}</div>
            </div>
            <div className={styles.statGlow} />
          </div>
          );
        })}
      </div>

      <div className={styles.bottomGrid}>
        {/* Revenue Trend */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Revenue — Last 7 Days</h3>
          <div className={styles.chart}>
            {stats?.revenue_trend?.map((item, i) => {
              const max = Math.max(...(stats.revenue_trend.map((x) => x.revenue)), 1);
              const pct = (item.revenue / max) * 100;
              return (
                <div key={i} className={styles.barGroup}>
                  <div className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className={styles.barLabel}>{item.date}</span>
                  <span className={styles.barVal}>
                    ₹{item.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Orders</h3>
          <div className={styles.orderList}>
            {stats?.recent_orders?.length === 0 && (
              <p className={styles.empty}>No orders yet.</p>
            )}
            {stats?.recent_orders?.map((order) => (
              <div key={order.id} className={styles.orderRow}>
                <div className={styles.orderLeft}>
                  <span className={styles.orderId}>{order.order_id}</span>
                  <span className={styles.orderName}>
                    {order.customer?.name || "Guest"}
                  </span>
                </div>
                <div className={styles.orderRight}>
                  <span className={styles.orderAmt}>
                    ₹{order.total?.toLocaleString("en-IN")}
                  </span>
                  <span
                    className={styles.orderStatus}
                    style={{ background: `${STATUS_COLORS[order.order_status]}20`, color: STATUS_COLORS[order.order_status] }}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
