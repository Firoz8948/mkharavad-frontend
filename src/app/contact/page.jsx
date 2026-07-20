import { ContactForm, ContactHero, ContactInfo, ContactMap } from "@/pages-components/contact";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact Us | M Kharavad Company",
};

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
