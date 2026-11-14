import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { HomeIcon } from "@sanity/icons/Home";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homePage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("productCategory").title("Product categories"),
      S.documentTypeListItem("applicationGuide").title("Vehicle applications"),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("localePage").title("Language pages"),
      S.documentTypeListItem("post").title("News"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.divider(),
      S.documentTypeListItem("enquiry").title("Enquiries"),
      S.documentTypeListItem("redirect").title("Redirects"),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
