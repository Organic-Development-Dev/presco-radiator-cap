import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueView } from "@/components/catalogue/CatalogueView";
import { loadCatalogue } from "@/components/catalogue/load-catalogue";
import type { SearchParams } from "@/components/catalogue/params";
import { buildMetadata } from "@/lib/metadata";
import type { Category, CategoryDetail } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY, CATEGORY_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export const dynamicParams = true;

function getCategory(slug: string) {
  return sanityFetch<CategoryDetail | null>({ query: CATEGORY_QUERY, params: { slug }, tags: ["productCategory"] });
}

export async function generateStaticParams() {
  const categories = await sanityFetch<Category[]>({ query: CATEGORIES_QUERY, tags: ["productCategory"] });
  return (categories ?? []).filter((c) => c.slug).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.title,
    seo: category.seo,
    path: `/product-category/${category.slug}/`,
    fallbackDescription: category.description || `Presco ${category.title} — browse the range and enquire today.`,
  });
}

export default async function ProductCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const data = await loadCatalogue({ category: category.slug, searchParams: await searchParams });

  return (
    <CatalogueView
      title={category.title}
      intro={category.description}
      breadcrumbs={[{ label: "Products & Solutions", href: "/products/" }, { label: category.title }]}
      basePath={`/product-category/${category.slug}/`}
      activeCategory={category.slug}
      {...data}
    />
  );
}
