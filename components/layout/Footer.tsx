import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { isExternalHref, resolveHref } from "@/lib/links";
import { getSiteSettings } from "@/lib/settings";
import { SITE_NAME } from "@/lib/site";
import { addressLines, telHref } from "@/lib/text";
import { SocialIcon } from "./icons";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  youtube: "YouTube",
};

const headingClass = "mb-4 text-sm font-semibold uppercase text-white";
const linkClass = "inline-block py-2 hover:underline";

function Subscribe({ heading, text }: { heading?: string | null; text?: string | null }) {
  return (
    <section
      aria-labelledby="subscribe-heading"
      className="bg-primary bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{ backgroundImage: "url(/img/suscribe-bg.png)" }}
    >
      <div className="mx-auto max-w-xl text-center text-white">
        <h2 id="subscribe-heading" className="text-2xl font-bold uppercase">
          {heading || "Subscribe"}
        </h2>
        {text && <p className="pb-4 font-light">{text}</p>}
        <NewsletterForm className="mx-auto max-w-md text-white" />
      </div>
    </section>
  );
}

export async function Footer() {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || SITE_NAME;
  const address = [settings?.legalName, ...addressLines(settings?.address)].filter(Boolean);
  const socialLinks = settings?.socialLinks?.filter((link) => link.url && SOCIAL_LABELS[link.platform]) ?? [];
  const menus = (settings?.footerMenus ?? [])
    .map((menu) => ({
      ...menu,
      links: (menu.links ?? []).flatMap((link) => {
        const href = resolveHref(link);
        return href && link.label ? [{ key: link._key, label: link.label, href }] : [];
      }),
    }))
    .filter((menu) => menu.links.length);
  const copyright = settings?.copyright?.replace("{year}", String(new Date().getFullYear()));

  return (
    <>
      <Subscribe heading={settings?.newsletterHeading} text={settings?.newsletterText} />
      <footer className="text-white">
        <div className="bg-secondary">
          <div className="container-site grid gap-8 py-10 md:grid-cols-3">
            <div>
              <Image
                src="/img/logo-bg-white.png"
                alt={siteName}
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
                  {address.length > 0 && (
                    <p>
                      {address.map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  )}
                  {settings?.phone && (
                    <p className="mt-4">
                      Ph:{" "}
                      <a href={telHref(settings.phone)} className="underline hover:no-underline">
                        {settings.phone}
                      </a>
                    </p>
                  )}
                  {settings?.fax && <p>Fax: {settings.fax}</p>}
                  {settings?.email && (
                    <p>
                      <a href={`mailto:${settings.email}`} className="underline hover:no-underline">
                        {settings.email}
                      </a>
                    </p>
                  )}
                </address>
              </div>

              {menus.map((menu) => (
                <nav key={menu._key} aria-labelledby={`footer-menu-${menu._key}`}>
                  <h2 id={`footer-menu-${menu._key}`} className={headingClass}>
                    {menu.title}
                  </h2>
                  <ul>
                    {menu.links.map((link) => (
                      <li key={link.key}>
                        {isExternalHref(link.href) ? (
                          <a href={link.href} className={linkClass} target="_blank" rel="noopener noreferrer">
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className={linkClass}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </div>
        {copyright && <p className="bg-[#333333] p-4 text-center text-xs font-light">{copyright}</p>}
      </footer>
    </>
  );
}
