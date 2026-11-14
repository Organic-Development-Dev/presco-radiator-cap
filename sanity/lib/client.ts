import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Results are cached by Next and revalidated by tag on publish; reading from the API CDN
  // could re-cache a stale copy right after the webhook fires.
  useCdn: false,
  perspective: "published",
});
