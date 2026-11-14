import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { getSiteSettings } from "./settings";
import { SITE_NAME } from "./site";
import { truncate } from "./text";
import type { SanityImage, Seo } from "./types";

type Options = {
  /** Page title; the root layout appends " | <site name>". */
  title: string;
  seo?: Seo;
  /** Canonical path, with trailing slash. */
  path: string;
  /** Used when the document has no SEO description (e.g. an excerpt or intro). */
  fallbackDescription?: string | null;
  /** Used when the document has no SEO share image (e.g. the main image). */
  fallbackImage?: SanityImage | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Force noindex (e.g. filtered listings), regardless of the document setting. */
  noIndex?: boolean;
  /** hreflang alternates, e.g. { en: "/", fr: "/fr/", "x-default": "/" } */
  languages?: Record<string, string>;
  /** Use the title as-is, without the site name suffix. */
  absoluteTitle?: boolean;
};

const shareImage = (image: SanityImage | null | undefined) =>
  image?.asset ? urlFor(image).width(1200).height(630).fit("crop").url() : undefined;

/**
 * Page metadata from a document's title + SEO object, falling back to the
 * site-wide defaults in Site settings for the description and share image.
 */
export async function buildMetadata(options: Options): Promise<Metadata> {
  const { title, seo, path, fallbackDescription, fallbackImage, type = "website" } = options;
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || SITE_NAME;
  const metaTitle = seo?.title || title;
  const description =
    truncate(seo?.description) || truncate(fallbackDescription) || truncate(settings?.defaultSeo?.description) || undefined;
  const image = shareImage(seo?.image) ?? shareImage(fallbackImage) ?? shareImage(settings?.defaultSeo?.image);
  const images = image ? [{ url: image, width: 1200, height: 630, alt: metaTitle }] : undefined;
  const noIndex = options.noIndex || seo?.noIndex;

  return {
    title: options.absoluteTitle ? { absolute: metaTitle } : metaTitle,
    description,
    alternates: { canonical: path, ...(options.languages ? { languages: options.languages } : {}) },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: metaTitle,
      description,
      url: path,
      siteName,
      locale: "en_GB",
      type,
      ...(type === "article" ? { publishedTime: options.publishedTime, modifiedTime: options.modifiedTime } : {}),
      images,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title: metaTitle, description, images: image ? [image] : undefined },
  };
}
