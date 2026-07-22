"use client";

import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";

import { useCart } from "@/hooks/useCart";
import { calcDiscount, formatPrice } from "@/utils/formatPrice";
import { mediaUrl } from "@/utils/mediaUrl";
import { getProductListingInfo } from "@/utils/productVariants";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const image = mediaUrl(product.images?.[0]);
  const listing = getProductListingInfo(product);
  const discount = calcDiscount(listing.mrp, listing.price);
  const outOfStock = listing.outOfStock;
  const categoryLabel = product.category || "";
  const categoryOnly = categoryLabel.includes(" / ")
    ? categoryLabel.split(" / ")[0]
    : categoryLabel;

  const handleAdd = (e) => {
    e.preventDefault();
    if (listing.hasVariants) return;
    if (!outOfStock) addToCart(product, 1);
  };

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>🥜</div>
        )}
        {discount > 0 && <span className={styles.discount}>{discount}% OFF</span>}
        {outOfStock && <span className={styles.soldOut}>Out of stock</span>}
      </div>

      <div className={styles.body}>
        {categoryOnly ? (
          <span className={styles.category}>{categoryOnly}</span>
        ) : null}
        <h3 className={styles.name}>{product.name}</h3>
        {product.weight ? (
          <span className={styles.weight}>
            {product.weight} {product.unit}
          </span>
        ) : null}

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.current}>
              {listing.hasVariants ? "From " : ""}
              {formatPrice(listing.price)}
            </span>
            {listing.mrp && listing.mrp > listing.price ? (
              <span className={styles.mrp}>{formatPrice(listing.mrp)}</span>
            ) : null}
          </div>
          <button
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={outOfStock || listing.hasVariants}
            aria-label={listing.hasVariants ? "Select options on product page" : "Add to cart"}
            title={listing.hasVariants ? "Select size on product page" : "Add to cart"}
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
