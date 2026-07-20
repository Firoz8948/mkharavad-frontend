"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { FREE_SHIPPING_THRESHOLD } from "@/utils/constants";
import styles from "./FaqSection.module.css";

const FAQS = [
  {
    question: "What types of iron sheets do you offer?",
    answer:
      "We offer a wide range of iron sheets including galvanized, corrugated, and cold-rolled sheets suitable for roofing, construction, and various industrial applications.",
  },
  {
    question: "Are your cast iron products durable?",
    answer:
      "Yes, our cast iron products are manufactured using high-quality raw materials to ensure maximum durability, superior strength, and long-lasting performance even in tough conditions.",
  },
  {
    question: "Do you offer free shipping?",
    answer: `Free shipping is available on orders above ₹\${FREE_SHIPPING_THRESHOLD}. For smaller orders, a flat shipping charge applies at checkout due to the heavy nature of our products.`,
  },
  {
    question: "How do I maintain cast iron products to prevent rusting?",
    answer:
      "To prevent rusting, it is best to keep cast iron products dry and lightly coat them with oil or an anti-rust primer when not in active use. Regular maintenance significantly extends their lifespan.",
  },
  {
    question: "Can I order iron sheets in custom sizes?",
    answer:
      "Absolutely. We provide custom sizing and cutting services for bulk orders to meet your specific project requirements. Reach out through our Contact page for customized quotes.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Quick answers about our products and orders</p>

        <div className={styles.list}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className={`${styles.item} ${isOpen ? styles.open : ""}`}>
                <button
                  type="button"
                  className={styles.question}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <FiChevronDown className={styles.chevron} aria-hidden />
                </button>
                <div className={styles.answerWrap}>
                  <p className={styles.answer}>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
