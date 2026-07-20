import { FiGlobe, FiHome, FiPackage, FiUsers } from "react-icons/fi";

import styles from "./TeamSection.module.css";

const PILLARS = [
  {
    icon: FiPackage,
    title: "Many Categories",
    text: "Tawas, kadhai, utensils, skillets, and cast iron sets — one trusted range for every kitchen need.",
  },
  {
    icon: FiUsers,
    title: "Wholesale Partners",
    text: "We supply wholesalers and retailers with consistent quality, dependable stock, and fair pricing.",
  },
  {
    icon: FiHome,
    title: "Offline Store",
    text: "Visit us in Virar West, Palghar — see the cookware in person and get guidance from our team.",
  },
  {
    icon: FiGlobe,
    title: "Online Ordering",
    text: "Shop from home with secure checkout, fast shipping, COD, and easy returns across India.",
  },
];

export default function TeamSection() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">How We Serve</h2>
        <p className="section-subtitle">
          Wholesale, retail, online & offline — cookware you can trust
        </p>

        <div className={styles.scrollWrap}>
          <div className={styles.grid}>
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <div key={title} className={styles.card}>
                <div className={styles.iconWrap}>
                  <Icon size={26} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
