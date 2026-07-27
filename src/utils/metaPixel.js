/**
 * Meta Pixel helpers + cookie readers for Conversions API deduplication.
 */

export function metaEnabled() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

export function newEventId(prefix = "evt") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Facebook browser cookie set by Pixel */
export function getFbp() {
  return readCookie("_fbp");
}

/** Click id cookie when user arrived from a Meta ad */
export function getFbc() {
  return readCookie("_fbc");
}

export function metaCookies() {
  return {
    meta_fbp: getFbp() || undefined,
    meta_fbc: getFbc() || undefined,
  };
}

export function trackMeta(eventName, params = {}, eventId) {
  if (!metaEnabled()) return eventId || null;
  const id = eventId || newEventId(eventName);
  try {
    window.fbq("track", eventName, params || {}, { eventID: id });
  } catch {
    /* ignore */
  }
  return id;
}

export function trackViewContent(product) {
  if (!product) return null;
  return trackMeta("ViewContent", {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: "product",
    content_category: product.category || undefined,
    value: Number(product.price) || 0,
    currency: "INR",
  });
}

export function trackAddToCart(product, quantity = 1, price) {
  if (!product) return null;
  return trackMeta(
    "AddToCart",
    {
      content_ids: [String(product.id)],
      content_name: product.name,
      content_type: "product",
      value: Number(price ?? product.price) * quantity,
      currency: "INR",
      contents: [
        {
          id: String(product.id),
          quantity,
          item_price: Number(price ?? product.price) || 0,
        },
      ],
    }
  );
}

export function trackInitiateCheckout(cart) {
  const items = cart?.items || [];
  return trackMeta("InitiateCheckout", {
    content_ids: items.map((i) => String(i.product_id)),
    contents: items.map((i) => ({
      id: String(i.product_id),
      quantity: i.quantity,
      item_price: Number(i.price) || 0,
    })),
    num_items: cart?.total_items || items.reduce((s, i) => s + i.quantity, 0),
    value: Number(cart?.total_amount) || 0,
    currency: "INR",
    content_type: "product",
  });
}

export function trackPurchase({ orderId, total, items = [], eventId }) {
  const id = eventId || orderId || newEventId("Purchase");
  return trackMeta(
    "Purchase",
    {
      content_ids: items.map((i) => String(i.product_id || i.id)),
      contents: items.map((i) => ({
        id: String(i.product_id || i.id),
        quantity: i.quantity || i.qty || 1,
        item_price: Number(i.price) || 0,
      })),
      value: Number(total) || 0,
      currency: "INR",
      content_type: "product",
      order_id: orderId,
      num_items: items.reduce(
        (s, i) => s + (i.quantity || i.qty || 1),
        0
      ),
    },
    id
  );
}
