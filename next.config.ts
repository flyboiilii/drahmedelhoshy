import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Lets app/global-not-found.tsx render the 404 for URLs outside both
    // language trees (there is no single root layout to inherit from).
    globalNotFound: true,
  },
};

export default nextConfig;
