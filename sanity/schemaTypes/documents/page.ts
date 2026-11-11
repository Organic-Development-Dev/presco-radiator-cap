import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      description: "URL path, e.g. about-us. Use 'home' for the homepage intro content.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({ name: "seo", type: "seo" }),
    defineField({ name: "wpId", title: "WordPress ID", type: "number", readOnly: true }),
  ],
  preview: { select: { title: "title", slug: "slug.current" }, prepare: ({ title, slug }) => ({ title, subtitle: `/${slug ?? ""}` }) },
});
