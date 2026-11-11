import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Defaults to the document title. Aim for under 60 characters.",
      validation: (rule) => rule.max(70).warning("Long titles get truncated in search results"),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Aim for under 160 characters"),
    }),
    defineField({ name: "image", title: "Social share image", type: "image" }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
