import "server-only";
import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY } from "@/sanity/lib/queries";

/** A `page` document by slug. Also used by /products/, /news/ and /contact-us/ for their title, intro and SEO. */
export const getPage = cache((slug: string) =>
  sanityFetch({ query: PAGE_QUERY, params: { slug }, tags: ["page", `page:${slug}`] }),
);
