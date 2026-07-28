import MarqueeBanner from "@/pages-components/home/MarqueeBanner";
import LazySection from "@/components/LazySection/LazySection";

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
import { fetchBanners } from "@/utils/homeData";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Premium Cast Iron & Sheet Iron Cookware",
  description:
    "M Kharavad Company — premium cast iron cookware by Mohan Kharavad since 2012. Shop tawas, kadhai, skillets & utensils online. Free shipping across India.",
  path: "/",
});

export default async function HomePage() {
  const [desktopSlides, mobileSlides] = await Promise.all([
    fetchBanners("desktop"),
    fetchBanners("mobile"),
  ]);

  return (
    <>
      <HeroSection
        initialDesktop={desktopSlides}
        initialMobile={mobileSlides}
      />
      <MarqueeBanner />
      <CategorySection />

      <LazySection minHeight={520}>
        <FeaturedProducts />
      </LazySection>
      <LazySection minHeight={280}>
        <WhyChooseUs />
      </LazySection>
      <LazySection minHeight={520}>
        <VideoProducts />
      </LazySection>
      <LazySection minHeight={320}>
        <Testimonials />
      </LazySection>
      <LazySection minHeight={360}>
        <FaqSection />
      </LazySection>
      <LazySection minHeight={280}>
        <SubCategoryStrip />
      </LazySection>
    </>
  );
}
