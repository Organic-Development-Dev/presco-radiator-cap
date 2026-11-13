/**
 * One-off migration: WordPress / WooCommerce  ->  Sanity.
 *
 * Safe to re-run: every document gets a deterministic _id (e.g. "product-wp-7314")
 * and is written with createOrReplace; images are de-duplicated by their WordPress URL.
 *
 *   npm run migrate -- --dry-run     # fetch + convert only, writes scripts/.cache/*.json
 *   npm run migrate                  # write to Sanity (needs SANITY_API_WRITE_TOKEN)
 *   npm run migrate -- --only=posts  # products | categories | pages | posts
 *
 * Reads .env.local (Sanity) and .env (WordPress / WooCommerce keys).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SanityClient } from "@sanity/client";
import { htmlToBlocks, type DeserializerRule } from "@portabletext/block-tools";
import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";
import { config as loadEnv } from "dotenv";
import { JSDOM } from "jsdom";
import pLimit from "p-limit";
import { tidyLabel } from "../lib/text";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const CACHE_DIR = path.join("scripts", ".cache");

const WP_URL = (process.env.WP_URL || process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || "").replace(/\/$/, "");
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
if (!WP_URL || !WC_KEY || !WC_SECRET) {
  throw new Error("Set WP_URL, WC_CONSUMER_KEY and WC_CONSUMER_SECRET (see .env.example)");
}

/** WordPress page ID -> slug on the new site. These are the pages the old frontend used. */
const PAGES: Record<number, string> = {
  6932: "home",
  1195: "about-us",
  2: "inspection-testing",
  76: "contact-us",
  1277: "packaging",
  5720: "privacy-policy",
  5726: "disclaimer",
};
/** Pages the old frontend looked up by slug rather than ID. */
const PAGES_BY_SLUG: Record<string, string> = { "terms-and-conditions": "terms-and-conditions" };

/** WooCommerce attribute slug -> Sanity product field. */
const ATTRIBUTE_FIELDS: Record<string, string> = {
  pa_description: "partType",
  pa_oe_number: "oeNumbers",
  pa_application: "applications",
  pa_pressure: "pressure",
  pa_model_info: "modelInfo",
};

const UNCATEGORIZED_SLUG = "uncategorized";

// ---------------------------------------------------------------------------
// Sanity
// ---------------------------------------------------------------------------

let sanity: SanityClient | undefined;
if (!DRY_RUN) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) {
    throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN, or use --dry-run");
  }
  sanity = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2026-11-01",
    token,
    useCdn: false,
  });
}

/** Compiled copy of sanity/schemaTypes/objects/blockContent.ts for the HTML converter. */
const blockContentType = Schema.compile({
  name: "migration",
  types: [
    ...builtinTypes,
    {
      name: "blockContent",
      type: "array",
      of: [
        {
          type: "block",
          styles: ["normal", "h2", "h3", "h4", "blockquote"].map((value) => ({ title: value, value })),
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: ["strong", "em", "underline"].map((value) => ({ title: value, value })),
            annotations: [
              {
                name: "link",
                type: "object",
                fields: [
                  { name: "href", type: "url" },
                  { name: "blank", type: "boolean" },
                ],
              },
            ],
          },
        },
        { type: "image", fields: [{ name: "alt", type: "string" }] },
        { name: "video", type: "object", fields: [{ name: "url", type: "url" }, { name: "file", type: "file" }] },
        {
          name: "table",
          type: "object",
          fields: [
            {
              name: "rows",
              type: "array",
              of: [
                {
                  name: "row",
                  type: "object",
                  fields: [
                    { name: "cells", type: "array", of: [{ type: "string" }] },
                    { name: "image", type: "image", fields: [{ name: "alt", type: "string" }] },
                  ],
                },
              ],
            },
            { name: "imageColumn", type: "number" },
          ],
        },
      ],
    },
  ],
}).get("blockContent");

