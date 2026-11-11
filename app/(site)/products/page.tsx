import type { Metadata } from "next";
import { CatalogueView } from "@/components/catalogue/CatalogueView";
import { loadCatalogue } from "@/components/catalogue/load-catalogue";
import type { SearchParams } from "@/components/catalogue/params";
import { buildMetadata } from "@/lib/metadata";

const TITLE = "Products & Solutions";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  path: "/products/",
  fallbackDescription:
    "Browse the full Presco range of radiator caps, pressure caps and cooling system parts. Filter by application and part type.",
});

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const data = await loadCatalogue({ category: null, searchParams: await searchParams });

  return (
    <CatalogueView
      title={TITLE}
      breadcrumbs={[{ label: TITLE }]}
      basePath="/products/"
      activeCategory={null}
      {...data}
    />
  );
}
