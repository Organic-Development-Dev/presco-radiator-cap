import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { RichText } from "@/components/RichText";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import { getSiteSettings } from "@/lib/settings";
import { addressLines, telHref } from "@/lib/text";

const SLUG = "contact-us";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG);
  return buildMetadata({
    title: page?.title ?? "Contact Us",
    seo: page?.seo,
    path: `/${SLUG}/`,
    fallbackDescription: page?.intro,
  });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage(SLUG), getSiteSettings()]);
  const title = page?.title ?? "Contact Us";
  const name = settings?.legalName || settings?.siteName;
  const address = addressLines(settings?.address);

  return (
    <>
      <Breadcrumbs items={[{ label: title }]} />
      <div className="container-site grid gap-10 py-10 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <section aria-labelledby="contact-heading">
          <h1 id="contact-heading" className="heading-section">
            {title}
          </h1>
          {page?.intro && <p className="mt-4 mb-6 leading-relaxed whitespace-pre-line">{page.intro}</p>}
          <EnquiryForm kind="contact" submitLabel="Send your message" />
        </section>

        <section aria-labelledby="contact-details-heading" className="space-y-8">
          {settings?.mapEmbedUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface">
              <iframe
                src={settings.mapEmbedUrl}
                title={`Map showing the location of ${name ?? "our office"}`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}

          <div>
            <h2 id="contact-details-heading" className="text-lg font-semibold text-primary">
              {name || "Contact details"}
            </h2>
            {address.length > 0 && (
              <address className="mt-2 not-italic leading-relaxed">
                {address.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </address>
            )}
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              {settings?.phone && (
                <>
                  <dt className="font-semibold">Tel:</dt>
                  <dd>
                    <a href={telHref(settings.phone)} className="text-primary hover:underline">
                      {settings.phone}
                    </a>
                  </dd>
                </>
              )}
              {settings?.fax && (
                <>
                  <dt className="font-semibold">Fax:</dt>
                  <dd>{settings.fax}</dd>
                </>
              )}
              {settings?.email && (
                <>
                  <dt className="font-semibold">Email:</dt>
                  <dd>
                    <a href={`mailto:${settings.email}`} className="break-all text-primary hover:underline">
                      {settings.email}
                    </a>
                  </dd>
                </>
              )}
            </dl>
            {settings?.openingHours && (
              <>
                <h3 className="mt-6 font-semibold">Opening hours</h3>
                <p className="mt-1 leading-relaxed whitespace-pre-line">{settings.openingHours}</p>
              </>
            )}
          </div>

          <RichText value={page?.body} />
        </section>
      </div>
    </>
  );
}
