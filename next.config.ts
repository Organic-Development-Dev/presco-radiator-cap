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

/*
 * Full Content-Security-Policy, sent REPORT-ONLY for now: violations are logged via
 * /api/csp-report/ (Vercel logs, "CSP violation") but nothing is blocked. Once the logs are
 * quiet (e.g. after checking any Google Tag Manager tags), rename the header to
 * Content-Security-Policy to enforce it.
 *
 * Scripts use an allowlist with 'unsafe-inline' rather than nonces: nonces need a fresh value
 * per request, which would make every page dynamic and lose static prerendering. The allowlist
 * still blocks scripts from any host not listed. The Studio (/studio) is excluded: it needs
 * its own, looser policy.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "font-src 'self' data:",
  "media-src 'self' https://cdn.sanity.io",
  "connect-src 'self' https://cdn.sanity.io https://challenges.cloudflare.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://www.googletagmanager.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "report-uri /api/csp-report/",
].join("; ");

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
      { source: "/((?!studio).*)", headers: [{ key: "Content-Security-Policy-Report-Only", value: csp }] },
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
  async rewrites() {
    // Catalogue listings: the unfiltered first page is static; any filter or page parameter
    // is served by the on-demand /catalogue-results/ route, keeping the visitor's URL.
    // beforeFiles, so these win over the static /products/ and /product-category/[slug]/ pages.
    const params = ["application", "type", "page"]; // = FILTER_PARAMS in components/catalogue/params.ts
    return {
      beforeFiles: params.flatMap((key) => [
        { source: "/products/", has: [{ type: "query" as const, key }], destination: "/catalogue-results/" },
        {
          source: "/product-category/:slug/",
          has: [{ type: "query" as const, key }],
          destination: "/catalogue-results/:slug/",
        },
      ]),
      afterFiles: [],
      fallback: [],
    };
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
