import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/content/PageHeader";
import { RichText } from "@/components/RichText";
import { TeamGrid } from "@/components/content/TeamGrid";
import { isLocale, localeInfo } from "@/lib/locales";
import { getLocalePages, languageAlternates } from "@/lib/localePages";
import { buildMetadata } from "@/lib/metadata";
import type { Page } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };

/** Pages rendered by their own route (or not at all) rather than this generic one. */
const RESERVED_SLUGS = new Set(["contact-us", "products", "news", "applications"]);

function getPage(slug: string) {
  if (RESERVED_SLUGS.has(slug)) return Promise.resolve(null);
  return sanityFetch<Page | null>({ query: PAGE_QUERY, params: { slug }, tags: ["page", `page:${slug}`, "teamMember"] });
}

async function getLocalePage(slug: string) {
  if (!isLocale(slug)) return null;
  return (await getLocalePages()).find((p) => p.language === slug) ?? null;
}

export async function generateStaticParams() {
  const [pages, locales] = await Promise.all([
    sanityFetch<{ slug: string }[]>({ query: PAGE_SLUGS_QUERY, tags: ["page"] }),
    getLocalePages(),
  ]);
  return [
    ...pages.filter(({ slug }) => !RESERVED_SLUGS.has(slug) && !isLocale(slug)).map(({ slug }) => ({ slug })),
    ...locales.map((l) => ({ slug: l.language })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const localePage = await getLocalePage(slug);
  if (localePage) {
    return buildMetadata({
      title: localePage.title,
      seo: localePage.seo,
      path: `/${localePage.language}/`,
      // Unchecked (machine) translations stay out of search results.
      noIndex: !localePage.checked,
      languages: localePage.checked ? languageAlternates(await getLocalePages()) : undefined,
    });
  }
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
  const localePage = await getLocalePage(slug);
  if (localePage) {
    const info = localeInfo(localePage.language);
    return (
      <article lang={localePage.language} dir={info?.dir ?? "ltr"} className="container-site py-10 sm:py-16">
        <h1 className="heading-section mb-8">{localePage.title}</h1>
        <RichText value={localePage.body} className="max-w-3xl" />
        <p className="mt-10" lang="en" dir="ltr">
          <Link href="/contact-us/" className="btn-primary">
            Contact us (English)
          </Link>
        </p>
      </article>
    );
  }
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      <Breadcrumbs items={[{ label: page.title }]} />
      <article className="container-site py-10 sm:py-16">
        <PageHeader title={page.title} heroImage={page.heroImage} />
        {page.intro && <p className="mb-8 max-w-3xl text-lg leading-relaxed text-gray-600">{page.intro}</p>}
        <RichText value={page.body} className="max-w-none" />
        <TeamGrid heading={page.teamHeading} members={page.teamMembers} />
      </article>
    </>
  );
}
