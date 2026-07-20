"use client";

import { useEffect, useMemo, useState } from "react";
import { FiMinus, FiPlus, FiStar } from "react-icons/fi";

import Button from "@/components/Button/Button";
import { useCart } from "@/hooks/useCart";
import { calcDiscount, formatPrice } from "@/utils/formatPrice";
import {
  formatWeightGrams,
  getVariantOptions,
  parseWeightGrams,
} from "@/utils/productVariants";
import styles from "./ProductInfo.module.css";

function resolveOptionWeight(option) {
  if (option.weight && option.weight > 0) return option.weight;
  return parseWeightGrams(option.name);
}

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const variantData = useMemo(() => getVariantOptions(product), [product]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const options = variantData?.options || [];
  const selectedOption = useMemo(() => {
    if (!options.length) return null;
    const found = options.find((o) => o.id === selectedOptionId);
    if (found) return found;
    const inStock = options.find((o) => (o.stock ?? 0) > 0);
    return inStock || options[0];
  }, [options, selectedOptionId]);

  useEffect(() => {
    if (selectedOption?.id) {
      setSelectedOptionId(selectedOption.id);
    }
  }, [selectedOption?.id]);

  const displayPrice = selectedOption?.price ?? product.price;
  const displayMrp = selectedOption?.mrp ?? product.mrp;
  const displayStock = selectedOption ? (selectedOption.stock ?? 0) : (product.stock ?? 0);
  const weightGrams = selectedOption
    ? resolveOptionWeight(selectedOption)
    : product.weight
      ? Number(product.weight)
      : null;

  const discount = calcDiscount(displayMrp, displayPrice);
  const outOfStock = displayStock <= 0;

  const handleAdd = async () => {
    setAdding(true);
    const variantInfo = selectedOption
      ? {
          variant_name: variantData.variantName,
          option_name: selectedOption.name,
          option_id: selectedOption.id,
          weight_grams: weightGrams,
        }
      : null;

    addToCart(product, qty, {
      price: displayPrice,
      mrp: displayMrp,
      stock: displayStock,
      weightGrams,
      variantInfo,
    });
    setAdding(false);
  };

  return (
    <div className={styles.info}>
      <span className={styles.category}>{product.category}</span>
      <h1 className={styles.name}>{product.name}</h1>

      <div className={styles.rating}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar key={i} fill="var(--color-accent)" color="var(--color-accent)" size={15} />
        ))}
        <span>(120 reviews)</span>
      </div>

      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(displayPrice)}</span>
        {displayMrp && displayMrp > displayPrice ? (
          <>
            <span className={styles.mrp}>{formatPrice(displayMrp)}</span>
            <span className={styles.save}>{discount}% off</span>
          </>
        ) : null}
      </div>

      {variantData && (
        <div className={styles.variants}>
          <span className={styles.variantLabel}>{variantData.variantName}</span>
          <div className={styles.variantOptions}>
            {options.map((opt) => {
              const optStock = opt.stock ?? 0;
              const isSelected = selectedOption?.id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.variantBtn} ${isSelected ? styles.variantBtnActive : ""} ${optStock <= 0 ? styles.variantBtnDisabled : ""}`}
                  onClick={() => setSelectedOptionId(opt.id)}
                  disabled={optStock <= 0}
                >
                  {opt.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {weightGrams ? (
        <p className={styles.weight}>
          Pack weight: {formatWeightGrams(weightGrams)}
          <span className={styles.weightNote}> (used for shipping)</span>
        </p>
      ) : product.weight ? (
        <p className={styles.weight}>
          Pack size: {product.weight} {product.unit}
        </p>
      ) : null}

      <p className={styles.description}>
        {product.description ||
          "Premium iron cookware designed for reliable everyday cooking."}
      </p>

      <div className={styles.stock}>
        {outOfStock ? (
          <span className={styles.out}>Out of Stock</span>
        ) : (
          <span className={styles.in}>In Stock ({displayStock} available)</span>
        )}
      </div>

      {!outOfStock && (
        <div className={styles.actions}>
          <div className={styles.qty}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <FiMinus />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(displayStock, q + 1))}>
              <FiPlus />
            </button>
          </div>
          <Button size="lg" loading={adding} onClick={handleAdd}>
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
}
