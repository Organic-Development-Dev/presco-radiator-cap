import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { toPlainText } from "next-sanity";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductEnquiryButtons } from "@/components/catalogue/ProductEnquiryButtons";
import { ProductGallery } from "@/components/catalogue/ProductGallery";
import { ProductGrid } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { buildMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Product } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY, PRODUCT_SLUG_BY_WP_ID_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

function getProduct(slug: string) {
  return sanityFetch<Product | null>({
    query: PRODUCT_QUERY,
    params: { slug },
    tags: ["product", "productCategory", `product:${slug}`],
  });
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({ query: PRODUCT_SLUGS_QUERY, tags: ["product"] });
  return (slugs ?? []).filter((s) => s.slug).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.title,
    seo: product.seo,
    path: `/product/${product.slug}/`,
    fallbackDescription: describe(product),
  });
}

/** Short plain-text description for meta tags and JSON-LD. */
function describe(product: Product): string {
  const text = toPlainText(product.summary ?? product.description ?? []).replace(/\s+/g, " ").trim();
  if (text) return text.length > 160 ? `${text.slice(0, 157)}…` : text;
  const type = product.partType?.[0] ?? "radiator cap";
  return `${product.title} ${type.toLowerCase()} from ${SITE_NAME}. Enquire for availability and pricing.`;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

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
  const category = product.categories?.find((c) => c?.slug);
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
    { label: "Products & Solutions", href: "/products/" },
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
            <h1 className="text-2xl font-semibold text-primary sm:text-3xl">{product.title}</h1>

            <dl className="mt-6 space-y-4">
              {specs.map(({ label, values }) => {
                const list = (values ?? []).filter(Boolean);
                if (!list.length) return null;
                return (
                  <div key={label}>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-primary">{label}</dt>
                    <dd className="mt-1 text-sm">{list.join(", ")}</dd>
                  </div>
                );
              })}
            </dl>

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
          description: describe(product),
          brand: { "@type": "Brand", name: SITE_NAME },
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
