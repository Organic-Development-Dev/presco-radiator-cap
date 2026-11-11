import { defineField, defineType } from "sanity";
import { ComposeIcon } from "@sanity/icons";

export const post = defineType({
  name: "post",
  title: "News post",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({ name: "seo", type: "seo" }),
    defineField({ name: "wpId", title: "WordPress ID", type: "number", readOnly: true }),
  ],
  orderings: [{ title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "mainImage" } },
});
