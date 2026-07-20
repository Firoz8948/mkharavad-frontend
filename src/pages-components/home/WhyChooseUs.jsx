import { FiAward, FiPackage, FiThumbsUp, FiTruck } from "react-icons/fi";

import styles from "./WhyChooseUs.module.css";

const FEATURES = [
  { icon: FiAward, title: "Premium Quality", text: "Reliable iron cookware selected for strength, finish, and everyday performance." },
  { icon: FiTruck, title: "Fast Delivery", text: "Quick and safe doorstep delivery across India." },
  { icon: FiPackage, title: "Securely Packed", text: "Protective packaging helps your cookware arrive safely and ready to use." },
  { icon: FiThumbsUp, title: "100% Satisfaction", text: "Loved by thousands of happy, repeat customers." },
];

export default function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">Cookware made to perform, service you can trust</p>

        <div className={styles.scrollWrap}>
          <div className={styles.grid}>
            {FEATURES.map(({ icon: Icon, title, text }) => (
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
