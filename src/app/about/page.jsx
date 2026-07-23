import { AboutHero, OurStory, TeamSection } from "@/pages-components/about";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Built by Mohan Kharavad in 2012 — M Kharavad Company makes premium cast iron cookware for wholesalers and households, sold online and offline across India.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <TeamSection />
    </>
  );
}
