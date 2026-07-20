import Image from "next/image";

import { ASSETS, BRAND } from "@/utils/constants";

export default function Logo({ width, height, size = 40, className = "", priority = false }) {
  const h = height || size;
  const w = width || Math.round(h * 6.038);

  return (
    <Image
      src={ASSETS.logo}
      alt={BRAND.name}
      width={w}
      height={h}
      className={className}
      priority={priority}
    />
  );
}

