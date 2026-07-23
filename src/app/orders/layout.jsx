import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "My Orders",
  path: "/orders",
  noIndex: true,
});

export default function OrdersLayout({ children }) {
  return children;
}
