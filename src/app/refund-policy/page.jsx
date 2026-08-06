import PolicyPage from "@/pages-components/policy/PolicyPage";
import { BRAND } from "@/utils/constants";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Refund & Returns Policy",
  description: `Refund, return, and cancellation policy for ${BRAND.name}. How to request returns for damaged or incorrect products.`,
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <PolicyPage title="Refund & Returns Policy" updated="August 2026">
      <p>
        At <strong>{BRAND.name}</strong> (packaged and managed by{" "}
        <strong>{BRAND.packagedBy}</strong>), we want you to receive products in
        good condition. Please read this policy before requesting a return,
        replacement, cancellation, or refund.
      </p>

      <h2>Cancellation</h2>
      <ul>
        <li>
          You may request cancellation before the order is shipped by contacting
          us as soon as possible.
        </li>
        <li>
          Once an order is shipped or out for delivery, cancellation may not be
          possible.
        </li>
        <li>
          For prepaid orders cancelled before dispatch, refunds are initiated to
          the original payment method after confirmation.
        </li>
      </ul>

      <h2>Eligible returns / replacements</h2>
      <p>We may accept return or replacement requests for:</p>
      <ul>
        <li>Wrong product delivered</li>
        <li>Manufacturing defect</li>
        <li>Significant damage during transit (with proof)</li>
      </ul>

      <h2>Non-returnable cases</h2>
      <ul>
        <li>Change of mind / dislike of colour or finish after use</li>
        <li>Products used, washed, seasoned, or damaged by customer misuse</li>
        <li>Minor natural variations in cast/sheet iron finish or colour</li>
        <li>Requests raised after the allowed reporting window without valid reason</li>
      </ul>

      <h2>How to raise a request</h2>
      <ol>
        <li>Contact us within <strong>48 hours of delivery</strong>.</li>
        <li>
          Share your order ID, issue details, and clear photos/videos of the
          product and packaging.
        </li>
        <li>Our team will review and confirm the next steps.</li>
      </ol>
      <p>
        WhatsApp: {BRAND.whatsappDisplay} · Phone: {BRAND.phone} · Email:{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
      </p>

      <h2>Refund process</h2>
      <ul>
        <li>
          Approved refunds for prepaid orders are usually initiated within 5–7
          business days after approval and product QC (if return pickup is
          required).
        </li>
        <li>
          Bank/UPI timelines may take additional 5–10 business days to reflect
          the credit.
        </li>
        <li>
          For COD orders, refund/replacement is processed as agreed with our
          support team (replacement is preferred where possible).
        </li>
      </ul>

      <h2>Return shipping</h2>
      <p>
        If the issue is our fault (wrong/damaged/defective item), return pickup
        or return shipping support will be arranged by us. If the return is not
        eligible, return shipping costs may be borne by the customer.
      </p>
    </PolicyPage>
  );
}