// ---------------------------------------------------------------------------
// WordPress fetching
// ---------------------------------------------------------------------------

const wcAuth = "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

async function getJson<T>(url: string, auth = false): Promise<{ data: T; totalPages: number }> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: auth ? { Authorization: wcAuth } : {} });
    if (res.ok) {
      return { data: (await res.json()) as T, totalPages: Number(res.headers.get("x-wp-totalpages") || 1) };
    }
    if (attempt >= 3 || res.status < 500) {
      throw new Error(`GET ${url.replace(/consumer_\w+=[^&]+/g, "")} -> ${res.status} ${res.statusText}`);
    }
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
}

async function getAll<T>(endpoint: string, params: Record<string, string> = {}, auth = false): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; ; page++) {
    const qs = new URLSearchParams({ per_page: "100", page: String(page), ...params });
    const { data, totalPages } = await getJson<T[]>(`${WP_URL}/wp-json/${endpoint}?${qs}`, auth);
    out.push(...data);
    if (page >= totalPages) return out;
  }
}

type WcImage = { id: number; src: string; alt: string; name: string };
type WcProduct = {
  id: number;
  name: string;
  slug: string;
  status: string;
  description: string;
  short_description: string;
  categories: { id: number; slug: string }[];
  images: WcImage[];
  attributes: { slug: string; name: string; options: string[] }[];
  related_ids: number[];
  menu_order: number;
  yoast_head_json?: { title?: string; description?: string; og_description?: string };
};
type WcCategory = {
  id: number;
  count: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  menu_order: number;
  image: WcImage | null;
};
type WpPost = {
  id: number;
  slug: string;
  date_gmt: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  yoast_head_json?: { title?: string; description?: string; og_description?: string };
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const parseHtml = (html: string): Document => new JSDOM(html).window.document as unknown as Document;

function decodeEntities(text: string): string {
  // U+FFFC is left behind by images pasted into WordPress titles.
  return (parseHtml(`<p>${text}</p>`).body.textContent ?? "").replace(/\uFFFC/g, "").trim();
}

const plainText = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Remove page-builder noise (inline <style>, scripts, empty wrappers) before conversion. */
function cleanHtml(html: string): string {
  const doc = parseHtml(html);
  doc.querySelectorAll("style, script, noscript, link, meta, .av-special-heading-tag + .special-heading-border").forEach((el) => el.remove());
  return doc.body.innerHTML;
}

/** "foo-300x200.jpg" -> "foo.jpg" so we upload the original size. */
const originalImageUrl = (src: string) => src.replace(/-\d+x\d+(\.\w+)(\?.*)?$/, "$1");

function cleanSlug(slug: string): string {
  return decodeURIComponent(slug)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

const assetByUrl = new Map<string, string>();
const limit = pLimit(6);
let uploaded = 0;

async function loadExistingAssets() {
  if (!sanity) return;
  const assets = await sanity.fetch<{ _id: string; url: string }[]>(
    `*[_type == "sanity.imageAsset" && source.name == "wordpress"]{ _id, "url": source.url }`,
  );
  for (const a of assets) assetByUrl.set(a.url, a._id);
  console.log(`  ${assets.length} images already in Sanity`);
}

async function uploadImage(src: string): Promise<string | undefined> {
  const url = originalImageUrl(src);
  const cached = assetByUrl.get(url) ?? assetByUrl.get(src);
  if (cached) return cached;
  if (!sanity) {
    const fake = `image-dryrun-${assetByUrl.size}`;
    assetByUrl.set(url, fake);
    return fake;
  }
  for (const candidate of url === src ? [src] : [url, src]) {
    const res = await fetch(candidate);
    if (!res.ok) continue;
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await sanity.assets.upload("image", buffer, {
      filename: path.basename(new URL(candidate).pathname),
      source: { name: "wordpress", id: candidate, url },
    });
    assetByUrl.set(url, asset._id);
    if (++uploaded % 25 === 0) console.log(`  uploaded ${uploaded} images...`);
    return asset._id;
  }
  console.warn(`  ! could not download image ${src}`);
  return undefined;
}

const imageField = (assetId: string, alt?: string) => ({
  _type: "image",
  _key: key(),
  asset: { _type: "reference", _ref: assetId },
  ...(alt ? { alt } : {}),
});

// ---------------------------------------------------------------------------
// HTML -> Portable Text
// ---------------------------------------------------------------------------

/** Matches the old site's domains (bd., www. or bare), optionally with /index.php. */
const SITE_URL_RE = /^https?:\/\/(?:bd\.|www\.)?presco-radiator-caps\.com(?:\/index\.php)?/i;
const isUpload = (url: string) => SITE_URL_RE.test(url) && url.includes("/wp-content/uploads/");

/** Uploaded files (PDFs, videos) keyed by WordPress URL. */
const fileByUrl = new Map<string, { _id: string; url: string }>();

async function uploadFile(src: string) {
  const cached = fileByUrl.get(src);
  if (cached) return cached;
  if (!sanity) {
    const fake = { _id: `file-dryrun-${fileByUrl.size}`, url: `https://cdn.sanity.io/files/dryrun/${path.basename(src)}` };
    fileByUrl.set(src, fake);
    return fake;
  }
  const existing = await sanity.fetch<{ _id: string; url: string } | null>(
    `*[_type == "sanity.fileAsset" && source.url == $src][0]{ _id, url }`,
    { src },
  );
  if (existing) {
    fileByUrl.set(src, existing);
    return existing;
  }
  const res = await fetch(src);
  if (!res.ok) {
    console.warn(`  ! could not download file ${src}`);
    return undefined;
  }
  const asset = await sanity.assets.upload("file", Buffer.from(await res.arrayBuffer()), {
    filename: decodeURIComponent(path.basename(new URL(src).pathname)),
    source: { name: "wordpress", id: src, url: src },
  });
  const entry = { _id: asset._id, url: asset.url };
  fileByUrl.set(src, entry);
  return entry;
}

/**
 * Before conversion: upload images / linked files / videos, rewrite links to old-site
 * pages as relative paths and links to uploaded files as Sanity CDN URLs.
 */
async function prepareHtml(html: string): Promise<string> {
  const doc = parseHtml(cleanHtml(html));

  const imgSrcs = Array.from(doc.querySelectorAll("img"))
    .map((img) => img.getAttribute("src"))
    .filter((s): s is string => !!s && !s.startsWith("data:"));
  await Promise.all(imgSrcs.map((s) => limit(() => uploadImage(s))));

  const videoSrcs = Array.from(doc.querySelectorAll("video[src], video source[src]"))
    .map((el) => el.getAttribute("src")!)
    .filter(isUpload);
  await Promise.all(videoSrcs.map((s) => limit(() => uploadFile(s))));

  for (const a of Array.from(doc.querySelectorAll("a[href]"))) {
    // Repair "http://https://..." links that exist in the WordPress content.
    const href = a.getAttribute("href")!.trim().replace(/^https?:\/\/(?=https?:\/\/)/i, "");
    a.setAttribute("href", href);
    if (isUpload(href)) {
      if (/\.(jpe?g|png|gif|webp)$/i.test(href)) {
        a.replaceWith(...Array.from(a.childNodes)); // image lightbox links: keep the image, drop the link
        continue;
      }
      const file = await limit(() => uploadFile(href));
      if (file) a.setAttribute("href", file.url);
    } else if (SITE_URL_RE.test(href)) {
      a.setAttribute("href", href.replace(SITE_URL_RE, "") || "/");
    }
  }
  return doc.body.innerHTML;
}

async function toBlocks(html: string | undefined) {
  if (!html?.trim()) return undefined;
  const cleaned = await prepareHtml(html);

  const rules: DeserializerRule[] = [
    {
      deserialize(el) {
        if (el.nodeName.toLowerCase() !== "table") return undefined;
        const rows = Array.from((el as HTMLTableElement).querySelectorAll("tr"))
          .map((tr) => ({
            _type: "row",
            _key: key(),
            cells: Array.from(tr.querySelectorAll("th, td")).map((cell) =>
              (cell.textContent ?? "").replace(/\s+/g, " ").trim(),
            ),
          }))
          .filter((row) => row.cells.some(Boolean));
        return rows.length ? { _type: "table", _key: key(), rows } : undefined;
      },
    },
    {
      deserialize(el) {
        if (el.nodeName.toLowerCase() !== "img") return undefined;
        const img = el as HTMLImageElement;
        const src = img.getAttribute("src") ?? "";
        const assetId = assetByUrl.get(originalImageUrl(src)) ?? assetByUrl.get(src);
        if (!assetId) return undefined;
        return { ...imageField(assetId, img.getAttribute("alt") || undefined) };
      },
    },
    {
      deserialize(el) {
        const tag = el.nodeName.toLowerCase();
        if (tag !== "video" && tag !== "iframe") return undefined;
        const e = el as HTMLElement;
        const url = e.getAttribute("src") || e.querySelector("source")?.getAttribute("src");
        if (!url) return undefined;
        const file = fileByUrl.get(url);
        return file
          ? { _type: "video", _key: key(), file: { _type: "file", asset: { _type: "reference", _ref: file._id } } }
          : { _type: "video", _key: key(), url };
      },
    },
  ];

  const blocks = htmlToBlocks(cleaned, blockContentType, { parseHtml, rules, keyGenerator: key });
  // Drop empty paragraphs left behind by page-builder wrappers.
  const meaningful = blocks.filter(
    (b) =>
      b._type !== "block" ||
      ((b as { children?: { text?: string }[] }).children ?? []).some((c) => c.text?.trim()),
  );
  return meaningful.length ? meaningful : undefined;
}

/**
 * Only keep meta descriptions someone actually wrote in Yoast. Its fallbacks (the
 * og_description excerpt, or "<title> - <site name>") are worse than the site's own
 * generated descriptions.
 */
const seoFrom = (y?: { title?: string; description?: string; og_description?: string }) => {
  const description = y?.description ? decodeEntities(y.description) : "";
  if (!description || / - Presco Radiator Caps$/.test(description)) return undefined;
  return { _type: "seo", description };
};

// ---------------------------------------------------------------------------
// Migrations
// ---------------------------------------------------------------------------

type Doc = { _id: string; _type: string; [k: string]: unknown };
type Patch = { id: string; set: Record<string, unknown> };

const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
const catId = (wpId: number) => `productCategory-wp-${wpId}`;
const productId = (wpId: number) => `product-wp-${wpId}`;

async function migrateCategories(): Promise<{ docs: Doc[]; patches: Patch[] }> {
  console.log("Categories...");
  // Skip empty categories (leftover theme demo data such as "men", "women", "casual").
  const all = await getAll<WcCategory>("wc/v3/products/categories", {}, true);
  const cats = all.filter((c) => c.count > 0);
  const skipped = all.filter((c) => c.count === 0).map((c) => c.slug);
  if (skipped.length) console.log(`  skipping empty categories: ${skipped.join(", ")}`);
  const docs: Doc[] = [];
  for (const c of cats) {
    const imageId = c.image?.src ? await uploadImage(c.image.src) : undefined;
    docs.push({
      _id: catId(c.id),
      _type: "productCategory",
      title: decodeEntities(c.name),
      slug: { _type: "slug", current: c.slug },
      description: plainText(c.description) || undefined,
      order: c.menu_order,
      hidden: c.slug === UNCATEGORIZED_SLUG,
      ...(imageId ? { image: { _type: "image", asset: { _type: "reference", _ref: imageId } } } : {}),
      wpId: c.id,
    });
  }
  const patches = cats
    .filter((c) => c.parent && cats.some((p) => p.id === c.parent))
    .map((c) => ({ id: catId(c.id), set: { parent: { _type: "reference", _ref: catId(c.parent) } } }));
  console.log(`  ${docs.length} categories`);
  return { docs, patches };
}

async function migrateProducts(): Promise<{ docs: Doc[]; patches: Patch[] }> {
  console.log("Products...");
  const products = await getAll<WcProduct>("wc/v3/products", { status: "publish" }, true);
  console.log(`  ${products.length} published products, converting...`);
  const ids = new Set(products.map((p) => p.id));

  const docs = await Promise.all(
    products.map(async (p): Promise<Doc> => {
      const specs: Record<string, string[]> = {};
      for (const attr of p.attributes) {
        const field = ATTRIBUTE_FIELDS[attr.slug];
        if (!field) {
          console.warn(`  ! ${p.slug}: unmapped attribute "${attr.name}" (${attr.slug})`);
          continue;
        }
        specs[field] = attr.options.map((o) => plainText(o)).filter(Boolean);
      }

      // Alt text: "PAG9 Pressure Cap" rather than just the part number.
      const name = decodeEntities(p.name);
      const defaultAlt = [name, tidyLabel(specs.partType?.[0])].filter(Boolean).join(" ");
      const images = (
        await Promise.all(
          p.images.map(async (img) => {
            const assetId = await limit(() => uploadImage(img.src));
            return assetId ? imageField(assetId, img.alt || defaultAlt) : undefined;
          }),
        )
      ).filter(Boolean);

      return {
        _id: productId(p.id),
        _type: "product",
        title: decodeEntities(p.name),
        slug: { _type: "slug", current: p.slug },
        categories: p.categories.filter((c) => c.slug !== UNCATEGORIZED_SLUG).map((c) => ref(catId(c.id))),
        images,
        summary: await toBlocks(p.short_description),
        description: await toBlocks(p.description),
        ...specs,
        purchasable: false,
        seo: seoFrom(p.yoast_head_json),
        wpId: p.id,
      };
    }),
  );

  const patches = products
    .map((p) => ({
      id: productId(p.id),
      set: { relatedProducts: p.related_ids.filter((id) => ids.has(id)).map((id) => ref(productId(id))) },
    }))
    .filter((patch) => (patch.set.relatedProducts as unknown[]).length);

  return { docs, patches };
}

async function migratePages(): Promise<Doc[]> {
  console.log("Pages...");
  const docs: Doc[] = [];
  const fetchPage = async (wpPage: WpPost, slug: string) => {
    if (slug === "home") {
      // The WordPress homepage body becomes the Homepage document's intro.
      const intro = await toBlocks(wpPage.content.rendered);
      if (sanity && intro) {
        await sanity.createIfNotExists({ _id: "homePage", _type: "homePage" });
        await sanity.patch("homePage").set({ intro: clean(intro) }).commit();
      }
      console.log(`  home -> homePage.intro (${intro?.length ?? 0} blocks)`);
      return;
    }
    docs.push({
      _id: `page-${slug}`,
      _type: "page",
      title: decodeEntities(wpPage.title.rendered),
      slug: { _type: "slug", current: slug },
      body: await toBlocks(wpPage.content.rendered),
      seo: seoFrom(wpPage.yoast_head_json),
      wpId: wpPage.id,
    });
  };
  for (const [wpId, slug] of Object.entries(PAGES)) {
    try {
      const { data } = await getJson<WpPost>(`${WP_URL}/wp-json/wp/v2/pages/${wpId}`);
      await fetchPage(data, slug);
    } catch (e) {
      console.warn(`  ! page ${wpId} (${slug}): ${(e as Error).message}`);
    }
  }
  for (const [wpSlug, slug] of Object.entries(PAGES_BY_SLUG)) {
    const { data } = await getJson<WpPost[]>(`${WP_URL}/wp-json/wp/v2/pages?slug=${wpSlug}`);
    if (data[0]) await fetchPage(data[0], slug);
    else console.warn(`  ! page with slug "${wpSlug}" not found`);
  }
  console.log(`  ${docs.length} pages`);
  return docs;
}

async function migratePosts(): Promise<Doc[]> {
  console.log("Posts...");
  const posts = await getAll<WpPost>("wp/v2/posts", { status: "publish" });
  const docs: Doc[] = [];
  for (const p of posts) {
    let mainImage;
    if (p.featured_media) {
      try {
        const { data: media } = await getJson<{ source_url: string; alt_text: string }>(
          `${WP_URL}/wp-json/wp/v2/media/${p.featured_media}`,
        );
        const assetId = await uploadImage(media.source_url);
        if (assetId) mainImage = { _type: "image", asset: { _type: "reference", _ref: assetId }, alt: media.alt_text || undefined };
      } catch (e) {
        console.warn(`  ! featured image for ${p.slug}: ${(e as Error).message}`);
      }
    }
    docs.push({
      _id: `post-wp-${p.id}`,
      _type: "post",
      title: decodeEntities(p.title.rendered),
      slug: { _type: "slug", current: cleanSlug(p.slug) },
      publishedAt: new Date(p.date_gmt + "Z").toISOString(),
      excerpt: plainText(p.excerpt.rendered).replace(/\s*\[&hellip;\]|\s*\[…\]$/, "…") || undefined,
      mainImage,
      body: await toBlocks(p.content.rendered),
      seo: seoFrom(p.yoast_head_json),
      wpId: p.id,
    });
  }
  console.log(`  ${docs.length} posts`);
  return docs;
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/** Strip undefined values so createOrReplace doesn't choke. */
const clean = <T>(value: T): T => JSON.parse(JSON.stringify(value));

async function write(docs: Doc[], patches: Patch[] = []) {
  if (!sanity) return;
  for (let i = 0; i < docs.length; i += 50) {
    const tx = sanity.transaction();
    for (const doc of docs.slice(i, i + 50)) tx.createOrReplace(clean(doc));
    await tx.commit({ visibility: "async" });
  }
  for (let i = 0; i < patches.length; i += 100) {
    const tx = sanity.transaction();
    for (const p of patches.slice(i, i + 100)) tx.patch(p.id, (patch) => patch.set(clean(p.set)));
    await tx.commit({ visibility: "async" });
  }
}

async function main() {
  console.log(`${DRY_RUN ? "[dry run] " : ""}Migrating from ${WP_URL}`);
  await mkdir(CACHE_DIR, { recursive: true });
  await loadExistingAssets();

  const run = (name: string) => !ONLY || ONLY === name;
  const all: Doc[] = [];
  const allPatches: Patch[] = [];

  // Categories must exist before products reference them.
  if (run("categories") || run("products")) {
    const { docs, patches } = await migrateCategories();
    await write(docs);
    all.push(...docs);
    allPatches.push(...patches);
  }
  if (run("products")) {
    const { docs, patches } = await migrateProducts();
    await write(docs);
    all.push(...docs);
    allPatches.push(...patches);
  }
  if (run("pages")) {
    const docs = await migratePages();
    await write(docs);
    all.push(...docs);
  }
  if (run("posts")) {
    const docs = await migratePosts();
    await write(docs);
    all.push(...docs);
  }

  // References between documents of the same type (category parents, related products).
  await write([], allPatches);

  if (sanity) {
    await sanity.createIfNotExists({ _id: "siteSettings", _type: "siteSettings", siteName: "Presco Radiator Caps" });
  }

  await writeFile(path.join(CACHE_DIR, "migration-output.json"), JSON.stringify({ docs: all, patches: allPatches }, null, 2));
  const counts = all.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});
  console.log("\nDone.", counts, `${allPatches.length} reference patches`, DRY_RUN ? "" : `${uploaded} images uploaded`);
  console.log(`Output saved to ${CACHE_DIR}/migration-output.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
