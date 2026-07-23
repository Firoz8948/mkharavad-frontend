import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Cart",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }) {
  return children;
}
