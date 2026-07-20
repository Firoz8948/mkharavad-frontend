"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CART_STORAGE_KEY } from "@/utils/constants";
import { buildCartKey, formatWeightGrams } from "@/utils/productVariants";

const CartContext = createContext(null);

const emptyCart = { items: [], total_items: 0, total_amount: 0 };

function loadStoredItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : parsed?.cart || [];
  } catch {
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function buildCart(items) {
  const enriched = items.map((item) => ({
    ...item,
    item_id: item.cart_key || item.product_id,
    subtotal: round(item.price * item.quantity),
  }));
  const total_items = enriched.reduce((sum, i) => sum + i.quantity, 0);
  const total_amount = round(enriched.reduce((sum, i) => sum + i.subtotal, 0));
  return { items: enriched, total_items, total_amount };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(emptyCart);
  const [ready, setReady] = useState(false);

  const persist = useCallback((items) => {
    saveItems(items);
    setCart(buildCart(items));
  }, []);

  useEffect(() => {
    persist(loadStoredItems());
    setReady(true);
  }, [persist]);

  const addToCart = (product, quantity = 1, options = {}) => {
    const {
      price = product.price,
      stock = product.stock,
      weightGrams = product.weight ? Number(product.weight) : null,
      variantInfo = null,
    } = options;

    if ((stock ?? 0) <= 0) {
      toast.error("This option is out of stock");
      return false;
    }

    const cartKey = buildCartKey(product.id, variantInfo);
    const displayName = variantInfo
      ? `${product.name} (${variantInfo.option_name})`
      : product.name;

    const weightLabel = weightGrams ? formatWeightGrams(weightGrams) : null;

    const items = loadStoredItems();
    const existing = items.find((i) => (i.cart_key || String(i.product_id)) === cartKey);

    if (existing) {
      const nextQty = existing.quantity + quantity;
      if (nextQty > stock) {
        toast.error(`Only ${stock} available`);
        return false;
      }
      existing.quantity = nextQty;
    } else {
      items.push({
        cart_key: cartKey,
        product_id: product.id,
        name: displayName,
        slug: product.slug,
        price,
        quantity,
        image: product.images?.[0] || null,
        weight: weightLabel,
        weight_grams: weightGrams,
        variant_info: variantInfo,
      });
    }

    persist(items);
    toast.success("Added to cart");
    return true;
  };

  const updateItem = (itemId, quantity) => {
    const items = loadStoredItems()
      .map((i) => {
        const key = i.cart_key || String(i.product_id);
        if (key !== String(itemId)) return i;
        return { ...i, quantity };
      })
      .filter((i) => i.quantity > 0);
    persist(items);
  };

  const removeItem = (itemId) => {
    const items = loadStoredItems().filter(
      (i) => (i.cart_key || String(i.product_id)) !== String(itemId)
    );
    persist(items);
    toast.success("Item removed");
  };

  const clearCart = () => {
    persist([]);
  };

  const value = {
    cart,
    loading: !ready,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    itemCount: cart.total_items,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}
