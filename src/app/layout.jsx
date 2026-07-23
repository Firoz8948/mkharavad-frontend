import "@/styles/globals.css";

import AppToaster from "@/components/AppToaster/AppToaster";
import JsonLd from "@/components/JsonLd/JsonLd";
import SiteChrome from "@/components/SiteChrome/SiteChrome";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ASSETS, BRAND } from "@/utils/constants";
import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  socialImages,
  websiteJsonLd,
} from "@/utils/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - ${BRAND.tagline}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "cast iron cookware",
    "iron tawa",
    "cast iron kadhai",
    "sheet iron cookware",
    "M Kharavad",
    "Mohan Kharavad",
    "buy cast iron online India",
    "wholesale iron cookware",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ${BRAND.tagline}`,
    description: DEFAULT_DESCRIPTION,
    images: socialImages(OG_IMAGE),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - ${BRAND.tagline}`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: ASSETS.icon, type: "image/svg+xml" }],
    shortcut: ASSETS.icon,
    apple: ASSETS.icon,
  },
  category: "shopping",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AuthProvider>
          <CartProvider>
            <AppToaster />
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
