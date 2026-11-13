import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { toPlainText } from "next-sanity";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductEnquiryButtons } from "@/components/catalogue/ProductEnquiryButtons";
import { ProductGallery } from "@/components/catalogue/ProductGallery";
import { ProductGrid } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { ORGANIZATION_ID } from "@/components/SiteJsonLd";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import { getSiteSettings } from "@/lib/settings";
import { tidyLabel, truncate } from "@/lib/text";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Product } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY, PRODUCT_SLUG_BY_WP_ID_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

const getProduct = cache((slug: string) =>
  sanityFetch<Product | null>({
    query: PRODUCT_QUERY,
    params: { slug },
    tags: ["product", "productCategory", `product:${slug}`, "applicationGuide"],
  }),
);

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({ query: PRODUCT_SLUGS_QUERY, tags: ["product"] });
  return (slugs ?? []).filter((s) => s.slug).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const settings = await getSiteSettings();
  return buildMetadata({
    title: productTitle(product),
    seo: product.seo,
    path: `/product/${product.slug}/`,
    fallbackDescription: describe(product, settings?.siteName || SITE_NAME),
    fallbackImage: product.images?.find((img) => img?.asset),
  });
}

/** "PAG9 Pressure Cap": part numbers alone make weak page titles. */
/** Part type, or failing that what the product's (most specific) category calls its products. */
function productType(product: Product): string {
  const categories = [...(product.categories ?? [])].filter(Boolean).sort((a, b) => Number(b.isChild) - Number(a.isChild));
  const type = tidyLabel(product.partType?.[0]) || categories.find((c) => c.productNoun)?.productNoun || "";
  return type && !product.title.toLowerCase().includes(type.toLowerCase()) ? type : "";
}

function productTitle(product: Product): string {
  const type = productType(product);
  return type ? `${product.title} ${type}` : product.title;
}

/** Plain-text description for meta tags and JSON-LD, built from the specs when there's no copy. */
function describe(product: Product, siteName: string): string {
  const copy = toPlainText(product.description ?? []).trim();
  if (copy) return truncate(copy);
  const list = (values: string[] | null | undefined, n = 4) =>
    (values ?? [])
      .map((v) => v.replace(/[\s,.;]+$/, ""))
      .filter(Boolean)
      .slice(0, n)
      .join(", ")
      .replace(/[\s,]+$/, "");
  const parts = [
    `${productTitle(product)} from ${siteName}`,
    list(product.applications) && `for ${list(product.applications)}`,
  ].filter(Boolean);
  const extras = [
    list(product.oeNumbers, 3) && `OE: ${list(product.oeNumbers, 3)}.`,
    list(product.pressure, 2) && `Pressure: ${list(product.pressure, 2)}.`,
    "Enquire today for pricing and availability.",
  ].filter(Boolean);
  return truncate(`${parts.join(" ")}. ${extras.join(" ")}`);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, productsPage, settings] = await Promise.all([getProduct(slug), getPage("products"), getSiteSettings()]);
  const siteName = settings?.siteName || SITE_NAME;

  if (!product) {
    // Old WooCommerce links used numeric IDs: /product/7314/
    if (/^\d+$/.test(slug)) {
      const newSlug = await sanityFetch<string | null>({
        query: PRODUCT_SLUG_BY_WP_ID_QUERY,
        params: { wpId: Number(slug) },
        tags: ["product"],
      });
      if (newSlug && newSlug !== slug) permanentRedirect(`/product/${newSlug}/`);
    }
    notFound();
  }

  const images = (product.images ?? []).filter((img) => img?.asset);
  // Breadcrumb through the most specific category (a child category if there is one).
  const category = product.categories?.find((c) => c?.slug && c.isChild) ?? product.categories?.find((c) => c?.slug);
  const related = (product.related ?? []).filter((p) => p?.slug).slice(0, 8);
  const url = `${SITE_URL}/product/${product.slug}/`;

  const specs: { label: string; values?: string[] | null }[] = [
    { label: "Part type", values: product.partType },
    { label: "OE numbers", values: product.oeNumbers },
    { label: "Applications", values: product.applications },
    { label: "Pressure", values: product.pressure },
    { label: "Model info", values: product.modelInfo },
  ];

  const crumbs: Crumb[] = [
    { label: productsPage?.title ?? "Products & Solutions", href: "/products/" },
    ...(category ? [{ label: category.title, href: `/product-category/${category.slug}/` }] : []),
    { label: product.title },
  ];

  return (
    <>
      <Breadcrumbs items={crumbs} />

      <div className="container-site py-8 lg:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          <ProductGallery images={images} title={product.title} />

          <div>
            <h1 className="text-2xl font-semibold text-primary sm:text-3xl">
              {product.title}
              {productType(product) && (
                <span className="mt-1 block text-lg font-normal text-secondary">{productType(product)}</span>
              )}
            </h1>

            <dl className="mt-6 space-y-4">
              {specs.map(({ label, values }) => {
                const list = (values ?? []).filter(Boolean);
                if (!list.length) return null;
                return (
                  <div key={label}>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-primary">{label}</dt>
                    {label === "Applications" ? (
                      // Entries contain commas themselves ("Audi: A4, A6, A8"), so one per line.
                      <dd className="mt-1 text-sm">
                        <ul className="space-y-1">
                          {list.map((v) => (
                            <li key={v}>{v}</li>
                          ))}
                        </ul>
                      </dd>
                    ) : (
                      <dd className="mt-1 text-sm">{list.join(", ")}</dd>
                    )}
                  </div>
                );
              })}
            </dl>

            {product.guides?.length ? (
              <p className="mt-4 text-sm">
                See it in the{" "}
                {product.guides.map((g, i) => (
                  <span key={g.slug}>
                    {i > 0 && (i === product.guides!.length - 1 ? " and " : ", ")}
                    <Link href={`/applications/${g.slug}/`} className="font-semibold text-primary underline">
                      {g.title}
                    </Link>
                  </span>
                ))}{" "}
                vehicle application {product.guides.length > 1 ? "guides" : "guide"}.
              </p>
            ) : null}

            {product.summary?.length ? (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Cross references</h2>
                <RichText value={product.summary} className="text-sm [&_p]:my-2" />
              </div>
            ) : null}

            <div className="mt-8">
              <ProductEnquiryButtons productId={product._id} productTitle={product.title} />
            </div>
          </div>
        </div>

        {product.description?.length ? (
          <section aria-labelledby="description-heading" className="mt-12 max-w-3xl">
            <h2 id="description-heading" className="heading-section">
              Description
            </h2>
            <RichText value={product.description} />
          </section>
        ) : null}

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16">
            <h2 id="related-heading" className="heading-section mb-6 text-center">
              Related products
            </h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          sku: product.title,
          mpn: product.title,
          url,
          description: describe(product, siteName),
          brand: { "@type": "Brand", name: siteName },
          manufacturer: { "@id": ORGANIZATION_ID },
          ...(images.length ? { image: images.map((img) => urlFor(img).width(1200).url()) } : {}),
          ...(category ? { category: category.title } : {}),
          ...(product.oeNumbers?.length
            ? {
                additionalProperty: product.oeNumbers.map((oe) => ({
                  "@type": "PropertyValue",
                  name: "OE number",
                  value: oe,
                })),
              }
            : {}),
        }}
      />
    </>
  );
}
