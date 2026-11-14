import type { Metadata } from "next";
import { CategoryListing, categoryMetadata } from "@/components/catalogue/listing";
import type { Category } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";

/*
 * Unfiltered first page only, so every category is prerendered (no searchParams). Filtered
 * and paginated views are rewritten to /catalogue-results/<slug>/ in next.config: see
 * components/catalogue/listing.tsx.
 */

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await sanityFetch<Category[]>({ query: CATEGORIES_QUERY, tags: ["productCategory"] });
  return (categories ?? []).filter((c) => c.slug).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return categoryMetadata((await params).slug, {});
}

export default async function ProductCategoryPage({ params }: Props) {
  return <CategoryListing slug={(await params).slug} searchParams={{}} />;
}
