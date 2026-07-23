import MarqueeBanner from "@/pages-components/home/MarqueeBanner";

import {
  CategorySection,
  FaqSection,
  FeaturedProducts,
  HeroSection,
  SubCategoryStrip,
  Testimonials,
  VideoProducts,
  WhyChooseUs,
} from "@/pages-components/home";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Premium Cast Iron & Sheet Iron Cookware",
  description:
    "M Kharavad Company — premium cast iron cookware by Mohan Kharavad since 2012. Shop tawas, kadhai, skillets & utensils online. Free shipping across India.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <CategorySection />
      <FeaturedProducts />
      <WhyChooseUs />
      <VideoProducts />
      <Testimonials />
      <FaqSection />
      <SubCategoryStrip />
    </>
  );
}
