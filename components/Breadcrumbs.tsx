import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "./JsonLd";

export type Crumb = { label: string; href?: string };

/** Grey breadcrumb bar shown under the header, with BreadcrumbList structured data. "Home" is prepended. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <div className="bg-surface">
      <nav aria-label="Breadcrumb" className="container-site py-3 text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                {crumb.href && !last ? (
                  <Link href={crumb.href} className="text-secondary hover:text-primary hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className="font-medium text-primary">
                    {crumb.label}
                  </span>
                )}
                {!last && (
                  <span aria-hidden="true" className="text-gray-400">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.label,
            ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
          })),
        }}
      />
    </div>
  );
}
