"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { metafieldService } from "@/services/metafieldService";
import styles from "./ProductMetafields.module.css";

export default function ProductMetafields({ product }) {
  const [definitions, setDefinitions] = useState([]);
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    metafieldService
      .getDefinitions()
      .then(setDefinitions)
      .catch(() => {});
  }, []);

  const sections = useMemo(() => {
    const values = product?.metafields || {};
    return definitions
      .filter((def) => {
        const content = values[def.key];
        return content && String(content).trim();
      })
      .map((def) => ({
        key: def.key,
        name: def.name,
        content: values[def.key],
      }));
  }, [definitions, product?.metafields]);

  if (!sections.length) return null;

  const toggle = (key) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Product Details</h2>
      <div className={styles.accordion}>
        {sections.map((section) => {
          const isOpen = openKey === section.key;
          return (
            <div key={section.key} className={styles.item}>
              <button
                type="button"
                className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
                onClick={() => toggle(section.key)}
                aria-expanded={isOpen}
              >
                <span>{section.name}</span>
                <FiChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
              </button>
              {isOpen && (
                <div className={styles.panel}>
                  {String(section.content)
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
