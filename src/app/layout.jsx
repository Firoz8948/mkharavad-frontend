import { Montserrat, Roboto } from "next/font/google";

import "@/styles/globals.css";

import AppToaster from "@/components/AppToaster/AppToaster";
import SiteChrome from "@/components/SiteChrome/SiteChrome";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ASSETS, BRAND } from "@/utils/constants";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: `${BRAND.name} - ${BRAND.tagline}`,
  description:
    "Shop premium iron cookware from M Kharavad Company, including tawas, kadhais, skillets, utensils, and cast iron sets.",
  icons: {
    icon: [{ url: ASSETS.icon, type: "image/svg+xml" }],
    shortcut: ASSETS.icon,
    apple: ASSETS.icon,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${roboto.variable}`}>
      <body>
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
