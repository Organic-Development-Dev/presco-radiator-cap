import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SITE_NAME } from "@/lib/site";

/** Web app manifest (served at /manifest.webmanifest and linked automatically). Name/description from Sanity. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  const name = settings?.siteName || SITE_NAME;
  return {
    id: "/",
    name,
    short_name: "Presco",
    description: settings?.defaultSeo?.description ?? undefined,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#445a8e",
    lang: "en-GB",
    dir: "ltr",
    categories: ["business", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    // Long-press shortcuts on the installed app icon.
    shortcuts: [
      { name: "Search products", url: "/search/", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Vehicle applications", url: "/applications/", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Contact us", url: "/contact-us/", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
