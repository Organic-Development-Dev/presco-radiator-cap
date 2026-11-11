import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({ name: "siteName", type: "string", initialValue: "Presco Radiator Caps" }),
    defineField({ name: "email", title: "Contact email", type: "string" }),
    defineField({ name: "phone", title: "Contact phone", type: "string" }),
    defineField({ name: "address", type: "text", rows: 4 }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: ["facebook", "instagram", "linkedin", "x", "youtube"] },
            }),
            defineField({ name: "url", type: "url" }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({ name: "footerText", type: "text", rows: 3 }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
