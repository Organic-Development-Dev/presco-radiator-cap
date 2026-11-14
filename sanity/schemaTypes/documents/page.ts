import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "team", title: "Team" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description:
        "URL path, e.g. about-us. The pages with slugs 'products', 'news' and 'contact-us' control those sections' title, intro and SEO.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short lead paragraph shown under the title. Also used as the meta description if none is set.",
    }),
    defineField({
      name: "heroImage",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    defineField({ name: "body", type: "blockContent", group: "content" }),
    defineField({
      name: "teamHeading",
      title: "Team heading",
      type: "string",
      group: "team",
      description: "Shown above the team grid. Link to it from a menu with the anchor 'team'.",
    }),
    defineField({
      name: "teamMembers",
      title: "Team members",
      type: "array",
      group: "team",
      description: "Shown as cards after the page content, in this order.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "teamMember" }] })],
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
    defineField({ name: "wpId", title: "WordPress ID", type: "number", readOnly: true, hidden: true }),
  ],
  preview: { select: { title: "title", slug: "slug.current" }, prepare: ({ title, slug }) => ({ title, subtitle: `/${slug ?? ""}/` }) },
});
