import { defineArrayMember, defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";

const stringList = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    options: { layout: "tags" },
    group: "specs",
  });

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "specs", title: "Specifications" },
    { name: "commerce", title: "Pricing (future)" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Part number",
      type: "string",
      group: "main",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "reference", to: [{ type: "productCategory" }] })],
    }),
    defineField({
      name: "images",
      type: "array",
      group: "main",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              description: "Describe the image for screen readers and search engines, e.g. \"PAG9 radiator pressure cap\".",
              validation: (rule) => rule.required().warning("Add alternative text for accessibility and SEO"),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "summary",
      title: "Cross references",
      description: "Short lines shown on the product page, e.g. alternative part numbers, make, part type.",
      type: "blockContent",
      group: "main",
    }),
    defineField({ name: "description", type: "blockContent", group: "main" }),
    stringList("partType", "Part type", "e.g. Pressure Cap, Filler Neck"),
    stringList("oeNumbers", "OE numbers"),
    stringList("applications", "Applications", "Manufacturers / applications, e.g. CNH, Ford"),
    stringList("pressure", "Pressure"),
    stringList("modelInfo", "Model info"),
    defineField({
      name: "relatedProducts",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
      validation: (rule) => rule.unique().max(12),
    }),
    defineField({
      name: "price",
      title: "Price (GBP)",
      description: "Not shown on the site yet — reserved for online ordering.",
      type: "number",
      group: "commerce",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "purchasable",
      title: "Can be ordered online",
      type: "boolean",
      group: "commerce",
      initialValue: false,
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
    defineField({
      name: "wpId",
      title: "WordPress ID",
      description: "Set by the migration; used for redirects from old URLs.",
      type: "number",
      readOnly: true,
      group: "seo",
    }),
  ],
  orderings: [
    { title: "Part number", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "partType.0", media: "images.0" },
  },
});
