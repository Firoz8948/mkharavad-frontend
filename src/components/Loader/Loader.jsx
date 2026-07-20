import styles from "./Loader.module.css";

export default function Loader({ fullScreen = false, label = "Loading..." }) {
  return (
    <div className={fullScreen ? styles.fullScreen : styles.inline}>
      <span className={styles.spinner} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
