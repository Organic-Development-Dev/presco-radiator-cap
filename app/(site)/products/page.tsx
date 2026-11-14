import type { Metadata } from "next";
import { CatalogueView } from "@/components/catalogue/CatalogueView";
import { loadCatalogue } from "@/components/catalogue/load-catalogue";
import { catalogueSeo, type SearchParams } from "@/components/catalogue/params";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";

const SLUG = "products";
const BASE_PATH = `/${SLUG}/`;

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [page, sp] = await Promise.all([getPage(SLUG), searchParams]);
  const { path, noIndex, titleSuffix } = catalogueSeo(BASE_PATH, sp);
  const title = page?.title ?? "Products & Solutions";
  return buildMetadata({
    title: `${page?.seo?.title || title}${titleSuffix}`,
    seo: page?.seo ? { ...page.seo, title: null } : null,
    path,
    noIndex,
    fallbackDescription: page?.intro,
  });
}

export default async function ProductsPage({ searchParams }: Props) {
  const [page, data] = await Promise.all([
    getPage(SLUG),
    searchParams.then((sp) => loadCatalogue({ category: null, searchParams: sp })),
  ]);
  const title = page?.title ?? "Products & Solutions";

  return (
    <CatalogueView
      title={title}
      intro={page?.intro}
      breadcrumbs={[{ label: title }]}
      basePath={BASE_PATH}
      activeCategory={null}
      {...data}
    />
  );
}
