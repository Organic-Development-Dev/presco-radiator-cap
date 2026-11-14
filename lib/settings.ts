import "server-only";
import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings } from "./types";

/**
 * Site settings (contact details, menus, SEO defaults). Tagged with the linkable
 * document types too, because menu links resolve to those documents' slugs.
 * Errors are swallowed so the site chrome still renders if Sanity is unreachable.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    return await sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings", "page", "post", "product", "productCategory", "homePage"],
    });
  } catch (error) {
    console.error("Failed to load site settings", error);
    return null;
  }
});
