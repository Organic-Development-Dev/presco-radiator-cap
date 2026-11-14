import type { NextConfig } from "next";
import { createClient } from "@sanity/client";
import { toNextRedirects, type RedirectDoc } from "./lib/redirects";
import { apiVersion, dataset, projectId } from "./sanity/env";

/**
 * Redirects managed in Sanity ("Redirects" in the Studio). Read at build time so they cost nothing
 * per request; a Sanity webhook calls the Vercel deploy hook when one changes (see README).
 */
async function sanityRedirects() {
  try {
    const docs = await createClient({
      projectId,
      dataset,
      apiVersion,
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
  // Baseline CSP: directives that can't break GTM, Turnstile, embeds or the Studio. A full
  // script-src allowlist (with nonces) is a separate, report-only-first job.
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; upgrade-insecure-requests",
  },
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
      // Old WordPress / WooCommerce URLs. Destinations end in "/" so each is a single hop.
      // Dated post permalinks (with or without /index.php); renamed slugs then hit the
      // blog route's previousSlugs redirect.
      { source: "/:prefix(index\\.php)?/:y(\\d{4})/:m(\\d{2})/:d(\\d{2})/:slug", destination: "/blog/:slug/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index.php/:path+", destination: "/:path+/", permanent: true },
      { source: "/blog", destination: "/news/", permanent: true },
      { source: "/feed/:path*", destination: "/news/", permanent: true },
      { source: "/category/:path*", destination: "/news/", permanent: true },
      { source: "/page/:n(\\d+)", destination: "/news/", permanent: true },
      { source: "/shop", destination: "/products/", permanent: true },
      { source: "/shop/page/:n(\\d+)", destination: "/products/?page=:n", permanent: true },
      { source: "/product-category/:slug/page/:n(\\d+)", destination: "/product-category/:slug/?page=:n", permanent: true },
      { source: "/product-tag/:path*", destination: "/products/", permanent: true },
      // WordPress search (/?s=...) -> site search
      { source: "/", has: [{ type: "query", key: "s", value: "(?<q>.+)" }], destination: "/search/?q=:q", permanent: true },
      ...(await sanityRedirects()),
    ];
  },
};

export default nextConfig;
