import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { SITE_NAME } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { SocialIcon } from "./icons";

/** Legacy hardcoded contact details, used when site settings are empty. */
const FALLBACK = {
  address: "Presco Radiator Caps Ltd.\nUnit D86, Blackpole Trading Estate\nWest, Worcester, England, WR3 8TJ",
  phone: "+44 (0)1905 755656",
  fax: "+44 (0)1905 755654",
  email: "sales@presco-radiator-caps.com",
};

const PRODUCT_LINKS = [
  { label: "Europe Auto", href: "/product-category/auto/" },
  { label: "Japanese Auto", href: "/product-category/japanese-caps/" },
  { label: "Agricultural", href: "/product-category/agricultural/" },
  { label: "Trucks & Commercials", href: "/product-category/commercial-caps/" },
];

const IMPORTANT_LINKS = [
  { label: "Packaging", href: "/packaging/" },
  { label: "Inspection & Testing", href: "/inspection-testing/" },
  { label: "About Us", href: "/about-us/" },
  { label: "News", href: "/news/" },
  { label: "Contact Us", href: "/contact-us/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms and Conditions", href: "/terms-and-conditions/" },
  { label: "Disclaimer", href: "/disclaimer/" },
];

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  youtube: "YouTube",
};

async function getSettings(): Promise<SiteSettings> {
  try {
    return await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] });
  } catch (error) {
    console.error("Footer: failed to load site settings", error);
    return null;
  }
}

const telHref = (phone: string) => `tel:${phone.replace(/\(0\)/, "").replace(/[^\d+]/g, "")}`;

const headingClass = "mb-4 text-sm font-semibold uppercase text-white";
const linkClass = "inline-block py-2 hover:underline";

function Subscribe() {
  return (
    <section
      aria-labelledby="subscribe-heading"
      className="bg-primary bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{ backgroundImage: "url(/img/suscribe-bg.png)" }}
    >
      <div className="mx-auto max-w-xl text-center text-white">
        <h2 id="subscribe-heading" className="text-2xl font-bold uppercase">
          Subscribe
        </h2>
        <p className="pb-4 font-light">Want to stay up to date? Subscribe to our Newsletter!</p>
        <NewsletterForm className="mx-auto max-w-md text-white" />
      </div>
    </section>
  );
}

export async function Footer() {
  const settings = await getSettings();
  const address = settings?.address || FALLBACK.address;
  const phone = settings?.phone || FALLBACK.phone;
  const email = settings?.email || FALLBACK.email;
  const socialLinks = settings?.socialLinks?.filter((link) => link.url && SOCIAL_LABELS[link.platform]) ?? [];
  const year = new Date().getFullYear();

  return (
    <>
      <Subscribe />
      <footer className="text-white">
        <div className="bg-secondary">
          <div className="container-site grid gap-8 py-10 md:grid-cols-3">
            <div>
              <Image
                src="/img/logo-bg-white.png"
                alt={SITE_NAME}
                width={240}
                height={71}
                className="h-auto w-48 lg:w-64"
              />
              {settings?.footerText && <p className="mt-4 text-xs font-light">{settings.footerText}</p>}
              {socialLinks.length > 0 && (
                <ul className="mt-4 flex gap-6">
                  {socialLinks.map((link) => (
                    <li key={link._key}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-9 items-center hover:opacity-80"
                      >
                        <SocialIcon platform={link.platform} className="h-6 w-6" />
                        <span className="sr-only">{SOCIAL_LABELS[link.platform]} (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid gap-8 text-xs font-light sm:grid-cols-3 md:col-span-2">
              <div>
                <h2 className={headingClass}>Our Address</h2>
                <address className="not-italic">
                  <p className="whitespace-pre-line">{address}</p>
                  <p className="mt-4">
                    Ph:{" "}
                    <a href={telHref(phone)} className="underline hover:no-underline">
                      {phone}
                    </a>
                  </p>
                  <p>Fax: {FALLBACK.fax}</p>
                  <p>
                    <a href={`mailto:${email}`} className="underline hover:no-underline">
                      {email}
                    </a>
                  </p>
                </address>
              </div>

              <nav aria-labelledby="footer-products">
                <h2 id="footer-products" className={headingClass}>
                  Our Products
                </h2>
                <ul>
                  {PRODUCT_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-labelledby="footer-links">
                <h2 id="footer-links" className={headingClass}>
                  Important Links
                </h2>
                <ul>
                  {IMPORTANT_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <p className="bg-[#333333] p-4 text-center text-xs font-light">
          Copyright © presco-radiator-caps.com 2010–{year}. All Rights Reserved
        </p>
      </footer>
    </>
  );
}
