import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Job title", type: "string" }),
    defineField({ name: "email", type: "string", validation: (rule) => rule.email() }),
    defineField({
      name: "photo",
      type: "image",
      options: { hotspot: true },
      description: "Square photos work best. Shown as a circle.",
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string", description: "Usually the person's name." })],
    }),
    defineField({ name: "bio", type: "text", rows: 8, description: "Leave a blank line between paragraphs." }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
