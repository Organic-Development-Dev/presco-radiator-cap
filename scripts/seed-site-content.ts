/**
 * One-off: move the content the old frontend hard-coded (menus, contact details,
 * homepage banners, testimonial, section titles) into Sanity, and tidy the SEO data
 * that came over from WordPress. Run after `npm run migrate`.
 *
 *   npm run seed            # write
 *   npm run seed -- --dry-run
 *
 * Safe to re-run: fields that already have a value are left alone (setIfMissing),
 * so edits made in the Studio are never overwritten.
 */
import { createReadStream } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import { tidyLabel } from "../lib/text";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const DRY_RUN = process.argv.includes("--dry-run");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");

const sanity = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-11-01",
  token,
  useCdn: false,
});

let keyCounter = 0;
const key = () => `seed${(keyCounter++).toString(36).padStart(4, "0")}`;
const ref = (id: string) => ({ _type: "reference", _ref: id, _weak: true });
const link = (label: string, target: string) =>
  target.startsWith("/") || target.includes("://")
    ? { _type: "navLink", _key: key(), label, url: target }
    : { _type: "navLink", _key: key(), label, internal: ref(target) };

async function uploadImage(file: string, filename: string) {
  if (DRY_RUN) return "image-dry-run";
  const asset = await sanity.assets.upload("image", createReadStream(path.join("public", "img", file)), { filename });
  return asset._id;
}

/** Existing image asset with this original filename, so re-runs don't upload duplicates. */
async function findOrUploadImage(file: string, filename: string) {
  const existing = await sanity.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  );
  return existing ?? uploadImage(file, filename);
}

const log = (msg: string) => console.log(`${DRY_RUN ? "[dry run] " : ""}${msg}`);

