import { ContactForm, ContactHero, ContactInfo, ContactMap } from "@/pages-components/contact";
import { pageMetadata } from "@/utils/seo";
import styles from "./contact.module.css";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact M Kharavad Company in Virar West, Palghar. Call +91 9167607442 or WhatsApp for wholesale & retail cast iron cookware orders across India.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <div className="container section">
        <div className={styles.grid}>
          <div className={styles.infoCol}>
            <ContactInfo />
          </div>
          <div className={styles.formCol}>
            <ContactForm />
          </div>
        </div>
      </div>
      <ContactMap />
    </>
  );
}
