import { defineField, defineType } from "sanity";
import { TranslateIcon } from "@sanity/icons/Translate";
import { LOCALES } from "../../../lib/locales";

/**
 * Introduction page in another language, at /<language>/ (e.g. /fr/).
 * Hidden from search engines, the sitemap and the footer until "Translation checked" is ticked.
 */
export const localePage = defineType({
  name: "localePage",
  title: "Language page",
  type: "document",
  icon: TranslateIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "language",
      type: "string",
      group: "content",
      options: { list: LOCALES.map((l) => ({ title: `${l.name} (${l.code})`, value: l.code })) },
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          if (!value) return true;
          const id = context.document?._id.replace(/^drafts\./, "");
          const clash = await context
            .getClient({ apiVersion: "2026-11-01" })
            .fetch<number>(`count(*[_type == "localePage" && language == $value && !(_id in [$id, "drafts." + $id])])`, { value, id });
          return clash ? "There is already a page for this language" : true;
        }),
    }),
    defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({
      name: "translationChecked",
      title: "Translation checked",
      type: "boolean",
      group: "content",
      initialValue: false,
      description:
        "Tick once a native speaker has checked the text. Until then the page is hidden from Google, the sitemap and the footer language links (it still works if you visit the address).",
    }),
    defineField({ name: "body", type: "blockContent", group: "content" }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", language: "language", checked: "translationChecked" },
    prepare: ({ title, language, checked }) => ({ title, subtitle: `/${language ?? "?"}/ · ${checked ? "checked" : "not checked yet"}` }),
  },
});