async function main() {
  const categoryIds = Object.fromEntries(
    (await sanity.fetch<{ _id: string; slug: string }[]>(`*[_type == "productCategory"]{ _id, "slug": slug.current }`)).map(
      (c) => [c.slug, c._id],
    ),
  );
  const cat = (slug: string) => {
    if (!categoryIds[slug]) throw new Error(`Category "${slug}" not found — run the migration first`);
    return categoryIds[slug];
  };

  const tx = sanity.transaction();

  // -------------------------------------------------------------------------
  // Listing pages: /products/ and /news/ take their title, intro and SEO from these
  // -------------------------------------------------------------------------
  tx.createIfNotExists({
    _id: "page-products",
    _type: "page",
    title: "Products & Solutions",
    slug: { _type: "slug", current: "products" },
    intro:
      "Radiator caps, expansion tank caps, fuel caps, oil caps and filler necks for cars, commercial vehicles and agricultural machinery. Filter by application or part type, or search by part or OE number.",
    seo: {
      _type: "seo",
      title: "Radiator, Fuel & Oil Caps",
      description:
        "Browse 400+ radiator, expansion tank, fuel and oil caps for cars, trucks and tractors. Filter by application or part type and enquire today.",
    },
  });
  tx.createIfNotExists({
    _id: "page-news",
    _type: "page",
    title: "News",
    slug: { _type: "slug", current: "news" },
    intro: "Company news, exhibitions and technical articles from Presco Radiator Caps.",
    seo: {
      _type: "seo",
      description: "News from Presco Radiator Caps: upcoming trade exhibitions, company updates and technical articles about radiator caps.",
    },
  });

  // -------------------------------------------------------------------------
  // Existing pages: friendlier titles, contact intro, real meta descriptions
  // -------------------------------------------------------------------------
  const pageFixes: Record<string, { title?: string; intro?: string; description: string }> = {
    "page-contact-us": {
      title: "Contact Us",
      intro:
        "Have a question? We're here to help. Our team is ready to answer your enquiries about our products, orders and delivery, and you can also reach our engineering and development team using the form below.",
      description:
        "Contact Presco Radiator Caps in Worcester, UK. Call +44 (0)1905 755656 or send an enquiry about products, orders, delivery or engineering.",
    },
    "page-privacy-policy": {
      title: "Privacy Policy",
      description: "How Presco Radiator Caps Ltd collects, uses and protects your personal data, and your rights under UK GDPR.",
    },
    "page-terms-and-conditions": {
      title: "Terms and Conditions",
      description: "Download the standard terms and conditions for the supply of goods from Presco Radiator Caps Ltd.",
    },
    "page-disclaimer": {
      description: "Website disclaimer for Presco Radiator Caps Ltd: the information on this site is provided for general information only.",
    },
    "page-packaging": {
      description: "Presco packaging options: bulk cartons and individually sealed bags, with carton sizes and quantities per cap type for UK and export orders.",
    },
    "page-inspection-testing": {
      description: "ISO 9001:2015 certified. Presco radiator caps are pressure and leak tested to 1/100 PSI, with water testing for metal and expansion tank caps.",
    },
  };
  const pages = await sanity.fetch<{ _id: string; title: string; intro?: string; seo?: { description?: string } }[]>(
    `*[_id in $ids]{ _id, title, intro, seo }`,
    { ids: Object.keys(pageFixes) },
  );
  for (const page of pages) {
    const fix = pageFixes[page._id];
    const set: Record<string, unknown> = {};
    // Only replace titles that are still the WordPress originals.
    if (fix.title && ["Contact", "PRIVACY POLICY", "Terms and conditions"].includes(page.title)) set.title = fix.title;
    // Replace WordPress's auto-excerpt descriptions (long, or ending in "[…]").
    const current = page.seo?.description ?? "";
    if (!current || current.length > 160 || current.includes("[…]")) set["seo.description"] = fix.description;
    tx.patch(page._id, (p) => {
      p = p.setIfMissing({ seo: { _type: "seo" } });
      if (fix.intro) p = p.setIfMissing({ intro: fix.intro });
      return Object.keys(set).length ? p.set(set) : p;
    });
  }

  // The WordPress contact page body was just the address and opening hours, which now
  // come from Site settings. Drop it if it's still that copy.
  const contactBody = await sanity.fetch<string | null>(`pt::text(*[_id == "page-contact-us"][0].body)`);
  if (contactBody?.includes("Blackpole Trading Estate")) tx.patch("page-contact-us", (p) => p.unset(["body"]));

  // -------------------------------------------------------------------------
  // Testimonial
  // -------------------------------------------------------------------------
  tx.createIfNotExists({
    _id: "testimonial-coolline",
    _type: "testimonial",
    quote:
      "We are proud to be a partner with Presco as our radiator Cap supplier in the UK. Their commitment to excellence and reliability has been instrumental in meeting our radiator Cap needs efficiently. With their high-quality products and exceptional service, Presco has consistently exceeded our expectations, ensuring our facilities remain comfortable and energy-efficient. We highly recommend Presco to any organization seeking top-notch radiator-cap solutions and outstanding customer support",
    name: "Subair .U",
    role: "Chairman & MD",
    company: "CoolLine Group – U.A.E",
  });

  // -------------------------------------------------------------------------
  // Homepage (the intro comes from the WordPress home page via the migration)
  // -------------------------------------------------------------------------
  const banners = [
    { file: "banner1.webp", alt: "Presco Radiator Caps - Premium Automotive Components", target: "page-products" },
    { file: "banner2.webp", alt: "High-Performance Radiator Caps for All Vehicle Types", target: cat("auto") },
    { file: "banner3.webp", alt: "Quality Engineered Cooling System Components", target: "page-products" },
  ];
  const heroSlides: Record<string, unknown>[] = [];
  for (const [i, banner] of banners.entries()) {
    const assetId = await findOrUploadImage(banner.file, `home-banner-${i + 1}.webp`);
    heroSlides.push({
      _type: "heroSlide",
      _key: key(),
      image: { _type: "image", asset: { _type: "reference", _ref: assetId }, alt: banner.alt },
      internal: ref(banner.target),
    });
  }
  // Older migrations created the homepage as a normal page; carry its body over.
  const legacyHome = await sanity.fetch<{ body?: unknown[] } | null>(`*[_id == "page-home"][0]{ body }`);
  tx.createIfNotExists({ _id: "homePage", _type: "homePage" });
  tx.patch("homePage", (p) =>
    p.setIfMissing({
      heading: "Presco Radiator Caps – UK supplier of radiator, fuel and oil caps",
      heroSlides,
      ...(legacyHome?.body ? { intro: legacyHome.body } : {}),
      newsHeading: "Latest News",
      testimonialsHeading: "Testimonials",
      testimonialsSubheading: "What our clients say",
      testimonials: [{ _type: "reference", _ref: "testimonial-coolline", _key: key() }],
      seo: {
        _type: "seo",
        title: "Presco Radiator Caps | Radiator, Fuel & Oil Caps UK",
        description:
          "UK supplier of radiator, expansion tank, fuel and oil caps for over 30 years. ISO 9001 certified, 100% pressure tested. Car, commercial and agricultural.",
      },
    }),
  );
  if (legacyHome) tx.delete("page-home");

  // The WordPress homepage body was page-builder columns ("Why choose" + product tiles).
  // As rich text it renders as one long column, so split it into structured sections.
  type Block = { _type: string; _key: string; style?: string; children?: { text?: string }[]; asset?: unknown; alt?: string };
  const home = await sanity.fetch<{ intro?: Block[]; features?: unknown[] } | null>(`*[_id == "homePage"][0]{ intro, features }`);
  const introBlocks = home?.intro ?? (legacyHome?.body as Block[] | undefined) ?? [];
  if (!home?.features?.length && introBlocks.some((b) => b.style === "h2")) {
    const text = (b?: Block) => (b?.children ?? []).map((c) => c.text ?? "").join("").trim();
    const titleCase = (s: string) => (s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s);
    const tileLinks: Record<string, string> = {
      "Auto Europe": "auto",
      "Japanese Auto": "japanese-caps",
      "Trucks & Commercial": "commercial-caps",
      Agricultural: "agricultural",
    };
    const headings: string[] = [];
    const features: Record<string, unknown>[] = [];
    const tiles: Record<string, unknown>[] = [];
    const rest: Block[] = [];
    for (let i = 0; i < introBlocks.length; i++) {
      const block = introBlocks[i];
      if (block.style === "h2" && headings.length < 2) {
        headings.push(titleCase(text(block)));
        continue;
      }
      if (block._type === "image" && headings.length === 1) {
        // icon, TITLE, description
        features.push({
          _type: "feature",
          _key: key(),
          icon: { _type: "image", asset: block.asset },
          title: titleCase(text(introBlocks[i + 1])),
          text: text(introBlocks[i + 2]),
        });
        i += 2;
        continue;
      }
      if (block._type === "image" && headings.length === 2) {
        const label = titleCase(text(introBlocks[i + 1]));
        const slug = tileLinks[label];
        tiles.push({
          _type: "productTile",
          _key: key(),
          image: { _type: "image", asset: block.asset, alt: `${label} radiator caps` },
          label,
          ...(slug && categoryIds[slug] ? { internal: ref(categoryIds[slug]) } : {}),
        });
        i += 1;
        continue;
      }
      rest.push(block);
    }
    tx.patch("homePage", (p) =>
      p.set({ featuresHeading: headings[0], features, productsHeading: headings[1], productTiles: tiles, intro: rest }),
    );
    log(`homepage: ${features.length} features, ${tiles.length} product tiles, ${rest.length} remaining intro blocks`);
  }

  // -------------------------------------------------------------------------
  // Site settings: contact details, menus, footer, SEO defaults
  // -------------------------------------------------------------------------
  const shareImage = await findOrUploadImage("banner1.png", "default-share-image.png");
  tx.createIfNotExists({ _id: "siteSettings", _type: "siteSettings", siteName: "Presco Radiator Caps" });
  tx.patch("siteSettings", (p) =>
    p.setIfMissing({
      legalName: "Presco Radiator Caps Ltd",
      email: "sales@presco-radiator-caps.com",
      phone: "+44 (0)1905 755656",
      fax: "+44 (0)1905 755654",
      address: {
        streetAddress: "Unit D86, Blackpole Trading Estate West",
        locality: "Worcester",
        country: "England",
        postalCode: "WR3 8TJ",
        countryCode: "GB",
      },
      openingHours:
        "Monday to Thursday: 8am – 4.45pm\nFriday: 8am – 12.30pm\nOutside these hours please leave a phone message or email us. There is parking on site.",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.3733757979894!2d-2.2033938233371284!3d52.21843397198367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870f1b1c73476f9%3A0x66d2825735993d1e!2sPresco%20Radiator%20Caps%20Ltd!5e0!3m2!1sen!2suk!4v1726054912549!5m2!1sen!2suk",
      mainMenu: [
        { _type: "menuItem", _key: key(), label: "Products & Solutions", kind: "products" },
        {
          _type: "menuItem",
          _key: key(),
          label: "Quality",
          kind: "dropdown",
          children: [link("Inspection & Testing", "page-inspection-testing"), link("Packaging", "page-packaging")],
        },
        {
          _type: "menuItem",
          _key: key(),
          label: "About Us",
          kind: "dropdown",
          children: [link("History", "page-about-us"), link("Meet the team", "page-about-us"), link("Visit us", "page-contact-us")],
        },
        { _type: "menuItem", _key: key(), label: "News", kind: "link", internal: ref("page-news") },
        { _type: "menuItem", _key: key(), label: "Contact Us", kind: "link", internal: ref("page-contact-us") },
      ],
      footerMenus: [
        {
          _type: "footerColumn",
          _key: key(),
          title: "Our Products",
          links: [
            link("Europe Auto", cat("auto")),
            link("Japanese Auto", cat("japanese-caps")),
            link("Agricultural", cat("agricultural")),
            link("Trucks & Commercials", cat("commercial-caps")),
          ],
        },
        {
          _type: "footerColumn",
          _key: key(),
          title: "Important Links",
          links: [
            link("Packaging", "page-packaging"),
            link("Inspection & Testing", "page-inspection-testing"),
            link("About Us", "page-about-us"),
            link("News", "page-news"),
            link("Contact Us", "page-contact-us"),
            link("Privacy Policy", "page-privacy-policy"),
            link("Terms and Conditions", "page-terms-and-conditions"),
            link("Disclaimer", "page-disclaimer"),
          ],
        },
      ],
      newsletterHeading: "Subscribe",
      newsletterText: "Want to stay up to date? Subscribe to our Newsletter!",
      copyright: "Copyright © presco-radiator-caps.com 2010–{year}. All Rights Reserved",
      defaultSeo: {
        _type: "seo",
        description:
          "Presco Radiator Caps Ltd: UK supplier of radiator, expansion tank, fuel and oil caps for automotive, commercial and agricultural vehicles.",
        image: { _type: "image", asset: { _type: "reference", _ref: shareImage } },
      },
    }),
  );

  // -------------------------------------------------------------------------
  // Categories: unique titles for the duplicate names, fix a typo
  // -------------------------------------------------------------------------
  const categorySeoTitles: Record<string, string> = {
    "fuel-caps": "Car Fuel Caps",
    fuel: "Agricultural Fuel Caps",
    "oil-caps": "Car Oil Caps",
    oil: "Agricultural Oil Caps",
    radiator: "Agricultural Radiator Caps",
    "radiator-necks-agricultural": "Agricultural Radiator Necks",
    "radiator-necks": "Radiator Necks & Filler Necks",
    auto: "European Car Radiator Caps",
    "japanese-caps": "Japanese Car Radiator Caps",
    "commercial-caps": "Truck & Commercial Vehicle Caps",
    "other-applications": "Agricultural Engine Parts",
  };
  for (const [slug, title] of Object.entries(categorySeoTitles)) {
    if (!categoryIds[slug]) continue;
    tx.patch(categoryIds[slug], (p) => p.setIfMissing({ seo: { _type: "seo" } }).setIfMissing({ "seo.title": title }));
  }
  const categoryNouns: Record<string, string> = {
    auto: "Radiator Cap",
    "japanese-caps": "Radiator Cap",
    radiator: "Radiator Cap",
    "commercial-caps": "Commercial Vehicle Radiator Cap",
    "expansion-tank": "Expansion Tank Cap",
    "radiator-wing-caps": "Radiator Wing Cap",
    "reservior-caps": "Reservoir Cap",
    "fuel-caps": "Fuel Cap",
    fuel: "Fuel Cap",
    "oil-caps": "Oil Cap",
    oil: "Oil Cap",
    "radiator-necks": "Radiator Neck",
    "radiator-necks-agricultural": "Radiator Neck",
    "sealing-caps": "Sealing Cap",
    "ad-blue-caps": "AdBlue Cap",
    "other-applications": "Engine Part",
  };
  for (const [slug, noun] of Object.entries(categoryNouns)) {
    if (categoryIds[slug]) tx.patch(categoryIds[slug], (p) => p.setIfMissing({ productNoun: noun }));
  }
  if (categoryIds["reservior-caps"]) {
    tx.patch(categoryIds["reservior-caps"], (p) => p.set({ title: "Reservoir Caps" }));
  }

  // -------------------------------------------------------------------------
  // Posts: title clean-up, drop WordPress's placeholder descriptions
  // -------------------------------------------------------------------------
  const posts = await sanity.fetch<{ _id: string; title: string; seo?: { description?: string } }[]>(
    `*[_type == "post"]{ _id, title, seo }`,
  );
  const postTitles: Record<string, { title?: string; seoTitle?: string }> = {
    "WHY BUY FROM ISO9001 APPROVED SUPPLIER": { title: "Why Buy From an ISO 9001 Approved Supplier?" },
    "Presco Radiator Caps will be showing at the following exhibition shows during 2020": { seoTitle: "Exhibitions in 2020" },
    "EQUIP AUTO SHOW, ALGERIA, 02/03/2020 – 05/03/2020. Stand details will follow": {
      title: "Equip Auto Show, Algeria, 2–5 March 2020",
    },
  };
  for (const post of posts) {
    const fix = postTitles[post.title];
    const set: Record<string, unknown> = {};
    const unset: string[] = [];
    if (post.title.includes("￼")) set.title = post.title.replace(/￼/g, "").trim();
    if (fix?.title) set.title = fix.title;
    if (post.seo?.description && / - Presco Radiator Caps$|\[…\]/.test(post.seo.description)) unset.push("seo.description");
    if (fix?.seoTitle) set["seo.title"] = fix.seoTitle;
    if (!Object.keys(set).length && !unset.length) continue;
    tx.patch(post._id, (p) => p.setIfMissing({ seo: { _type: "seo" } }).set(set).unset(unset));
  }

  // -------------------------------------------------------------------------
  // Products: descriptive image alt text, drop WordPress's auto descriptions
  // -------------------------------------------------------------------------
  const products = await sanity.fetch<
    {
      _id: string;
      title: string;
      partType?: string[];
      seo?: { description?: string };
      images?: { _key: string; alt?: string }[];
      categorySlugs?: { slug: string; isChild: boolean }[];
    }[]
  >(`*[_type == "product"]{ _id, title, partType, seo, images[]{ _key, alt }, "categorySlugs": categories[]->{ "slug": slug.current, "isChild": defined(parent) } }`);
  let altFixes = 0;
  let seoFixes = 0;
  for (const product of products) {
    const categories = [...(product.categorySlugs ?? [])].sort((a, b) => Number(b.isChild) - Number(a.isChild));
    const noun = tidyLabel(product.partType?.[0]) || categories.map((c) => categoryNouns[c.slug]).find(Boolean) || "";
    const alt = [product.title, noun].filter(Boolean).join(" ");
    const set: Record<string, string> = {};
    for (const image of product.images ?? []) {
      if ((!image.alt || image.alt === product.title) && alt !== product.title) {
        set[`images[_key=="${image._key}"].alt`] = alt;
        altFixes++;
      }
    }
    // WooCommerce had no hand-written meta descriptions; these are copies of the short description.
    const unset = product.seo?.description ? ["seo.description"] : [];
    if (unset.length) seoFixes++;
    if (Object.keys(set).length || unset.length) tx.patch(product._id, (p) => p.set(set).unset(unset));
  }

  // -------------------------------------------------------------------------
  // Posts: shorter slugs; the old ones 308-redirect via previousSlugs
  // -------------------------------------------------------------------------
  const newPostSlugs: Record<string, string> = {
    "presco-radiator-caps-will-be-showing-at-the-following-exhibition-shows-during-2020": "exhibitions-2020",
    "equip-auto-show-algeria-02-03-2020-05-03-2020-stand-details-will-follow": "equip-auto-algeria-2020",
  };
  const postSlugs = await sanity.fetch<{ _id: string; slug: string }[]>(`*[_type == "post"]{ _id, "slug": slug.current }`);
  for (const post of postSlugs) {
    const next = newPostSlugs[post.slug];
    if (!next) continue;
    tx.patch(post._id, (p) =>
      p
        .set({ slug: { _type: "slug", current: next } })
        .setIfMissing({ previousSlugs: [] })
        .append("previousSlugs", [post.slug]),
    );
  }

  // -------------------------------------------------------------------------
  // About Us: the "Meet the Team" part of the body becomes teamMember documents
  // shown as cards (the WordPress layout came across as huge stacked photos)
  // -------------------------------------------------------------------------
  type BodyBlock = { _type: string; style?: string; children?: { text?: string }[]; asset?: { _ref: string }; alt?: string };
  const about = await sanity.fetch<{ _id: string; body?: BodyBlock[] } | null>(
    `*[_type == "page" && slug.current == "about-us" && !(_id in path("drafts.**"))][0]{ _id, body }`,
  );
  const text = (b: BodyBlock) => (b.children ?? []).map((c) => c.text ?? "").join("").trim();
  const teamStart = about?.body?.findIndex((b) => b.style === "h2" && /meet the team/i.test(text(b))) ?? -1;
  if (about?.body && teamStart >= 0) {
    const members: { name: string; role?: string; email?: string; photo?: BodyBlock; bio: string[] }[] = [];
    let photo: BodyBlock | undefined;
    for (const block of about.body.slice(teamStart + 1)) {
      if (block._type === "image") photo = block;
      else if (block.style === "h3") {
        members.push({ name: text(block), photo, bio: [] });
        photo = undefined;
      } else if (block._type === "block" && members.length) {
        const current = members[members.length - 1];
        const t = text(block);
        if (!t || t === "Presco Radiator Caps") continue; // WordPress team-box filler
        if (current.role === undefined) {
          const [role, email] = t.split("\n").map((s) => s.trim());
          current.role = role.replace("Adminstration", "Administration");
          current.email = email?.includes("@") ? email : undefined;
        } else current.bio.push(t);
      }
    }
    const ids = members.map((m) => `team-${m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    members.forEach((m, i) =>
      tx.createIfNotExists({
        _id: ids[i],
        _type: "teamMember",
        name: m.name,
        role: m.role,
        email: m.email,
        bio: m.bio.join("\n\n"),
        ...(m.photo?.asset ? { photo: { _type: "image", asset: m.photo.asset, alt: m.photo.alt || m.name } } : {}),
      }),
    );
    tx.patch(about._id, (p) =>
      p
        .setIfMissing({
          teamHeading: text(about.body![teamStart]),
          teamMembers: ids.map((id) => ({ _type: "reference", _ref: id, _key: key() })),
        })
        .set({ body: about.body!.slice(0, teamStart) }),
    );
    log(`About Us: ${members.length} team members moved out of the page body`);
  }

  // -------------------------------------------------------------------------
  // Packaging: the table's "Image" column lost its photos in the migration
  // -------------------------------------------------------------------------
  type TableRow = { _key: string; cells?: string[]; image?: unknown };
  const packaging = await sanity.fetch<{ _id: string; tables?: { _key: string; imageColumn?: number; rows?: TableRow[] }[] } | null>(
    `*[_type == "page" && slug.current == "packaging" && !(_id in path("drafts.**"))][0]{ _id, "tables": body[_type == "table"] }`,
  );
  const table = packaging?.tables?.[0];
  const imageCol = table?.rows?.[0]?.cells?.findIndex((c) => /^image$/i.test(c.trim())) ?? -1;
  if (packaging && table?.rows && imageCol >= 0 && !table.rows.some((r) => r.image)) {
    const wpBase = (process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || "https://bd.presco-radiator-caps.com").replace(/\/$/, "");
    const html: string = await fetch(`${wpBase}/wp-json/wp/v2/pages?slug=packaging&_fields=content`)
      .then((res) => (res.ok ? res.json() : []))
      .then(([wpPage]) => wpPage?.content?.rendered ?? "")
      .catch(() => "");
    if (!html) log("Packaging: WordPress not reachable, table images skipped");
    const wpRows = html.slice(html.indexOf("<table"), html.indexOf("</table>")).match(/<tr[\s\S]*?<\/tr>/g) ?? [];
    const set: Record<string, unknown> = { [`body[_key=="${table._key}"].imageColumn`]: imageCol + 1 };
    for (const [i, row] of table.rows.entries()) {
      const src = wpRows[i]?.match(/<img[^>]*src="([^"]+)"/)?.[1]?.replace(/-\d+x\d+(\.\w+)$/, "$1");
      if (!src) continue;
      const filename = src.split("/").pop()!;
      let assetId = await sanity.fetch<string | null>(`*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`, { filename });
      if (!assetId && !DRY_RUN) {
        const res = await fetch(src);
        if (!res.ok) continue;
        assetId = (await sanity.assets.upload("image", Buffer.from(await res.arrayBuffer()), { filename }))._id;
      }
      const alt = row.cells?.[0]?.replace(/^\d+\.\s*/, "").trim();
      set[`body[_key=="${table._key}"].rows[_key=="${row._key}"].image`] = { _type: "image", asset: { _type: "reference", _ref: assetId ?? "image-dry-run" }, alt };
    }
    tx.patch(packaging._id, (p) => p.set(set));
    log(`Packaging: ${Object.keys(set).length - 1} table images restored`);
  }

  // "Meet the team" menu link jumps to the team section
  const menu = await sanity.fetch<{ _key: string; children?: { _key: string; label: string; anchor?: string }[] }[] | null>(
    `*[_id == "siteSettings"][0].mainMenu`,
  );
  for (const item of menu ?? []) {
    for (const child of item.children ?? []) {
      if (/meet the team/i.test(child.label) && !child.anchor) {
        tx.patch("siteSettings", (p) => p.set({ [`mainMenu[_key=="${item._key}"].children[_key=="${child._key}"].anchor`]: "team" }));
      }
    }
  }

  log(`${tx.toJSON().length} mutations (${altFixes} image alt texts, ${seoFixes} product descriptions removed)`);
  if (!DRY_RUN) {
    await tx.commit();
    log("Done.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
