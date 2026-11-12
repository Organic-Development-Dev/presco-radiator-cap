import { resolveHref } from "@/lib/links";
import type { Category, MenuItemData, NavLinkData } from "@/lib/types";

export type NavLink = { label: string; href: string };
export type NavGroup = { title: string; href?: string; links: NavLink[] };
export type NavItem =
  | { label: string; href: string; kind: "link" }
  | { label: string; kind: "menu"; links: NavLink[] }
  | { label: string; kind: "products"; groups: NavGroup[] };

const categoryHref = (slug: string) => `/product-category/${slug}/`;

/**
 * Turn the flat category list into menu groups: each top-level category becomes a
 * group heading with its children listed beneath. Top-level categories without
 * children are collected into a trailing "More" group.
 */
export function buildProductGroups(categories: Category[]): NavGroup[] {
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

const toLinks = (links: NavLinkData[] | null | undefined): NavLink[] =>
  (links ?? []).flatMap((link) => {
    const href = resolveHref(link);
    return href && link.label ? [{ label: link.label, href }] : [];
  });

/** Main menu from Site settings → Menus. Items whose target no longer exists are dropped. */
export function buildNavItems(menu: MenuItemData[] | null | undefined, categories: Category[]): NavItem[] {
  return (menu ?? []).flatMap((item): NavItem[] => {
    if (!item?.label) return [];
    if (item.kind === "products") return [{ label: item.label, kind: "products", groups: buildProductGroups(categories) }];
    if (item.kind === "dropdown") {
      const links = toLinks(item.children);
      return links.length ? [{ label: item.label, kind: "menu", links }] : [];
    }
    const href = resolveHref(item);
    return href ? [{ label: item.label, href, kind: "link" }] : [];
  });
}
