import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { firstParam, type SearchParams } from "@/components/catalogue/params";
import { SearchBox } from "@/components/catalogue/SearchBox";
import { ProductGrid } from "@/components/ProductCard";
import type { ProductCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SEARCH_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Search",
  alternates: { canonical: "/search/" },
  robots: { index: false, follow: true },
};

/** Keep letters, digits and a few part-number separators; collapse whitespace; cap length. */
function sanitise(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s\-./]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

/** "pag 9" -> "pag* 9*" (GROQ `match` requires every token to match). */
function toWildcardTerm(query: string): string {
  return query
    .split(" ")
    .slice(0, 8)
    .map((token) => `${token}*`)
    .join(" ");
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  // `name` is the parameter the old site used (/search?name=PAG878).
  const query = sanitise(firstParam(sp.q) || firstParam(sp.name));

  const products = query
    ? await sanityFetch<ProductCard[]>({
        query: SEARCH_QUERY,
        params: { term: toWildcardTerm(query) },
        tags: ["product"],
      })
    : [];
  const results = products ?? [];

  return (
    <>
      <Breadcrumbs items={[{ label: "Search" }]} />
      <div className="container-site py-8 lg:py-12">
        <h1 className="heading-section">
          {query ? (
            <>
              Search results for: <span className="normal-case">“{query}”</span>
            </>
          ) : (
            "Search products"
          )}
        </h1>

        <div className="mt-6">
          <SearchBox defaultValue={query} autoFocus={!query} />
        </div>

        {query && (
          <section aria-labelledby="search-results-heading" className="mt-8">
            <h2 id="search-results-heading" className="sr-only">
              Results
            </h2>
            <p className="mb-4 text-sm text-gray-500" role="status">
              {results.length === 0
                ? `No products found for “${query}”. Try a different part number or keyword.`
                : `${results.length}${results.length >= 60 ? "+" : ""} ${results.length === 1 ? "product" : "products"} found`}
            </p>
            {results.length > 0 && <ProductGrid products={results} />}
          </section>
        )}
      </div>
    </>
  );
}
