export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

export const BRAND = {
  name: "M Kharavad Company",
  tagline: "Premium Quality Iron Cookware",
  phone: "+91 9167607442",
  whatsapp: "919167607442",
  whatsappDisplay: "+91 91676 07442",
  email: "Mohanenterprises2132@gmail.com",
  address:
    "Shop no 01 Roshan palace ayppa mandir pp Marg virar west Palghar Mumbai Maharashtra 401303",
  packagedBy: "Mohan Enterprises",
  hours: "Daily: 9:00 AM - 8:00 PM",
  mapsUrl: "https://maps.app.goo.gl/3SN6ZqUP2k3YWDMBA",
  instagram: "https://www.instagram.com/",
};

export const ASSETS = {
  logo: "/assets/images/logo/logo.svg",
  icon: "/assets/images/logo/icon.svg",
  heroVideo: "/assets/videos/hero.mp4",
  heroBanner: "/assets/images/banners/herobanner.webp",
  aboutStory: "/assets/images/banners/about.webp",
  owner: "/assets/images/banners/owner.jpeg",
  images: {
    banners: "/assets/images/banners",
    products: "/assets/images/products",
    icons: "/assets/images/icons",
    logo: "/assets/images/logo",
  },
  videos: "/assets/videos",
};

export const CATEGORIES = [
  {
    name: "Tawas",
    slug: "tawas",
    image: "tawa.webp",
    imageHover: "tawa-hover.webp",
  },
  {
    name: "Kadhai",
    slug: "kadhai",
    image: "kadhai.webp",
    imageHover: "kadhai-hover.webp",
  },
  { name: "Skillets", slug: "skillets" },
  { name: "Utensils", slug: "utensils" },
  { name: "Cast Iron Sets", slug: "cast-iron-sets" },
];

export const ORDER_STATUS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const FREE_SHIPPING_THRESHOLD = 999;
export const FLAT_SHIPPING_CHARGE = 49;

export const TOKEN_COOKIE = "access_token";
export const CART_STORAGE_KEY = "mkharavad_cart";
export const LAST_ORDER_KEY = "mkharavad_last_order";
