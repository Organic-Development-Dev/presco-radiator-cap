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
      description: "Defaults to the page title. Aim for under 60 characters; the site name is added automatically.",
      validation: (rule) => rule.max(60).warning("Long titles get truncated in search results"),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.min(50).max(160).warning("Aim for 50–160 characters"),
    }),
    defineField({
      name: "image",
      title: "Social share image",
      type: "image",
      description: "Shown when the page is shared on social media. 1200 × 630 px works best.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
