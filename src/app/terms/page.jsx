import PolicyPage from "@/pages-components/policy/PolicyPage";
import { BRAND } from "@/utils/constants";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: `Terms and conditions for shopping at ${BRAND.name}. Rules for orders, payments, and use of our online store.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions" updated="August 2026">
      <p>
        Welcome to <strong>{BRAND.name}</strong>. By accessing our website or
        placing an order, you agree to these Terms &amp; Conditions. Our store
        is packaged and managed by <strong>{BRAND.packagedBy}</strong>.
      </p>

      <h2>Products</h2>
      <p>
        We sell cast iron and sheet iron cookware and related products. Product
        images and descriptions are provided for guidance. Slight variations in
        finish, colour, or weight may occur as products are metal/handmade in
        nature.
      </p>

      <h2>Orders &amp; pricing</h2>
      <ul>
        <li>All prices are listed in Indian Rupees (INR) unless stated otherwise.</li>
        <li>We reserve the right to correct pricing or stock errors.</li>
        <li>An order is confirmed only after successful payment or COD acceptance.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        We may offer prepaid online payment and Cash on Delivery (where
        available). Payment processing is handled by third-party providers. You
        agree to provide accurate billing and contact details.
      </p>

      <h2>Shipping &amp; delivery</h2>
      <p>
        Delivery timelines are estimates and may vary by location, courier
        delays, weather, or other factors beyond our control. Please see our{" "}
        <a href="/shipping-policy">Shipping Policy</a> for details.
      </p>

      <h2>Returns &amp; refunds</h2>
      <p>
        Returns and refunds are governed by our{" "}
        <a href="/refund-policy">Refund &amp; Returns Policy</a>.
      </p>

      <h2>User responsibilities</h2>
      <ul>
        <li>Provide correct delivery and contact information</li>
        <li>Do not misuse the website or attempt unauthorized access</li>
        <li>Use products safely as per cooking and care instructions</li>
      </ul>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {BRAND.packagedBy} /{" "}
        {BRAND.name} is not liable for indirect or consequential losses arising
        from use of the website or products, except where liability cannot be
        excluded under applicable law.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Disputes shall be subject
        to the jurisdiction of courts in Maharashtra, without affecting your
        rights under applicable consumer protection laws.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, contact{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> or WhatsApp{" "}
        {BRAND.whatsappDisplay}.
      </p>
    </PolicyPage>
  );
}
