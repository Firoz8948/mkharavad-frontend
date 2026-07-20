"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return children;
  }

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="site-main">{children}</main>
      <Footer />
      <div className="mobile-bottom-nav-spacer" aria-hidden="true" />
    </>
  );
}
