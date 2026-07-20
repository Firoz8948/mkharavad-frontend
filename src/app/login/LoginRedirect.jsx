"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get("redirect") || "/";
    const url = new URL(redirect, window.location.origin);
    url.searchParams.set("signin", "1");
    router.replace(url.pathname + url.search);
  }, [router, searchParams]);

  return null;
}
