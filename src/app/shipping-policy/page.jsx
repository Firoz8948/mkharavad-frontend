import PolicyPage from "@/pages-components/policy/PolicyPage";
import { BRAND, FREE_SHIPPING_THRESHOLD } from "@/utils/constants";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Shipping Policy",
  description: `Shipping policy for ${BRAND.name}. Delivery timelines, charges, and serviceable areas across India.`,
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping Policy" updated="August 2026">
      <p>
        <strong>{BRAND.name}</strong> (packaged and managed by{" "}
        <strong>{BRAND.packagedBy}</strong>) ships cast iron and sheet iron
        cookware across India through trusted courier partners.
      </p>

      <h2>Serviceable areas</h2>
      <p>
        We deliver to most pin codes in India. Enter your pincode at checkout to
        confirm delivery availability and applicable shipping charges.
      </p>

      <h2>Shipping charges</h2>
      <ul>
        <li>
          Shipping charges may vary by zone, order value, payment method
          (prepaid/COD), and weight of products.
        </li>
        <li>
          Free shipping may apply on eligible prepaid orders above ₹
          {FREE_SHIPPING_THRESHOLD}. Exact eligibility is shown at checkout.
        </li>
        <li>COD orders may attract a different shipping charge than prepaid orders.</li>
      </ul>

      <h2>Processing &amp; delivery time</h2>
      <ul>
        <li>Orders are usually processed within 1–3 business days.</li>
        <li>
          Estimated delivery is typically 3–10 business days after dispatch,
          depending on your location.
        </li>
        <li>
          Remote areas or courier disruptions may take longer. Tracking details
          are shared when available.
        </li>
      </ul>

      <h2>Order tracking</h2>
      <p>
        After dispatch, you can follow updates via SMS/WhatsApp/email from us or
        the courier. You may also check{" "}
        <a href="/orders">My Orders</a> after signing in.
      </p>

      <h2>Failed delivery / incorrect address</h2>
      <p>
        Please ensure your phone number and address are correct. If delivery
        fails due to an incorrect address, unreachable phone, or repeated
        customer unavailability, re-shipping charges may apply.
      </p>

      <h2>Damaged in transit</h2>
      <p>
        If a parcel arrives damaged, refuse delivery when possible and contact
        us within 48 hours with unboxing photos/videos so we can assist with
        replacement or resolution under our{" "}
        <a href="/refund-policy">Refund &amp; Returns Policy</a>.
      </p>

      <h2>Need help?</h2>
      <p>
        Call <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`}>{BRAND.phone}</a>,
        WhatsApp {BRAND.whatsappDisplay}, or email{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
      </p>
    </PolicyPage>
  );
}
