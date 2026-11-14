import "server-only";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY, PRODUCTS_QUERY, PRODUCT_FACETS_QUERY } from "@/sanity/lib/queries";
import { PAGE_SIZE, naturalCompare, parseFilters, parsePage, type SearchParams } from "./params";

const TAGS = ["product", "productCategory"];

const isString = (value: string | null): value is string => Boolean(value);

/** Fetch everything a catalogue listing page needs: categories, facets, filtered products. */
export async function loadCatalogue({ category, searchParams }: { category: string | null; searchParams: SearchParams }) {
  const [categories, rawFacets] = await Promise.all([
    sanityFetch({ query: CATEGORIES_QUERY, tags: TAGS }),
    sanityFetch({ query: PRODUCT_FACETS_QUERY, params: { category }, tags: TAGS }),
  ]);

  const facets = {
    applications: (rawFacets?.applications ?? []).filter(isString).sort(naturalCompare),
    partTypes: (rawFacets?.partTypes ?? []).filter(isString).sort(naturalCompare),
  };
  const filters = parseFilters(searchParams, facets);

  const products = await sanityFetch({
    query: PRODUCTS_QUERY,
    params: { category, applications: filters.applications, partTypes: filters.types },
    tags: TAGS,
  });

  // Pages past the end are a 404, not a duplicate of the last page under a new URL.
  const page = parsePage(searchParams);
  const totalPages = Math.max(1, Math.ceil((products?.length ?? 0) / PAGE_SIZE));
  if (page > totalPages) notFound();

  return {
    categories: categories ?? [],
    facets,
    filters,
    products: [...(products ?? [])].sort((a, b) => naturalCompare(a.title, b.title)),
    page,
  };
}
