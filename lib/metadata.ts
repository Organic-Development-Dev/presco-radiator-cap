import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import type { Seo } from "./types";
import { SITE_NAME } from "./site";

/** Build page metadata from a document's title + SEO object. */
export function buildMetadata({
  title,
  seo,
  path,
  fallbackDescription,
}: {
  title: string;
  seo?: Seo;
  path: string;
  fallbackDescription?: string | null;
}): Metadata {
  const description = seo?.description || fallbackDescription || undefined;
  const image = seo?.image?.asset ? urlFor(seo.image).width(1200).height(630).fit("crop").url() : undefined;
  return {
    title: seo?.title || title,
    description,
    alternates: { canonical: path },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: seo?.title || title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
  };
}
