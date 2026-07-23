import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Checkout",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({ children }) {
  return children;
}
