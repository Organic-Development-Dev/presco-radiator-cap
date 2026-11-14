import "server-only";
import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORY_QUERY } from "@/sanity/lib/queries";
import { CatalogueView } from "./CatalogueView";
import { loadCatalogue } from "./load-catalogue";
import { catalogueSeo, type SearchParams } from "./params";

/*
 * Rendering for the catalogue listings, shared by two kinds of route:
 * - /products/ and /product-category/[slug]/ render the unfiltered first page with no
 *   searchParams, so they're prerendered as static HTML (the indexable entry pages).
 * - Filtered or paginated URLs (?application=, ?type=, ?page=) are rewritten in next.config
 *   to /catalogue-results/[[...category]]/, which reads searchParams and renders on demand.
 *   The visitor's URL doesn't change.
 */

const PRODUCTS_SLUG = "products";
const PRODUCTS_PATH = `/${PRODUCTS_SLUG}/`;
const DEFAULT_PRODUCTS_TITLE = "Products & Solutions";

export const getCategory = cache((slug: string) =>
  sanityFetch({ query: CATEGORY_QUERY, params: { slug }, tags: ["productCategory"] }),
);

export async function productsMetadata(searchParams: SearchParams): Promise<Metadata> {
  const page = await getPage(PRODUCTS_SLUG);
  const { path, noIndex, titleSuffix } = catalogueSeo(PRODUCTS_PATH, searchParams);
  const title = page?.title ?? DEFAULT_PRODUCTS_TITLE;
  return buildMetadata({
    title: `${page?.seo?.title || title}${titleSuffix}`,
    seo: page?.seo ? { ...page.seo, title: null } : null,
    path,
    noIndex,
    fallbackDescription: page?.intro,
  });
}

export async function ProductsListing({ searchParams }: { searchParams: SearchParams }) {
  const [page, data] = await Promise.all([getPage(PRODUCTS_SLUG), loadCatalogue({ category: null, searchParams })]);
  const title = page?.title ?? DEFAULT_PRODUCTS_TITLE;
  return (
    <CatalogueView
      title={title}
      intro={page?.intro}
      breadcrumbs={[{ label: title }]}
      basePath={PRODUCTS_PATH}
      activeCategory={null}
      {...data}
    />
  );
}

export async function categoryMetadata(slug: string, searchParams: SearchParams): Promise<Metadata> {
  const category = await getCategory(slug);
  if (!category) return {};
  const { path, noIndex, titleSuffix } = catalogueSeo(`/product-category/${category.slug}/`, searchParams);
  return buildMetadata({
    title: `${category.seo?.title || category.title}${titleSuffix}`,
    seo: category.seo ? { ...category.seo, title: null } : null,
    path,
    noIndex,
    fallbackDescription:
      category.description ||
      `Browse ${category.seo?.title || category.title} from Presco Radiator Caps. Filter by application and part type, then enquire for pricing and availability.`,
    fallbackImage: category.image,
  });
}

export async function CategoryListing({ slug, searchParams }: { slug: string; searchParams: SearchParams }) {
  const category = await getCategory(slug);
  if (!category) notFound();
  const [data, productsPage] = await Promise.all([
    loadCatalogue({ category: category.slug, searchParams }),
    getPage(PRODUCTS_SLUG),
  ]);
  const productsTitle = productsPage?.title ?? DEFAULT_PRODUCTS_TITLE;
  return (
    <CatalogueView
      title={category.title}
      intro={category.description}
      breadcrumbs={[{ label: productsTitle, href: PRODUCTS_PATH }, { label: category.title }]}
      basePath={`/product-category/${category.slug}/`}
      activeCategory={category.slug}
      {...data}
    />
  );
}
