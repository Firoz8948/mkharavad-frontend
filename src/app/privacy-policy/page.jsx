import PolicyPage from "@/pages-components/policy/PolicyPage";
import { BRAND } from "@/utils/constants";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${BRAND.name}. How Mohan Enterprises collects, uses, and protects your information when you shop with us.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy" updated="August 2026">
      <p>
        This Privacy Policy explains how <strong>{BRAND.name}</strong>{" "}
        (packaged and managed by <strong>{BRAND.packagedBy}</strong>) collects,
        uses, and protects your personal information when you use our website
        and place orders.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Name, phone number, email address, and delivery address</li>
        <li>Order details, payment status, and communication history</li>
        <li>Device/browser information and basic website usage data</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To process, ship, and support your orders</li>
        <li>To contact you about order updates via call, SMS, WhatsApp, or email</li>
        <li>To improve our website, products, and customer service</li>
        <li>To prevent fraud and comply with legal requirements</li>
      </ul>

      <h2>Sharing of information</h2>
      <p>
        We may share necessary details with trusted partners such as payment
        gateways, courier/logistics providers, and IT service providers only to
        fulfill your order or operate our store. We do not sell your personal
        information.
      </p>

      <h2>Data security</h2>
      <p>
        We take reasonable measures to protect your information. However, no
        method of online transmission or storage is completely secure.
      </p>

      <h2>Cookies &amp; analytics</h2>
      <p>
        Our website may use cookies and similar technologies (including
        advertising/analytics tools) to remember preferences and measure
        performance. You can control cookies through your browser settings.
      </p>

      <h2>Your choices</h2>
      <p>
        You may request correction or deletion of your account-related
        information by contacting us. We may retain certain records when
        required for legal, tax, or order history purposes.
      </p>

      <h2>Contact for privacy requests</h2>
      <p>
        Email us at <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> or call{" "}
        <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`}>{BRAND.phone}</a>.
      </p>
    </PolicyPage>
  );
}
