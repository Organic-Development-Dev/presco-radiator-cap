import type { NextConfig } from "next";
import { createClient } from "@sanity/client";
import { toNextRedirects, type RedirectDoc } from "./lib/redirects";

/**
 * Redirects managed in Sanity ("Redirects" in the Studio). Read at build time so they cost nothing
 * per request; a Sanity webhook calls the Vercel deploy hook when one changes (see README).
 */
async function sanityRedirects() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];
  try {
    const docs = await createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-11-01",
      useCdn: false,
      perspective: "published",
    }).fetch<RedirectDoc[]>(
      `*[_type == "redirect" && defined(from)]{ from, permanent, url, "internal": internal->{ _type, "slug": coalesce(slug.current, language) } }`,
    );
    return toNextRedirects(docs);
  } catch (err) {
    // Don't fail the whole build if Sanity is briefly unreachable, but make it loud.
    console.warn("\n⚠ Could not load redirects from Sanity — building without them.\n", err);
    return [];
  }
}

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
    return [
      { source: "/:path*", headers: securityHeaders },
      // The service worker must never be cached by the browser/CDN, or updates won't reach visitors.
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old WordPress / starter routes
      { source: "/index.php/:path*", destination: "/:path*", permanent: true },
      { source: "/blog", destination: "/news/", permanent: true },
      { source: "/shop", destination: "/products/", permanent: true },
      { source: "/product-tag/:path*", destination: "/products/", permanent: true },
      ...(await sanityRedirects()),
    ];
  },
};

export default nextConfig;
