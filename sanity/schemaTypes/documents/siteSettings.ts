import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact details" },
    { name: "navigation", title: "Menus" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "siteName", type: "string", group: "general", initialValue: "Presco Radiator Caps", validation: (rule) => rule.required() }),
    defineField({
      name: "legalName",
      title: "Company legal name",
      type: "string",
      group: "general",
      description: "e.g. Presco Radiator Caps Ltd. Shown on the contact page and used in search engine data.",
    }),

    // Contact
    defineField({ name: "email", title: "Email", type: "string", group: "contact", validation: (rule) => rule.email() }),
    defineField({ name: "phone", title: "Phone", type: "string", group: "contact" }),
    defineField({ name: "fax", title: "Fax", type: "string", group: "contact" }),
    defineField({
      name: "address",
      type: "object",
      group: "contact",
      options: { columns: 2 },
      fields: [
        defineField({ name: "streetAddress", title: "Street address", type: "string" }),
        defineField({ name: "locality", title: "Town / city", type: "string" }),
        defineField({ name: "region", title: "County / region", type: "string" }),
        defineField({ name: "postalCode", title: "Postcode", type: "string" }),
        defineField({ name: "country", type: "string", initialValue: "England" }),
        defineField({ name: "countryCode", title: "Country code", type: "string", initialValue: "GB", description: "Two-letter ISO code" }),
      ],
    }),
    defineField({ name: "openingHours", title: "Opening hours", type: "text", rows: 3, group: "contact" }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
      group: "contact",
      description: "In Google Maps: Share → Embed a map → copy the src=\"…\" address.",
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: ["facebook", "instagram", "linkedin", "x", "youtube"] },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "url", type: "url", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),

    // Menus
    defineField({ name: "mainMenu", title: "Main menu", type: "array", group: "navigation", of: [defineArrayMember({ type: "menuItem" })] }),
    defineField({ name: "footerMenus", title: "Footer menus", type: "array", group: "navigation", of: [defineArrayMember({ type: "footerColumn" })] }),

    // Footer
    defineField({ name: "footerText", title: "Footer text", type: "text", rows: 3, group: "footer" }),
    defineField({ name: "newsletterHeading", title: "Newsletter heading", type: "string", group: "footer" }),
    defineField({ name: "newsletterText", title: "Newsletter text", type: "string", group: "footer" }),
    defineField({
      name: "copyright",
      type: "string",
      group: "footer",
      description: "Use {year} for the current year.",
    }),

    // SEO
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
      description: "Used when a page doesn't set its own description or share image.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
