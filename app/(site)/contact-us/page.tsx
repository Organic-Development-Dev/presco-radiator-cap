import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { RichText } from "@/components/RichText";
import { buildMetadata } from "@/lib/metadata";
import type { Page, SiteSettings } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

const SLUG = "contact-us";

/** Used when Site Settings has no value yet (copied from the old site footer). */
const FALLBACK = {
  name: "Presco Radiator Caps Ltd",
  address: "Unit D86, Blackpole Trading Estate West\nWorcester, England\nWR3 8TJ",
  phone: "+44 (0)1905 755656",
  email: "sales@presco-radiator-caps.com",
};

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.3733757979894!2d-2.2033938233371284!3d52.21843397198367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870f1b1c73476f9%3A0x66d2825735993d1e!2sPresco%20Radiator%20Caps%20Ltd!5e0!3m2!1sen!2suk!4v1726054912549!5m2!1sen!2suk";

function getPage() {
  return sanityFetch<Page | null>({ query: PAGE_QUERY, params: { slug: SLUG }, tags: ["page", `page:${SLUG}`] });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return buildMetadata({
    title: page?.title ?? "Contact Us",
    seo: page?.seo,
    path: `/${SLUG}/`,
    fallbackDescription: "Get in touch with Presco Radiator Caps about products, orders, delivery or engineering enquiries.",
  });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getPage(),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
  ]);

  const name = settings?.siteName || FALLBACK.name;
  const address = settings?.address || FALLBACK.address;
  const phone = settings?.phone || FALLBACK.phone;
  const email = settings?.email || FALLBACK.email;
  const title = page?.title ?? "Contact Us";

  return (
    <>
      <Breadcrumbs items={[{ label: title }]} />
      <div className="container-site grid gap-10 py-10 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <section aria-labelledby="contact-heading">
          <h1 id="contact-heading" className="heading-section">
            {title}
          </h1>
          <p className="mt-4 mb-6 leading-relaxed">
            Have a question? We&rsquo;re here to help. Our team is ready to answer your enquiries about our products,
            orders and delivery, and you can also reach our engineering and development team using the form below.
          </p>
          <EnquiryForm kind="contact" submitLabel="Send your message" />
        </section>

        <section aria-labelledby="contact-details-heading" className="space-y-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface">
            <iframe
              src={MAP_SRC}
              title="Map showing the location of Presco Radiator Caps Ltd"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div>
            <h2 id="contact-details-heading" className="text-lg font-semibold text-primary">
              {name}
            </h2>
            <address className="mt-2 not-italic leading-relaxed whitespace-pre-line">{address}</address>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="font-semibold">Tel:</dt>
              <dd>
                <a href={`tel:${phone.replace(/\(0\)|[^\d+]/g, "")}`} className="text-primary hover:underline">
                  {phone}
                </a>
              </dd>
              <dt className="font-semibold">Email:</dt>
              <dd>
                <a href={`mailto:${email}`} className="break-all text-primary hover:underline">
                  {email}
                </a>
              </dd>
            </dl>
          </div>

          <RichText value={page?.body} />
        </section>
      </div>
    </>
  );
}
