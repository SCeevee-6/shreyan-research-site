"use client";

import { usePathname } from "next/navigation";

/** Ink settling: each new page fades in over 120 ms. Keyed on the path so it runs on every navigation. */
export function PageFade({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div key={path} className="ink-settle">
      {children}
    </div>
  );
}
