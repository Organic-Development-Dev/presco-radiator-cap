import { defineArrayMember, defineField, defineType } from "sanity";
import { ThListIcon } from "@sanity/icons/ThList";

/** Vehicle application guide: which Presco part fits which vehicle (from the old site's cross-reference pages). */
export const applicationGuide = defineType({
  name: "applicationGuide",
  title: "Vehicle application guide",
  type: "document",
  icon: ThListIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description: "Shown at /applications/<slug>/",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", type: "text", rows: 3, group: "content", description: "Also used as the meta description." }),
    defineField({ name: "order", type: "number", group: "content", description: "Lower numbers are listed first." }),
    defineField({
      name: "sections",
      type: "array",
      group: "content",
      description: "One section per vehicle make (or cap type).",
      of: [
        defineArrayMember({
          name: "section",
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string", description: "e.g. Audi, or Pressure Caps" }),
            defineField({
              name: "parts",
              type: "array",
              of: [
                defineArrayMember({
                  name: "part",
                  type: "object",
                  fields: [
                    defineField({ name: "product", type: "reference", to: [{ type: "product" }], weak: true }),
                    defineField({
                      name: "code",
                      title: "Part number",
                      type: "string",
                      description: "Shown if no product is linked, or the product is removed.",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({ name: "fits", title: "Fits / description", type: "string", description: "e.g. Audi: A4, A6, A8" }),
                    defineField({ name: "pressure", type: "string", description: "e.g. 1.5 bar / 22 psi" }),
                    defineField({ name: "oe", title: "OE / cross reference", type: "string" }),
                  ],
                  preview: {
                    select: { code: "code", fits: "fits", media: "product.images.0" },
                    prepare: ({ code, fits, media }) => ({ title: code, subtitle: fits, media }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "heading", parts: "parts" },
            prepare: ({ title, parts }) => ({ title: title || "(no heading)", subtitle: `${parts?.length ?? 0} parts` }),
          },
        }),
      ],
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", slug: "slug.current" }, prepare: ({ title, slug }) => ({ title, subtitle: `/applications/${slug ?? ""}/` }) },
});
