import { defineField, defineType } from "sanity";
import { ComposeIcon } from "@sanity/icons/Compose";

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
      description: "Keep it short, e.g. exhibitions-2020. If you change it, add the old one to 'Previous URLs' below.",
      options: { source: "title", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "previousSlugs",
      title: "Previous URLs",
      type: "array",
      of: [{ type: "string" }],
      description: "Old slugs that should permanently redirect to this post (just the slug, not the full address).",
      options: { layout: "tags" },
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
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required().warning("Add alternative text for accessibility and SEO"),
        }),
      ],
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      description: "Shown on news listings and used as the meta description if none is set. Aim for under 160 characters.",
    }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({ name: "seo", type: "seo" }),
    defineField({ name: "wpId", title: "WordPress ID", type: "number", readOnly: true, hidden: true }),
  ],
  orderings: [{ title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "mainImage" } },
});
