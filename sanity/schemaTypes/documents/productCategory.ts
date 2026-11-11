import { defineField, defineType } from "sanity";
import { FolderIcon } from "@sanity/icons";

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
      name: "parent",
      title: "Parent category",
      type: "reference",
      to: [{ type: "productCategory" }],
    }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", type: "text", rows: 3 }),
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
    defineField({ name: "wpId", title: "WordPress ID", type: "number", readOnly: true }),
  ],
  orderings: [{ title: "Sort order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "parent.title", media: "image" } },
});
