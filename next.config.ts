import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // The old site used trailing slashes; keep them so existing URLs and backlinks still match.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Old WordPress / starter routes
      { source: "/index.php/:path*", destination: "/:path*", permanent: true },
      { source: "/blog", destination: "/news/", permanent: true },
      { source: "/shop", destination: "/products/", permanent: true },
      { source: "/product-tag/:path*", destination: "/products/", permanent: true },
    ];
  },
};

export default nextConfig;
