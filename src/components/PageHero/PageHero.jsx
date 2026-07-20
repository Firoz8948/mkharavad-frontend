import styles from "./PageHero.module.css";

export default function PageHero({ title, children }) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.accentBar} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.rule} aria-hidden="true" />
          {children ? <p className={styles.subtitle}>{children}</p> : null}
        </div>
      </div>
    </section>
  );
}
