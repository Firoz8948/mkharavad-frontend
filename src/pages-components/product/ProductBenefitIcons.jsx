import styles from "./ProductBenefitIcons.module.css";

const ICONS = [
  "https://mkharavad-media.b-cdn.net/Icons/toxin%20free.webp",
  "https://mkharavad-media.b-cdn.net/Icons/safe%20cooking.webp",
  "https://mkharavad-media.b-cdn.net/Icons/iron%20to%20food.webp",
  "https://mkharavad-media.b-cdn.net/Icons/non%20stick.webp",
  "https://mkharavad-media.b-cdn.net/Icons/tastier%20food.webp",
  "https://mkharavad-media.b-cdn.net/Icons/generations.webp",
];

export default function ProductBenefitIcons() {
  return (
    <div className={styles.row} aria-hidden>
      {ICONS.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" className={styles.icon} />
      ))}
    </div>
  );
}
