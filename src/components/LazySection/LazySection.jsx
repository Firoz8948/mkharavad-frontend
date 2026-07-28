"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mount children only when near the viewport to cut initial JS/network work.
 * Reserves minHeight until mounted to limit CLS.
 */
export default function LazySection({
  children,
  minHeight = 360,
  rootMargin = "280px 0px",
  className = "",
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, show]);

  return (
    <div
      ref={ref}
      className={className}
      style={show ? undefined : { minHeight }}
    >
      {show ? children : null}
    </div>
  );
}
