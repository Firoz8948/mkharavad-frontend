"use client";

import Link from "next/link";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import { formatPrice } from "@/utils/formatPrice";
import styles from "./ProductTable.module.css";

export default function ProductTable({ products = [], onDelete }) {
  if (!products.length) {
    return <p className="text-muted">No products found. Add your first product.</p>;
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <div className={styles.product}>
                  <span className={styles.thumb}>
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} />
                    ) : (
                      "🥜"
                    )}
                  </span>
                  <span>{p.name}</span>
                </div>
              </td>
              <td>{p.category}</td>
              <td>{formatPrice(p.price)}</td>
              <td>{p.stock}</td>
              <td>
                <span className={p.is_active ? styles.active : styles.inactive}>
                  {p.is_active ? "Active" : "Hidden"}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <Link
                    href={`/admin/products/edit/${p.id}`}
                    className={styles.edit}
                    aria-label="Edit"
                  >
                    <FiEdit2 size={16} />
                  </Link>
                  <button
                    className={styles.delete}
                    onClick={() => onDelete(p.id)}
                    aria-label="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
