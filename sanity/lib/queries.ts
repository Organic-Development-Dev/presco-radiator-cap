import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `asset, hotspot, crop, alt, "lqip": asset->metadata.lqip, "dimensions": asset->metadata.dimensions`;

const productCard = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  "image": images[0]{ ${imageFields} },
  partType,
  applications
`;

const seoFields = /* groq */ `seo{ title, description, noIndex, image }`;


/** A link's target: an internal document (resolved to a URL in lib/links.ts) or a raw URL. */
const linkTarget = /* groq */ `"internal": internal->{ _type, "slug": coalesce(slug.current, language) }, url`;
const navLinkFields = /* groq */ `_key, label, anchor, ${linkTarget}`;

export const SITE_SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  siteName, legalName, email, phone, fax, address, openingHours, mapEmbedUrl, socialLinks,
  footerText, newsletterHeading, newsletterText, copyright,
  defaultSeo{ title, description, image },
  mainMenu[]{ _key, label, kind, ${linkTarget}, children[]{ ${navLinkFields} } },
  footerMenus[]{ _key, title, links[]{ ${navLinkFields} } }
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_id == "homePage"][0]{
  heading,
  heroSlides[defined(image.asset)]{ _key, image{ ${imageFields} }, mobileImage{ ${imageFields} }, ${linkTarget} },
  featuresHeading,
  features[]{ _key, title, text, icon{ ${imageFields} } },
  productsHeading,
  productTiles[defined(image.asset)]{ _key, label, image{ ${imageFields} }, ${linkTarget} },
  intro,
  newsHeading,
  testimonialsHeading,
  testimonialsSubheading,
  testimonials[]->{ _id, quote, name, role, company },
  ${seoFields}
}`);

export const CATEGORIES_QUERY = defineQuery(`*[_type == "productCategory" && hidden != true]
  | order(coalesce(order, 999) asc, title asc){
    _id, title, "slug": slug.current, "parent": parent->slug.current,
    "count": count(*[_type == "product" && references(^._id)])
  }`);

export const CATEGORY_QUERY = defineQuery(`*[_type == "productCategory" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, description, image{ ${imageFields} }, ${seoFields}
}`);

/**
 * Product listing with optional filters. Every filter param must be passed;
 * use null / empty array to disable it.
 */
export const PRODUCTS_QUERY = defineQuery(`*[_type == "product"
  && ($category == null || $category in categories[]->slug.current)
  && (count($applications) == 0 || count((applications[])[@ in $applications]) > 0)
  && (count($partTypes) == 0 || count((partType[])[@ in $partTypes]) > 0)
] | order(title asc){ ${productCard} }`);

/** Distinct filter values within an optional category. */
export const PRODUCT_FACETS_QUERY = defineQuery(`{
  "applications": array::unique(*[_type == "product" && ($category == null || $category in categories[]->slug.current)].applications[]),
  "partTypes": array::unique(*[_type == "product" && ($category == null || $category in categories[]->slug.current)].partType[])
}`);

export const PRODUCT_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  images[]{ ${imageFields} },
  summary,
  description,
  partType,
  oeNumbers,
  applications,
  pressure,
  modelInfo,
  "categories": categories[]->{ title, "slug": slug.current, productNoun, "isChild": defined(parent) },
  "related": relatedProducts[]->{ ${productCard} },
  "guides": *[_type == "applicationGuide" && references(^._id)] | order(order asc){ title, "slug": slug.current },
  ${seoFields}
}`);

export const PRODUCT_SLUG_BY_WP_ID_QUERY = defineQuery(
  `*[_type == "product" && wpId == $wpId][0].slug.current`,
);

export const PRODUCT_SLUGS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`,
);

/**
 * Search across part number, OE numbers, applications, part type and model info.
 * $term should already have wildcards applied, e.g. "pag9*".
 */
export const SEARCH_QUERY = defineQuery(`*[_type == "product" && (
  title match $term ||
  oeNumbers[] match $term ||
  applications[] match $term ||
  partType[] match $term ||
  modelInfo[] match $term ||
  pt::text(summary) match $term
)] | score(boost(title match $term, 5), boost(oeNumbers[] match $term, 3))
  | order(_score desc, title asc)[0...60]{ ${productCard} }`);

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id, _updatedAt, title, "slug": slug.current, intro, heroImage{ ${imageFields} }, body,
  teamHeading,
  teamMembers[]->{ _id, name, role, email, bio, photo{ ${imageFields} } },
  ${seoFields}
}`);

export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]
  | order(publishedAt desc)[0...$limit]{
    _id, title, "slug": slug.current, publishedAt, excerpt, mainImage{ ${imageFields} }
  }`);

export const POST_QUERY = defineQuery(`*[_type == "post" && (slug.current == $slug || $slug in previousSlugs)]
  | order(select(slug.current == $slug => 0, 1))[0]{
  _id, _updatedAt, title, "slug": slug.current, publishedAt, excerpt, mainImage{ ${imageFields} }, body, ${seoFields}
}`);

export const SITEMAP_QUERY = defineQuery(`{
  "home": *[_id == "homePage"][0]._updatedAt,
  "products": *[_type == "product" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "categories": *[_type == "productCategory" && defined(slug.current) && hidden != true && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "guides": *[_type == "applicationGuide" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "locales": *[_type == "localePage" && translationChecked == true && seo.noIndex != true]{ "slug": language, _updatedAt }
}`);

export const APPLICATION_GUIDES_QUERY = defineQuery(`*[_type == "applicationGuide" && defined(slug.current)] | order(order asc, title asc){
  _id, title, "slug": slug.current, intro,
  "makes": sections[defined(heading)].heading,
  "partCount": count(sections[].parts[])
}`);

export const APPLICATION_GUIDE_QUERY = defineQuery(`*[_type == "applicationGuide" && slug.current == $slug][0]{
  _id, _updatedAt, title, "slug": slug.current, intro,
  sections[]{ _key, heading, parts[]{
    _key, code, fits, pressure, oe,
    "product": product->{ title, "slug": slug.current, "image": images[0]{ ${imageFields} } }
  } },
  ${seoFields}
}`);

export const APPLICATION_GUIDE_SLUGS_QUERY = defineQuery(`*[_type == "applicationGuide" && defined(slug.current)]{ "slug": slug.current }`);

/** All language pages (title, language, whether checked) for hreflang, the footer and the page itself. */
export const LOCALE_PAGES_QUERY = defineQuery(`*[_type == "localePage" && defined(language)] | order(language asc){
  _id, _updatedAt, language, title, "checked": translationChecked == true, body, ${seoFields}
}`);

export const PAGE_SLUGS_QUERY = defineQuery(
  `*[_type == "page" && defined(slug.current)]{ "slug": slug.current }`,
);

export const POST_SLUGS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`,
);

/** The posts either side of $slug by publish date (for previous / next links). */
export const POST_NEIGHBOURS_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  "newer": *[_type == "post" && defined(slug.current) && publishedAt > ^.publishedAt]
    | order(publishedAt asc)[0]{ title, "slug": slug.current },
  "older": *[_type == "post" && defined(slug.current) && publishedAt < ^.publishedAt]
    | order(publishedAt desc)[0]{ title, "slug": slug.current }
}`);
