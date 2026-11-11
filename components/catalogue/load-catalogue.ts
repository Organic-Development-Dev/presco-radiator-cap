import "server-only";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY, PRODUCTS_QUERY, PRODUCT_FACETS_QUERY } from "@/sanity/lib/queries";
import type { Category, ProductCard, ProductFacets } from "@/lib/types";
import { naturalCompare, parseFilters, parsePage, type SearchParams } from "./params";

const TAGS = ["product", "productCategory"];

/** Fetch everything a catalogue listing page needs: categories, facets, filtered products. */
export async function loadCatalogue({ category, searchParams }: { category: string | null; searchParams: SearchParams }) {
  const [categories, rawFacets] = await Promise.all([
    sanityFetch<Category[]>({ query: CATEGORIES_QUERY, tags: TAGS }),
    sanityFetch<ProductFacets>({ query: PRODUCT_FACETS_QUERY, params: { category }, tags: TAGS }),
  ]);

  const facets = {
    applications: (rawFacets?.applications ?? []).filter(Boolean).sort(naturalCompare),
    partTypes: (rawFacets?.partTypes ?? []).filter(Boolean).sort(naturalCompare),
  };
  const filters = parseFilters(searchParams, facets);

  const products = await sanityFetch<ProductCard[]>({
    query: PRODUCTS_QUERY,
    params: { category, applications: filters.applications, partTypes: filters.types },
    tags: TAGS,
  });

  return {
    categories: categories ?? [],
    facets,
    filters,
    products: [...(products ?? [])].sort((a, b) => naturalCompare(a.title, b.title)),
    page: parsePage(searchParams),
  };
}
