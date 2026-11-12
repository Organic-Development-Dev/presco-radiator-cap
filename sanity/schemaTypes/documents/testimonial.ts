import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons/Comment";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({ name: "quote", type: "text", rows: 6, validation: (rule) => rule.required() }),
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Job title", type: "string" }),
    defineField({ name: "company", type: "string" }),
  ],
  preview: { select: { title: "name", subtitle: "company" } },
});
