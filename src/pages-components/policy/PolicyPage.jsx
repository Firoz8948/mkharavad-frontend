import Link from "next/link";

import { BRAND } from "@/utils/constants";
import styles from "./PolicyPage.module.css";

const WHATSAPP_URL = `https://wa.me/${BRAND.whatsapp}`;

const POLICY_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/refund-policy", label: "Refund & Returns" },
];

export default function PolicyPage({ title, updated, children }) {
  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Policies</p>
          <h1 className={styles.title}>{title}</h1>
          {updated ? <p className={styles.updated}>Last updated: {updated}</p> : null}
        </header>

        <nav className={styles.nav} aria-label="Policy pages">
          {POLICY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <article className={styles.content}>{children}</article>

        <aside className={styles.contactBox}>
          <h2>Business &amp; Contact</h2>
          <p>
            <strong>Packaged and Managed by</strong> {BRAND.packagedBy}
          </p>
          <p>{BRAND.address}</p>
          <p>
            Phone:{" "}
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`}>{BRAND.phone}</a>
          </p>
          <p>
            WhatsApp:{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              {BRAND.whatsappDisplay}
            </a>
          </p>
          <p>
            Email: <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </p>
        </aside>
      </div>
    </div>
  );
}
