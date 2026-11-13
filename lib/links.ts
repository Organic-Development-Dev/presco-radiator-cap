import type { LinkTarget } from "./types";

/** Public URL for a document, by type and slug. Mirrors the routes under app/(site). */
export function documentHref(type: string, slug?: string | null): string | null {
  if (type === "homePage") return "/";
  if (!slug) return null;
  switch (type) {
    case "page":
      return `/${slug}/`;
    case "post":
      return `/blog/${slug}/`;
    case "product":
      return `/product/${slug}/`;
    case "productCategory":
      return `/product-category/${slug}/`;
    case "applicationGuide":
      return `/applications/${slug}/`;
    case "localePage":
      return `/${slug}/`;
    default:
      return null;
  }
}

/** Resolve a link field (internal reference or URL) to an href. */
export function resolveHref(link: LinkTarget | null | undefined): string | null {
  if (!link) return null;
  const href = link.internal ? documentHref(link.internal._type, link.internal.slug) : link.url || null;
  if (!href || !link.anchor || /^(mailto|tel):/i.test(href)) return href;
  return `${href.split("#")[0]}#${link.anchor}`;
}

export const isExternalHref = (href: string) => /^https?:\/\//.test(href);
