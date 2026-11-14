import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { CatalogueView } from "@/components/catalogue/CatalogueView";
import { loadCatalogue } from "@/components/catalogue/load-catalogue";
import { catalogueSeo, type SearchParams } from "@/components/catalogue/params";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import type { Category, CategoryDetail } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY, CATEGORY_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export const dynamicParams = true;

const getCategory = cache((slug: string) =>
  sanityFetch<CategoryDetail | null>({ query: CATEGORY_QUERY, params: { slug }, tags: ["productCategory"] }),
);

export async function generateStaticParams() {
  const categories = await sanityFetch<Category[]>({ query: CATEGORIES_QUERY, tags: ["productCategory"] });
  return (categories ?? []).filter((c) => c.slug).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = await getCategory(slug);
  if (!category) return {};
  const { path, noIndex, titleSuffix } = catalogueSeo(`/product-category/${category.slug}/`, sp);
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

export default async function ProductCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const [data, productsPage] = await Promise.all([
    loadCatalogue({ category: category.slug, searchParams: await searchParams }),
    getPage("products"),
  ]);
  const productsTitle = productsPage?.title ?? "Products & Solutions";

  return (
    <CatalogueView
      title={category.title}
      intro={category.description}
      breadcrumbs={[{ label: productsTitle, href: "/products/" }, { label: category.title }]}
      basePath={`/product-category/${category.slug}/`}
      activeCategory={category.slug}
      {...data}
    />
  );
}
