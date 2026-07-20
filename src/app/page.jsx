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
