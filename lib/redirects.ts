import { resolveHref } from "./links";
import type { LinkTarget } from "./types";

export type RedirectDoc = LinkTarget & { from?: string | null; permanent?: boolean | null };
export type NextRedirect = { source: string; destination: string; permanent: boolean };

/** Escape characters that next.config `source` patterns (path-to-regexp) treat as syntax. */
const escapeSource = (path: string) => path.replace(/[:()*+?{}[\]\\!]/g, "\\$&");

/**
 * Turn Sanity redirect documents into next.config redirects.
 * Folder-style paths match with and without the trailing slash; file paths (with an extension) as-is.
 * Entries without a target, or pointing at themselves, are dropped.
 */
export function toNextRedirects(docs: RedirectDoc[]): NextRedirect[] {
  const seen = new Set<string>();
  return docs.flatMap((doc) => {
    const from = doc.from?.trim();
    const destination = resolveHref(doc);
    if (!from?.startsWith("/") || !destination) return [];
    const base = from.replace(/\/+$/, "") || "/";
    if (destination.replace(/\/+$/, "") === base) return [];
    const isFile = /\.[a-z0-9]{2,5}$/i.test(base);
    const variants = isFile || base === "/" ? [base] : [base, `${base}/`];
    return variants
      .filter((v) => !seen.has(v.toLowerCase()) && seen.add(v.toLowerCase()))
      .map((v) => ({ source: escapeSource(v), destination, permanent: doc.permanent !== false }));
  });
}
