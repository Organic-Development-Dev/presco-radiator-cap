import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/** Written by the contact / enquiry forms. Read-only in the Studio. */
export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({
      name: "kind",
      type: "string",
      options: { list: ["contact", "enquiry", "order"] },
    }),
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({ name: "product", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "submittedAt", type: "datetime" }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", kind: "kind", product: "product.title", date: "submittedAt" },
    prepare: ({ name, kind, product, date }) => ({
      title: `${name ?? "Unknown"}${product ? ` — ${product}` : ""}`,
      subtitle: `${kind ?? ""} · ${date ? new Date(date).toLocaleString("en-GB") : ""}`,
    }),
  },
});
