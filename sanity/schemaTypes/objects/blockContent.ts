import { defineArrayMember, defineField, defineType } from "sanity";

/** Rich text used for page bodies, posts and product descriptions. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
              defineField({ name: "blank", title: "Open in new tab", type: "boolean" }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alternative text", type: "string" }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineArrayMember({
      name: "video",
      title: "Video",
      type: "object",
      fields: [
        defineField({ name: "url", title: "Video URL (mp4, YouTube or Vimeo)", type: "url" }),
        defineField({ name: "file", title: "Or upload a file", type: "file", options: { accept: "video/*" } }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
      preview: { select: { title: "caption", subtitle: "url" }, prepare: (v) => ({ title: v.title || "Video", subtitle: v.subtitle }) },
    }),
    defineArrayMember({
      name: "table",
      title: "Table",
      type: "object",
      fields: [
        defineField({
          name: "rows",
          type: "array",
          description: "The first row is shown as the header.",
          of: [
            defineArrayMember({
              name: "row",
              type: "object",
              fields: [
                defineField({ name: "cells", type: "array", of: [defineArrayMember({ type: "string" })] }),
                defineField({
                  name: "image",
                  type: "image",
                  description: "Shown in the table's image column.",
                  fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
                }),
              ],
              preview: {
                select: { cells: "cells", media: "image" },
                prepare: ({ cells, media }) => ({ title: (cells ?? []).join(" | "), media }),
              },
            }),
          ],
        }),
        defineField({
          name: "imageColumn",
          title: "Image column",
          type: "number",
          description: "Optional: which column (1 = first) shows each row's image.",
          validation: (rule) => rule.integer().min(1),
        }),
      ],
      preview: {
        select: { rows: "rows" },
        prepare: ({ rows }) => ({ title: "Table", subtitle: `${rows?.length ?? 0} rows` }),
      },
    }),
  ],
});
