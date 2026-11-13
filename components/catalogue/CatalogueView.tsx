import Link from "next/link";
import { ProductGrid } from "@/components/ProductCard";
import type { Category, ProductCard } from "@/lib/types";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { FilterForm } from "./FilterForm";
import { PAGE_SIZE, catalogueHref, type CatalogueFilters } from "./params";

type Props = {
  title: string;
  intro?: string | null;
  breadcrumbs: Crumb[];
  basePath: string;
  categories: Category[];
  activeCategory: string | null;
  facets: { applications: string[]; partTypes: string[] };
  filters: CatalogueFilters;
  products: ProductCard[];
  page: number;
};

/** Shared layout for /products/ and /product-category/[slug]/: filter sidebar + paginated grid. */
export function CatalogueView({
  title,
  intro,
  breadcrumbs,
  basePath,
  categories,
  activeCategory,
  facets,
  filters,
  products,
  page,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCount = filters.applications.length + filters.types.length;
  // Remount the form when the URL filters change so `defaultChecked` stays in sync.
  const formKey = JSON.stringify(filters);

  const sidebar = (
    <div className="space-y-8">
      <CategoryNav categories={categories} activeCategory={activeCategory} />
      <FilterForm
        key={formKey}
        action={basePath}
        applications={facets.applications}
        partTypes={facets.partTypes}
        selected={filters}
      />
    </div>
  );

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div className="container-site py-8 lg:py-12">
        <header className="mb-6">
          <h1 className="heading-section">{title}</h1>
          {intro && <p className="mt-2 max-w-3xl text-sm text-gray-600">{intro}</p>}
        </header>

        <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
          {/* Mobile: collapsible drawer */}
          <details className="group mb-6 rounded-lg bg-surface lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 text-lg font-semibold uppercase text-accent [&::-webkit-details-marker]:hidden">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 fill-none stroke-current stroke-2">
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              Filter
              {activeCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{activeCount}</span>
              )}
              <span aria-hidden="true" className="ml-auto text-base transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="border-t border-gray-200 px-4 py-4">{sidebar}</div>
          </details>

          {/* Desktop: sidebar */}
          <aside aria-label="Product filters" className="hidden lg:block">
            {sidebar}
          </aside>

          <section aria-labelledby="results-heading">
            <h2 id="results-heading" className="sr-only">
              Products
            </h2>
            <p className="mb-4 text-sm text-gray-500" aria-live="polite">
              {products.length} {products.length === 1 ? "product" : "products"}
              {activeCount > 0 && " matching your filters"}
            </p>
            <ProductGrid products={pageItems} />
            {totalPages > 1 && (
              <Pagination basePath={basePath} filters={filters} page={currentPage} totalPages={totalPages} />
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function CategoryNav({ categories, activeCategory }: { categories: Category[]; activeCategory: string | null }) {
  if (!categories.length) return null;
  const linkClass = (active: boolean) =>
    `flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
      active ? "bg-primary font-semibold text-white" : "hover:bg-surface hover:text-accent"
    }`;
  return (
    <nav aria-label="Product categories">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">Categories</h2>
      <ul className="space-y-0.5">
        <li>
          <Link
            href="/products/"
            className={linkClass(activeCategory === null)}
            aria-current={activeCategory === null ? "page" : undefined}
          >
            All products
          </Link>
        </li>
        {categories.map((category) => {
          const active = category.slug === activeCategory;
          return (
            <li key={category._id} className={category.parent ? "pl-3" : undefined}>
              <Link
                href={`/product-category/${category.slug}/`}
                className={linkClass(active)}
                aria-current={active ? "page" : undefined}
              >
                <span>{category.title}</span>
                {typeof category.count === "number" && (
                  <span className={`text-xs ${active ? "text-white/80" : "text-gray-400"}`}>{category.count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Pagination({
  basePath,
  filters,
  page,
  totalPages,
}: {
  basePath: string;
  filters: CatalogueFilters;
  page: number;
  totalPages: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
  );
  const base = "inline-flex min-w-10 items-center justify-center rounded-md border px-3 py-2 text-sm";
  return (
    <nav aria-label="Pagination" className="mt-10">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 && (
          <li>
            <Link href={catalogueHref(basePath, filters, page - 1)} rel="prev" className={`${base} border-gray-200 hover:border-accent hover:text-accent`}>
              <span aria-hidden="true">‹</span>
              <span className="sr-only">Previous page</span>
            </Link>
          </li>
        )}
        {pages.map((p, i) => (
          <li key={p} className="flex items-center gap-2">
            {i > 0 && p - pages[i - 1] > 1 && (
              <span aria-hidden="true" className="px-1 text-gray-400">
                …
              </span>
            )}
            {p === page ? (
              <span aria-current="page" className={`${base} border-accent bg-primary font-semibold text-white`}>
                {p}
              </span>
            ) : (
              <Link href={catalogueHref(basePath, filters, p)} className={`${base} border-gray-200 hover:border-accent hover:text-accent`}>
                <span className="sr-only">Page </span>
                {p}
              </Link>
            )}
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link href={catalogueHref(basePath, filters, page + 1)} rel="next" className={`${base} border-gray-200 hover:border-accent hover:text-accent`}>
              <span aria-hidden="true">›</span>
              <span className="sr-only">Next page</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
