import styles from "./StatsCard.module.css";

export default function StatsCard({ label, value, icon, accent = "var(--primary)" }) {
  return (
    <div className={styles.card}>
      <div
        className={styles.icon}
        style={{
          background: `color-mix(in srgb, ${accent} 10%, transparent)`,
          color: accent,
        }}
      >
        {icon}
      </div>
      <div>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
