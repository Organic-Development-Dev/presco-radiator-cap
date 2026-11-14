export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-01";

/*
 * Project ID and dataset are public identifiers (they ship in every browser bundle), so they
 * have defaults: a deploy never fails just because these two env vars weren't set.
 * Override them with NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET (e.g. a staging dataset).
 * Tokens and secrets have no defaults and must come from the environment.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hwnpm4a8";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
