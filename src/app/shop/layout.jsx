import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Shop Cast Iron Cookware",
  description:
    "Browse M Kharavad's full range of cast iron & sheet iron cookware — tawas, kadhai, skillets, utensils and sets. Wholesale & retail across India.",
  path: "/shop",
});

export default function ShopLayout({ children }) {
  return children;
}
