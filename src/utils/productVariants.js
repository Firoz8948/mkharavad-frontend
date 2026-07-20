/**
 * Parse weight in grams from option names like "500g", "1Kg", "2 kg".
 */
export function parseWeightGrams(name) {
  if (!name || typeof name !== "string") return null;
  const match = name.trim().toLowerCase().match(/(\d+(?:\.\d+)?)\s*(kg|k|g|gm|gram|grams)?/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const unit = match[2] || "g";
  if (unit.startsWith("k")) return Math.round(value * 1000);
  return Math.round(value);
}

export function formatWeightGrams(grams) {
  if (!grams || grams <= 0) return null;
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(2).replace(/\.?0+$/, "")} kg`;
  }
  return `${grams} g`;
}

export function getVariantOptions(product) {
  const group = product?.variants?.[0];
  if (!group?.options?.length) return null;
  return {
    variantName: group.name,
    options: group.options,
  };
}

export function getProductListingInfo(product) {
  const variantData = getVariantOptions(product);
  if (variantData) {
    const { options } = variantData;
    const inStock = options.some((o) => (o.stock ?? 0) > 0);
    const prices = options.map((o) => o.price).filter((p) => p > 0);
    return {
      hasVariants: true,
      outOfStock: !inStock,
      price: prices.length ? Math.min(...prices) : product.price,
      mrp: product.mrp,
    };
  }
  return {
    hasVariants: false,
    outOfStock: (product.stock ?? 0) <= 0,
    price: product.price,
    mrp: product.mrp,
  };
}

export function buildCartKey(productId, variantInfo) {
  if (!variantInfo?.option_name) return String(productId);
  return `${productId}:${variantInfo.variant_name}:${variantInfo.option_name}`;
}
