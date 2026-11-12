import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/content/PageHeader";
import { RichText } from "@/components/RichText";
import { buildMetadata } from "@/lib/metadata";
import type { Page } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };

/** Pages rendered by their own route (or not at all) rather than this generic one. */
const RESERVED_SLUGS = new Set(["contact-us", "products", "news"]);

function getPage(slug: string) {
  if (RESERVED_SLUGS.has(slug)) return Promise.resolve(null);
  return sanityFetch<Page | null>({ query: PAGE_QUERY, params: { slug }, tags: ["page", `page:${slug}`] });
}

export async function generateStaticParams() {
  const pages = await sanityFetch<{ slug: string }[]>({ query: PAGE_SLUGS_QUERY, tags: ["page"] });
  return pages.filter(({ slug }) => !RESERVED_SLUGS.has(slug)).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    seo: page.seo,
    path: `/${page.slug}/`,
    fallbackDescription: page.intro,
    fallbackImage: page.heroImage,
  });
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      <Breadcrumbs items={[{ label: page.title }]} />
      <article className="container-site py-10 sm:py-16">
        <PageHeader title={page.title} heroImage={page.heroImage} />
        {page.intro && <p className="mb-8 max-w-3xl text-lg leading-relaxed text-gray-600">{page.intro}</p>}
        <RichText value={page.body} className="max-w-none" />
      </article>
    </>
  );
}
