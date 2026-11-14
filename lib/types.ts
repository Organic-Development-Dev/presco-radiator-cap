/*
 * App-facing names for Sanity query results.
 *
 * Everything here is derived from the types `npm run typegen` generates from the schema and the
 * GROQ queries in sanity/lib/queries.ts (sanity.types.ts), so a query change that breaks a
 * component is a type error, not a runtime surprise. Re-run `npm run typegen` after changing a
 * query or schema. Fields marked `rule.required()` in the schema are non-null.
 */
import type {
  APPLICATION_GUIDES_QUERY_RESULT,
  APPLICATION_GUIDE_QUERY_RESULT,
  CATEGORIES_QUERY_RESULT,
  CATEGORY_QUERY_RESULT,
  HOME_PAGE_QUERY_RESULT,
  LOCALE_PAGES_QUERY_RESULT,
  PAGE_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  POST_QUERY_RESULT,
  PRODUCTS_QUERY_RESULT,
  PRODUCT_FACETS_QUERY_RESULT,
  PRODUCT_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  SanityImageAssetReference,
  SanityImageCrop,
  SanityImageDimensions,
  SanityImageHotspot,
} from "@/sanity.types";

type Item<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Any image the site renders: the `imageFields` projection (with lqip/dimensions) or a raw
 * image field such as `seo.image`. Input type for SanityImage and urlFor.
 */
export type SanityImage = {
  asset?: SanityImageAssetReference | null;
  hotspot?: SanityImageHotspot | null;
  crop?: SanityImageCrop | null;
  alt?: string | null;
  lqip?: string | null;
  dimensions?: SanityImageDimensions | null;
};

/** A link target as returned by the `linkTarget` GROQ fragment (see lib/links.ts). */
export type LinkTarget = {
  internal?: { _type: string; slug?: string | null } | null;
  url?: string | null;
  anchor?: string | null;
};

export type Seo = NonNullable<PAGE_QUERY_RESULT>["seo"];

export type ProductCard = Item<PRODUCTS_QUERY_RESULT>;
export type Product = NonNullable<PRODUCT_QUERY_RESULT>;
export type ProductFacets = PRODUCT_FACETS_QUERY_RESULT;

export type Category = Item<CATEGORIES_QUERY_RESULT>;
export type CategoryDetail = NonNullable<CATEGORY_QUERY_RESULT>;

export type Page = NonNullable<PAGE_QUERY_RESULT>;
export type TeamMember = Item<NonNullable<Page["teamMembers"]>>;

export type PostCard = Item<POSTS_QUERY_RESULT>;
export type Post = NonNullable<POST_QUERY_RESULT>;

export type SiteSettings = SITE_SETTINGS_QUERY_RESULT;
export type MenuItemData = Item<NonNullable<NonNullable<SiteSettings>["mainMenu"]>>;
export type NavLinkData = Item<NonNullable<MenuItemData["children"]>>;
export type PostalAddress = NonNullable<NonNullable<SiteSettings>["address"]>;

export type HomePage = HOME_PAGE_QUERY_RESULT;
export type HeroSlide = Item<NonNullable<NonNullable<HomePage>["heroSlides"]>>;
export type Testimonial = NonNullable<Item<NonNullable<NonNullable<HomePage>["testimonials"]>>>;

export type ApplicationGuideSummary = Item<APPLICATION_GUIDES_QUERY_RESULT>;
export type ApplicationGuide = NonNullable<APPLICATION_GUIDE_QUERY_RESULT>;
export type ApplicationPart = Item<NonNullable<Item<NonNullable<ApplicationGuide["sections"]>>["parts"]>>;

export type LocalePage = Item<LOCALE_PAGES_QUERY_RESULT>;
