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

export const SITE_SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  siteName, email, phone, address, socialLinks, footerText, defaultSeo
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
  "categories": categories[]->{ title, "slug": slug.current },
  "related": relatedProducts[]->{ ${productCard} },
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
  _id, title, "slug": slug.current, heroImage{ ${imageFields} }, body, ${seoFields}
}`);

export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]
  | order(publishedAt desc)[0...$limit]{
    _id, title, "slug": slug.current, publishedAt, excerpt, mainImage{ ${imageFields} }
  }`);

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, publishedAt, excerpt, mainImage{ ${imageFields} }, body, ${seoFields}
}`);

export const SITEMAP_QUERY = defineQuery(`{
  "products": *[_type == "product" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "categories": *[_type == "productCategory" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt }
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
