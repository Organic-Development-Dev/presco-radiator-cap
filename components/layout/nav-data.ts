import type { Category } from "@/lib/types";

export type NavLink = { label: string; href: string };
export type NavGroup = { title: string; href?: string; links: NavLink[] };
export type NavItem =
  | { label: string; href: string; kind: "link" }
  | { label: string; kind: "menu"; links: NavLink[] }
  | { label: string; kind: "products"; groups: NavGroup[] };

const categoryHref = (slug: string) => `/product-category/${slug}/`;

/** Used when Sanity has no categories (or is unreachable): the legacy hardcoded menu. */
const FALLBACK_PRODUCT_GROUPS: NavGroup[] = [
  {
    title: "Auto",
    links: [
      { label: "Expansion Tank", href: categoryHref("expansion-tank") },
      { label: "Fuel Caps", href: categoryHref("fuel-caps") },
      { label: "Radiator Wing Caps", href: categoryHref("radiator-wing-caps") },
      { label: "Japanese Caps", href: categoryHref("japanese-caps") },
      { label: "Reservoir Caps", href: categoryHref("reservior-caps") },
      { label: "Oil Caps", href: categoryHref("oil-caps") },
    ],
  },
  {
    title: "Agricultural",
    links: [
      { label: "Oil Caps", href: categoryHref("oil") },
      { label: "Fuel Caps", href: categoryHref("fuel") },
      { label: "Radiator Caps", href: categoryHref("radiator") },
      { label: "Engine Parts", href: categoryHref("other-applications") },
    ],
  },
  {
    title: "Other Applications",
    links: [
      { label: "Truck & Commercial", href: categoryHref("commercial-caps") },
      { label: "Radiator Necks", href: categoryHref("radiator-necks") },
      { label: "Sealing Caps", href: categoryHref("sealing-caps") },
      { label: "Ad Blue Caps", href: categoryHref("ad-blue-caps") },
    ],
  },
];

/**
 * Turn the flat category list into menu groups: each top-level category becomes a
 * group heading with its children listed beneath. Top-level categories without
 * children are collected into a trailing "More" group.
 */
export function buildProductGroups(categories: Category[]): NavGroup[] {
  if (!categories.length) return FALLBACK_PRODUCT_GROUPS;

  const slugs = new Set(categories.map((c) => c.slug));
  const topLevel = categories.filter((c) => !c.parent || !slugs.has(c.parent));
  const groups: NavGroup[] = [];
  const loose: NavLink[] = [];

  for (const parent of topLevel) {
    const children = categories.filter((c) => c.parent === parent.slug);
    if (children.length) {
      groups.push({
        title: parent.title,
        href: categoryHref(parent.slug),
        links: children.map((c) => ({ label: c.title, href: categoryHref(c.slug) })),
      });
    } else {
      loose.push({ label: parent.title, href: categoryHref(parent.slug) });
    }
  }

  if (loose.length) groups.push({ title: groups.length ? "More" : "Categories", links: loose });
  return groups;
}

export function buildNavItems(categories: Category[]): NavItem[] {
  return [
    { label: "Products & Solutions", kind: "products", groups: buildProductGroups(categories) },
    {
      label: "Quality",
      kind: "menu",
      links: [
        { label: "Inspection & Testing", href: "/inspection-testing/" },
        { label: "Packaging", href: "/packaging/" },
      ],
    },
    {
      label: "About Us",
      kind: "menu",
      links: [
        { label: "History", href: "/about-us/" },
        { label: "Meet the team", href: "/about-us/" },
        { label: "Visit us", href: "/contact-us/" },
      ],
    },
    { label: "News", href: "/news/", kind: "link" },
    { label: "Contact Us", href: "/contact-us/", kind: "link" },
  ];
}
