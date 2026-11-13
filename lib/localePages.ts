import "server-only";
import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { LOCALE_PAGES_QUERY } from "@/sanity/lib/queries";
import type { LocalePage } from "./types";

/** All language pages (checked or not). Cached per request. */
export const getLocalePages = cache(async (): Promise<LocalePage[]> => {
  try {
    return (await sanityFetch<LocalePage[]>({ query: LOCALE_PAGES_QUERY, tags: ["localePage"] })) ?? [];
  } catch (error) {
    console.error("Failed to load language pages", error);
    return [];
  }
});

/**
 * hreflang alternates linking the English homepage and the *checked* language pages to each other.
 * Unchecked translations are left out so search engines never send people to them.
 */
export function languageAlternates(pages: LocalePage[]): Record<string, string> | undefined {
  const checked = pages.filter((p) => p.checked);
  if (!checked.length) return undefined;
  return {
    en: "/",
    ...Object.fromEntries(checked.map((p) => [p.language, `/${p.language}/`])),
    "x-default": "/",
  };
}
