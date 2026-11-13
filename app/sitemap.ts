import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/site";

type Entry = { slug: string; _updatedAt: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<{
    home: string | null;
    products: Entry[];
    categories: Entry[];
    posts: Entry[];
    pages: Entry[];
    guides: Entry[];
    locales: Entry[];
  }>({
    query: SITEMAP_QUERY,
    tags: ["homePage", "product", "productCategory", "post", "page", "applicationGuide", "localePage"],
  });
  const url = (path: string) => `${SITE_URL}/${path}${path ? "/" : ""}`;
  return [
    { url: url(""), ...(data.home ? { lastModified: data.home } : {}) },
    // Includes the pages behind /products/, /news/ and /contact-us/.
    ...data.pages.map((p) => ({ url: url(p.slug), lastModified: p._updatedAt })),
    ...data.categories.map((c) => ({ url: url(`product-category/${c.slug}`), lastModified: c._updatedAt })),
    ...data.products.map((p) => ({ url: url(`product/${p.slug}`), lastModified: p._updatedAt })),
    ...data.posts.map((p) => ({ url: url(`blog/${p.slug}`), lastModified: p._updatedAt })),
    ...data.guides.map((g) => ({ url: url(`applications/${g.slug}`), lastModified: g._updatedAt })),
    // Only language pages whose translation has been checked.
    ...data.locales.map((l) => ({ url: url(l.slug), lastModified: l._updatedAt })),
  ];
}
