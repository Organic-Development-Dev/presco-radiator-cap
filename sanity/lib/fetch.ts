import "server-only";
import type { ClientReturn, QueryParams } from "next-sanity";
import { client } from "./client";

/**
 * Cached Sanity fetch. Results stay cached until a Sanity publish webhook
 * calls /api/revalidate, which revalidates the matching tags.
 *
 * Tag convention: the document `_type` (e.g. "product"), plus "sanity" for everything.
 * In development nothing is cached, so Studio edits show up on refresh (there's no webhook locally).
 */
const DEV = process.env.NODE_ENV === "development";

/**
 * The result type is inferred from the query: `npm run typegen` generates a type for every
 * `defineQuery` in sanity/lib/queries.ts (sanity.types.ts) and registers it by query text.
 */
export async function sanityFetch<const Q extends string>({
  query,
  params = {},
  tags,
}: {
  query: Q;
  params?: QueryParams;
  tags: string[];
}): Promise<ClientReturn<Q, unknown>> {
  return client.fetch(
    query,
    params,
    DEV ? { cache: "no-store", useCdn: false } : { cache: "force-cache", next: { tags: ["sanity", ...tags] } },
  );
}
