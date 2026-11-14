import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListing, ProductsListing, categoryMetadata, productsMetadata } from "@/components/catalogue/listing";
import type { SearchParams } from "@/components/catalogue/params";

/*
 * Filtered / paginated catalogue views, rendered on demand. Not linked directly: next.config
 * rewrites /products/?… and /product-category/<slug>/?… here (when ?application=, ?type= or
 * ?page= is present), so the visitor keeps the original URL. Canonical and noindex come from
 * catalogueSeo and point at the public URLs, never at this path.
 */

type Props = {
  params: Promise<{ category?: string[] }>;
  searchParams: Promise<SearchParams>;
};

async function resolve({ params, searchParams }: Props) {
  const [{ category }, sp] = await Promise.all([params, searchParams]);
  if (category && category.length !== 1) notFound();
  return { slug: category?.[0] ?? null, sp };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, sp } = await resolve(props);
  return slug ? categoryMetadata(slug, sp) : productsMetadata(sp);
}

export default async function CatalogueResultsPage(props: Props) {
  const { slug, sp } = await resolve(props);
  return slug ? <CategoryListing slug={slug} searchParams={sp} /> : <ProductsListing searchParams={sp} />;
}
