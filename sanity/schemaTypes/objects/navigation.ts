import { defineArrayMember, defineField, defineType, type ObjectRule } from "sanity";
import { LinkIcon } from "@sanity/icons/Link";
import { MenuIcon } from "@sanity/icons/Menu";

/** Document types a link can point at (each has a public URL). */
export const LINKABLE_TYPES = [
  { type: "homePage" },
  { type: "page" },
  { type: "post" },
  { type: "product" },
  { type: "productCategory" },
];

export const internalField = defineField({
  name: "internal",
  title: "Link to a page on this site",
  type: "reference",
  to: LINKABLE_TYPES,
  weak: true,
});

export const urlField = defineField({
  name: "url",
  title: "…or a URL",
  type: "string",
  description: "For external sites (https://…), email (mailto:…) or phone (tel:…). Ignored if a page is chosen above.",
  validation: (rule) =>
    rule.custom((value?: string) =>
      !value || /^(https?:\/\/|mailto:|tel:|\/)/.test(value) ? true : "Start with https://, mailto:, tel: or /",
    ),
});

export const requireTarget = (rule: ObjectRule) =>
  rule.custom((value?: { internal?: unknown; url?: string }) =>
    value?.internal || value?.url ? true : "Choose a page or enter a URL",
  );

/** A labelled link to an internal document or an external URL. */
export const navLink = defineType({
  name: "navLink",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    internalField,
    urlField,
    defineField({
      name: "anchor",
      type: "string",
      description: "Optional: jump to a section of the page, e.g. team.",
      validation: (rule) => rule.regex(/^[a-z0-9-]+$/, { name: "anchor" }).error("Lower-case letters, numbers and dashes only"),
    }),
  ],
  validation: requireTarget,
  preview: {
    select: { title: "label", internalTitle: "internal.title", url: "url" },
    prepare: ({ title, internalTitle, url }) => ({ title, subtitle: internalTitle ?? url }),
  },
});

/** Top-level item in the main menu. */
export const menuItem = defineType({
  name: "menuItem",
  title: "Menu item",
  type: "object",
  icon: MenuIcon,
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      initialValue: "link",
      options: {
        layout: "radio",
        list: [
          { title: "Single link", value: "link" },
          { title: "Dropdown of links", value: "dropdown" },
          { title: "Product categories (built automatically)", value: "products" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    { ...internalField, hidden: ({ parent }: { parent?: { kind?: string } }) => parent?.kind !== "link" },
    { ...urlField, hidden: ({ parent }: { parent?: { kind?: string } }) => parent?.kind !== "link" },
    defineField({
      name: "children",
      title: "Dropdown links",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
      hidden: ({ parent }) => parent?.kind !== "dropdown",
    }),
  ],
  preview: {
    select: { title: "label", kind: "kind" },
    prepare: ({ title, kind }) => ({
      title,
      subtitle: { link: "Link", dropdown: "Dropdown", products: "Product categories" }[kind as string],
    }),
  },
});

/** A titled column of links in the footer. */
export const footerColumn = defineType({
  name: "footerColumn",
  title: "Footer column",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "links", type: "array", of: [defineArrayMember({ type: "navLink" })] }),
  ],
});

/** Homepage banner slide. */
export const heroSlide = defineType({
  name: "heroSlide",
  title: "Banner slide",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      description: "Wide banner, 2.5:1 (e.g. 2000 × 800 px).",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Describe the banner for screen readers and search engines.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Phone image (optional)",
      type: "image",
      description:
        "Shown on phones instead of the wide banner, 5:3 (e.g. 1200 × 720 px). Use it when the wide banner has text that gets cut off on small screens. Uses the same alternative text.",
      options: { hotspot: true },
    }),
    internalField,
    urlField,
  ],
  preview: { select: { title: "image.alt", media: "image" } },
});
