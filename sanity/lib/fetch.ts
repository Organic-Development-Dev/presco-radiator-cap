import "server-only";
import type { QueryParams } from "next-sanity";
import { client } from "./client";

/**
 * Cached Sanity fetch. Results stay cached until a Sanity publish webhook
 * calls /api/revalidate, which revalidates the matching tags.
 *
 * Tag convention: the document `_type` (e.g. "product"), plus "sanity" for everything.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    cache: "force-cache",
    next: { tags: ["sanity", ...tags] },
  });
}
