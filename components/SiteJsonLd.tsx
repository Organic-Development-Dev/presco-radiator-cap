import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { JsonLd } from "./JsonLd";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Organization + WebSite (with sitelinks search box) structured data, from Site settings. */
export function SiteJsonLd({ settings }: { settings: SiteSettings }) {
  const name = settings?.siteName || SITE_NAME;
  const address = settings?.address;
  const sameAs = (settings?.socialLinks ?? []).map((link) => link.url).filter(Boolean);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
            name,
            ...(settings?.legalName ? { legalName: settings.legalName } : {}),
            url: `${SITE_URL}/`,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png`, width: 300, height: 124 },
            ...(settings?.email ? { email: settings.email } : {}),
            ...(settings?.phone ? { telephone: settings.phone } : {}),
            ...(settings?.fax ? { faxNumber: settings.fax } : {}),
            ...(address?.streetAddress
              ? {
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: address.streetAddress,
                    addressLocality: address.locality ?? undefined,
                    addressRegion: address.region ?? undefined,
                    postalCode: address.postalCode ?? undefined,
                    addressCountry: address.countryCode ?? undefined,
                  },
                }
              : {}),
            ...(settings?.phone || settings?.email
              ? {
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "sales",
                    ...(settings.phone ? { telephone: settings.phone } : {}),
                    ...(settings.email ? { email: settings.email } : {}),
                    areaServed: "Worldwide",
                    availableLanguage: "en",
                  },
                }
              : {}),
            ...(sameAs.length ? { sameAs } : {}),
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name,
            inLanguage: "en-GB",
            publisher: { "@id": ORGANIZATION_ID },
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search/?q={search_term_string}` },
              "query-input": "required name=search_term_string",
            },
          },
        ],
      }}
    />
  );
}
