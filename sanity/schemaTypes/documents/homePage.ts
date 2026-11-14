import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heading",
      title: "Main heading (H1)",
      type: "string",
      group: "content",
      description: "The page's main heading. Hidden visually but read by search engines and screen readers — describe what Presco does.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSlides",
      title: "Banner slides",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "heroSlide" })],
    }),
    defineField({ name: "featuresHeading", title: "\"Why choose us\" heading", type: "string", group: "content" }),
    defineField({
      name: "features",
      title: "\"Why choose us\" items",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          name: "feature",
          type: "object",
          fields: [
            defineField({ name: "icon", type: "image" }),
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "text", media: "icon" } },
        }),
      ],
    }),
    defineField({ name: "productsHeading", title: "Product tiles heading", type: "string", group: "content" }),
    defineField({
      name: "productTiles",
      title: "Product tiles",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          name: "productTile",
          type: "object",
          fields: [
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "internal", title: "Links to", type: "reference", to: [{ type: "productCategory" }, { type: "page" }], weak: true }),
          ],
          preview: { select: { title: "label", media: "image" } },
        }),
      ],
    }),
    defineField({ name: "intro", title: "Extra content", description: "Shown under the product tiles.", type: "blockContent", group: "content" }),
    defineField({ name: "newsHeading", title: "News section heading", type: "string", group: "content", initialValue: "Latest News" }),
    defineField({ name: "testimonialsHeading", title: "Testimonials heading", type: "string", group: "content" }),
    defineField({ name: "testimonialsSubheading", title: "Testimonials subheading", type: "string", group: "content" }),
    defineField({
      name: "testimonials",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })],
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
