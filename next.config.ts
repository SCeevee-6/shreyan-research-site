import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static: every page is prerendered. The security headers (CSP, HSTS, frame and referrer
  // policies) are set by the host in vercel.json, since a static export cannot set headers itself.
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
