import { Suspense } from "react";

import LoginRedirect from "./LoginRedirect";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginRedirect />
    </Suspense>
  );
}
