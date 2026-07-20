import Image from "next/image";
import Link from "next/link";

import { ASSETS, BRAND } from "@/utils/constants";
import styles from "./OurStory.module.css";

export default function OurStory() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.portraitCol}>
          <div className={styles.portraitFrame}>
            <span className={styles.yearBadge} aria-hidden="true">
              Est. 2012
            </span>
            <Image
              src={ASSETS.owner}
              alt="Founder of M Kharavad — Mohan Kharavad"
              width={720}
              height={900}
              sizes="(max-width: 900px) 100vw, 420px"
              className={styles.portrait}
              priority
            />
          </div>
          <div className={styles.portraitMeta}>
            <strong>Mohan Kharavad</strong>
            <span>Founder · M Kharavad</span>
          </div>
        </div>

        <div className={styles.content}>
          <p className="section-tag">Our Journey</p>
          <h2 className={styles.title}>
            From Mohan Enterprise to kitchens across India
          </h2>
          <p className={styles.lead}>
            In 2012, Mohan Enterprise established {BRAND.name} with a clear
            purpose — bring pure, durable cast iron cookware to every kitchen,
            without chemical coatings or shortcuts.
          </p>
          <p>
            What began as a focused manufacturing and trading vision has grown
            into a trusted name for tawas, kadhai, utensils, and cookware across
            multiple categories. We serve wholesalers who stock our range, and
            customers who cook with it every day — both in our storefront and
            through online orders.
          </p>
          <p>
            Every piece is chosen for strength, finish, and real kitchen
            performance. Whether you buy one pan or place a bulk order, the
            promise stays the same: toxin-free cooking, honest iron quality, and
            service you can rely on.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>2012</strong>
              <span>Year established</span>
            </div>
            <div className={styles.stat}>
              <strong>Multi-category</strong>
              <span>Cast iron range</span>
            </div>
            <div className={styles.stat}>
              <strong>B2B + B2C</strong>
              <span>Wholesale & retail</span>
            </div>
          </div>

          <div className={styles.ctaWrap}>
            <Link href="/shop" className={styles.cta}>
              Explore our products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
