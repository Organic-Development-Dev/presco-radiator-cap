import { defineField, defineType } from "sanity";
import { TransferIcon } from "@sanity/icons/Transfer";
import { internalField, requireTarget, urlField } from "../objects/navigation";

/**
 * Old address -> new address. Applied when the site is built (next.config.ts), so saving one
 * triggers a rebuild via the Vercel deploy hook; it goes live a couple of minutes later.
 */
export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: TransferIcon,
  fields: [
    defineField({
      name: "from",
      title: "Old address",
      type: "string",
      description: "The path only, starting with / (e.g. /old-page/ or /wp-content/uploads/catalogue.pdf).",
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          if (!value) return true;
          if (!value.startsWith("/") || /^\/\//.test(value)) return "Start with / and leave out the domain";
          if (/[?#\s]/.test(value)) return "Path only: no ?, # or spaces";
          if (/^\/(studio|api|_next)(\/|$)/.test(value)) return "This path is reserved";
          const id = context.document?._id.replace(/^drafts\./, "");
          const client = context.getClient({ apiVersion: "2026-11-01" });
          const clash = await client.fetch<number>(
            `count(*[_type == "redirect" && lower(from) in $variants && !(_id in [$id, "drafts." + $id])])`,
            { id, variants: [value.toLowerCase(), value.toLowerCase().replace(/\/$/, ""), `${value.toLowerCase().replace(/\/$/, "")}/`] },
          );
          return clash ? "Another redirect already uses this address" : true;
        }),
    }),
    { ...internalField, title: "New page" },
    { ...urlField, title: "…or new URL" },
    defineField({
      name: "permanent",
      type: "boolean",
      initialValue: true,
      description: "Leave on for moved pages (tells search engines to update). Turn off for temporary redirects.",
    }),
  ],
  validation: requireTarget,
  preview: {
    select: { from: "from", page: "internal.title", url: "url" },
    prepare: ({ from, page, url }) => ({ title: from, subtitle: `→ ${page ?? url ?? "?"}` }),
  },
});
