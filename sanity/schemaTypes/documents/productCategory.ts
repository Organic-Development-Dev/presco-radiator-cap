import { defineField, defineType } from "sanity";
import { FolderIcon } from "@sanity/icons/Folder";

export const productCategory = defineType({
  name: "productCategory",
  title: "Product category",
  type: "document",
  icon: FolderIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "productNoun",
      title: "Product name (singular)",
      type: "string",
      description:
        "What one product in this category is called, e.g. \"Expansion Tank Cap\". Used in page titles and image alt text for products without a part type (\"PRC820 Expansion Tank Cap\").",
    }),
    defineField({
      name: "parent",
      title: "Parent category",
      type: "reference",
      to: [{ type: "productCategory" }],
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description: "Intro shown above the products. Also used as the meta description if none is set.",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first in menus.",
    }),
    defineField({
      name: "hidden",
      title: "Hide from menus",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "seo", type: "seo" }),
    defineField({ name: "wpId", title: "WordPress ID", type: "number", readOnly: true, hidden: true }),
  ],
  orderings: [{ title: "Sort order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "parent.title", media: "image" } },
});
