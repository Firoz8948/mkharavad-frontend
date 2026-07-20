import { formatDate, formatPrice } from "@/utils/formatPrice";
import styles from "./RecentOrders.module.css";

export default function RecentOrders({ orders = [] }) {
  return (
    <div className={styles.wrap}>
      <h3>Recent Orders</h3>
      {orders.length === 0 ? (
        <p className="text-muted">No recent orders.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.order_id || o.order_number}</td>
                <td>{formatDate(o.created_at)}</td>
                <td>
                  <span className={styles.status}>{o.order_status}</span>
                </td>
                <td>{formatPrice(o.total ?? o.total_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
