import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production" || !process.env.VERCEL_ENV;
  return {
    rules: isProduction
      ? [{ userAgent: "*", allow: "/", disallow: ["/studio/", "/api/"] }]
      : [{ userAgent: "*", disallow: "/" }], // keep preview deployments out of search results
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
