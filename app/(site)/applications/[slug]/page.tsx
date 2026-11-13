import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SanityImage } from "@/components/SanityImage";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import { slugify } from "@/lib/slugify";
import type { ApplicationGuide } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { APPLICATION_GUIDE_QUERY, APPLICATION_GUIDE_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };

const getGuide = cache((slug: string) =>
  // "product": linked products' titles/images appear in the table.
  sanityFetch<ApplicationGuide | null>({ query: APPLICATION_GUIDE_QUERY, params: { slug }, tags: ["applicationGuide", "product"] }),
);

export async function generateStaticParams() {
  return sanityFetch<{ slug: string }[]>({ query: APPLICATION_GUIDE_SLUGS_QUERY, tags: ["applicationGuide"] });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return {};
  const makes = guide.sections?.map((s) => s.heading).filter(Boolean).join(", ");
  return buildMetadata({
    title: guide.seo?.title || `${guide.title} – Radiator Cap Applications`,
    seo: guide.seo,
    path: `/applications/${guide.slug}/`,
    fallbackDescription: guide.intro || (makes ? `Presco radiator, fuel and oil caps for ${makes}: part numbers, pressures and OE references.` : undefined),
    modifiedTime: guide._updatedAt,
  });
}

export default async function ApplicationGuidePage({ params }: Props) {
  const { slug } = await params;
  const [guide, listing] = await Promise.all([getGuide(slug), getPage("applications")]);
  if (!guide) notFound();
  const sections = (guide.sections ?? []).filter((s) => s.parts?.length);
  const listingTitle = listing?.title ?? "Vehicle Applications";
  const jumpLinks = sections.filter((s) => s.heading);

  return (
    <>
      <Breadcrumbs items={[{ label: listingTitle, href: "/applications/" }, { label: guide.title }]} />
      <div className="container-site py-10 sm:py-16">
        <header className="mb-8">
          <h1 className="heading-section">{guide.title}</h1>
          {guide.intro && <p className="mt-2 max-w-3xl text-gray-600">{guide.intro}</p>}
        </header>

        {jumpLinks.length > 1 && (
          <nav aria-label="Jump to section" className="mb-10">
            <ul className="flex flex-wrap gap-2">
              {jumpLinks.map((s) => (
                <li key={s._key}>
                  <a
                    href={`#${slugify(s.heading!)}`}
                    className="inline-block rounded-full border border-primary/30 px-3 py-1 text-xs text-primary hover:bg-primary hover:text-white"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="space-y-12">
          {sections.map((section) => (
            <section
              key={section._key}
              id={section.heading ? slugify(section.heading) : undefined}
              aria-label={section.heading ?? guide.title}
              className="scroll-mt-28"
            >
              {section.heading && <h2 className="mb-4 text-xl font-bold text-primary">{section.heading}</h2>}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-primary text-[13px]">
                  <thead className="text-primary">
                    <tr>
                      {["Part", "Fits / description", "Pressure", "OE / cross reference"].map((h) => (
                        <th key={h} scope="col" className="border border-primary px-3 py-2 text-left font-semibold tracking-[1.5px] uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.parts!.map((part) => (
                      <tr key={part._key} className="align-top">
                        <th scope="row" className="border border-primary px-3 py-2 text-left font-normal">
                          {part.product ? (
                            <Link href={`/product/${part.product.slug}/`} className="group flex items-center gap-3">
                              {part.product.image?.asset && (
                                <SanityImage image={part.product.image} alt="" width={48} sizes="48px" className="size-12 shrink-0 object-contain" />
                              )}
                              <span className="font-semibold whitespace-nowrap text-primary group-hover:underline">{part.product.title}</span>
                            </Link>
                          ) : (
                            <span className="font-semibold whitespace-nowrap">{part.code}</span>
                          )}
                        </th>
                        <td className="border border-primary px-3 py-2">{part.fits}</td>
                        <td className="border border-primary px-3 py-2 whitespace-nowrap">{part.pressure}</td>
                        <td className="border border-primary px-3 py-2">{part.oe}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm text-gray-600">
          Can&apos;t see your vehicle?{" "}
          <Link href="/contact-us/" className="font-semibold text-primary underline">
            Send us the OE number
          </Link>{" "}
          and we&apos;ll find the right cap.
        </p>
      </div>
    </>
  );
}
