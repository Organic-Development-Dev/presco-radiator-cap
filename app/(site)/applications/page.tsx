import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RichText } from "@/components/RichText";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import { slugify } from "@/lib/slugify";
import type { ApplicationGuideSummary } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { APPLICATION_GUIDES_QUERY } from "@/sanity/lib/queries";

/** Title, intro and SEO come from the `page` document with this slug. */
const SLUG = "applications";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG);
  return buildMetadata({
    title: page?.title ?? "Vehicle Applications",
    seo: page?.seo,
    path: `/${SLUG}/`,
    fallbackDescription: page?.intro,
  });
}

export default async function ApplicationsPage() {
  const [page, guides] = await Promise.all([
    getPage(SLUG),
    sanityFetch<ApplicationGuideSummary[]>({ query: APPLICATION_GUIDES_QUERY, tags: ["applicationGuide"] }),
  ]);
  const title = page?.title ?? "Vehicle Applications";

  return (
    <>
      <Breadcrumbs items={[{ label: title }]} />
      <div className="container-site py-10 sm:py-16">
        <header className="mb-10">
          <h1 className="heading-section">{title}</h1>
          {page?.intro && <p className="mt-2 max-w-3xl text-gray-600">{page.intro}</p>}
        </header>
        <RichText value={page?.body} className="mb-10" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide._id} className="flex flex-col rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-primary">
                <Link href={`/applications/${guide.slug}/`} className="hover:underline">
                  {guide.title}
                </Link>
              </h2>
              {guide.intro && <p className="mt-2 text-sm text-gray-600">{guide.intro}</p>}
              {guide.makes && guide.makes.length > 1 && (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Sections in ${guide.title}`}>
                  {guide.makes.map((make) => (
                    <li key={make}>
                      <Link
                        href={`/applications/${guide.slug}/#${slugify(make)}`}
                        className="inline-block rounded-full border border-primary/30 px-3 py-1 text-xs text-primary hover:bg-primary hover:text-white"
                      >
                        {make}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-auto pt-4 text-xs text-gray-500">{guide.partCount ?? 0} parts</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
