import { AboutHero, OurStory, TeamSection } from "@/pages-components/about";

export const metadata = {
  title: "About Us | M Kharavad Company",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <TeamSection />
    </>
  );
}
