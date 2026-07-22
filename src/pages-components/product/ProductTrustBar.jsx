import styles from "./ProductTrustBar.module.css";

export default function ProductTrustBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.item}>
        <strong>Trusted by 10 lakh+ families</strong>
        <span>Cookware that finds a place in homes across India</span>
      </div>
      <div className={styles.divider} aria-hidden />
      <div className={styles.item}>
        <strong>50,000+ five-star ratings</strong>
        <span>Loved for durability, heat, and everyday ease</span>
      </div>
    </div>
  );
}
