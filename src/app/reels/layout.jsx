import { SITE_NAME, SITE_URL } from "@/utils/seo";

export const metadata = {
  title: `Reels | ${SITE_NAME}`,
  description: `Watch ${SITE_NAME} products in action — swipe through video reels and shop instantly.`,
  alternates: { canonical: `${SITE_URL}/reels` },
};

export default function ReelsLayout({ children }) {
  return children;
}
