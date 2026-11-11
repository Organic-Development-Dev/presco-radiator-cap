import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/site";

type Entry = { slug: string; _updatedAt: string };

/** Pages with their own route (not served by the generic [slug] page). */
const STATIC_ROUTES = ["", "products", "news", "contact-us"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<{ products: Entry[]; categories: Entry[]; posts: Entry[]; pages: Entry[] }>({
    query: SITEMAP_QUERY,
    tags: ["product", "productCategory", "post", "page"],
  });
  const url = (path: string) => `${SITE_URL}/${path}${path ? "/" : ""}`;
  return [
    ...STATIC_ROUTES.map((path) => ({ url: url(path) })),
    ...data.pages
      .filter((p) => p.slug !== "home" && !STATIC_ROUTES.includes(p.slug))
      .map((p) => ({ url: url(p.slug), lastModified: p._updatedAt })),
    ...data.categories.map((c) => ({ url: url(`product-category/${c.slug}`), lastModified: c._updatedAt })),
    ...data.products.map((p) => ({ url: url(`product/${p.slug}`), lastModified: p._updatedAt })),
    ...data.posts.map((p) => ({ url: url(`blog/${p.slug}`), lastModified: p._updatedAt })),
  ];
}
