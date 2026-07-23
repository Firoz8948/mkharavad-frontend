import { Suspense } from "react";

import LoginRedirect from "./LoginRedirect";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Sign In",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginRedirect />
    </Suspense>
  );
}
