import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string | null;
  lqip?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
};

export type Seo = {
  title?: string | null;
  description?: string | null;
  noIndex?: boolean | null;
  image?: SanityImage | null;
} | null;

export type ProductCard = {
  _id: string;
  title: string;
  slug: string;
  image?: SanityImage | null;
  partType?: string[] | null;
  applications?: string[] | null;
};

export type Product = ProductCard & {
  images?: SanityImage[] | null;
  summary?: PortableTextBlock[] | null;
  description?: PortableTextBlock[] | null;
  oeNumbers?: string[] | null;
  pressure?: string[] | null;
  modelInfo?: string[] | null;
  categories?: { title: string; slug: string; productNoun?: string | null; isChild?: boolean }[] | null;
  related?: ProductCard[] | null;
  seo?: Seo;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  parent?: string | null;
  count?: number;
};

export type CategoryDetail = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  image?: SanityImage | null;
  seo?: Seo;
};

export type ProductFacets = { applications: string[] | null; partTypes: string[] | null };

export type Page = {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  intro?: string | null;
  heroImage?: SanityImage | null;
  body?: PortableTextBlock[] | null;
  seo?: Seo;
};

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string | null;
  mainImage?: SanityImage | null;
};

export type Post = PostCard & { _updatedAt?: string; body?: PortableTextBlock[] | null; seo?: Seo };

/** A link target as returned by the `linkTarget` GROQ fragment. */
export type LinkTarget = {
  internal?: { _type: string; slug?: string | null } | null;
  url?: string | null;
};

export type NavLinkData = LinkTarget & { _key: string; label: string };

export type MenuItemData = LinkTarget & {
  _key: string;
  label: string;
  kind: "link" | "dropdown" | "products";
  children?: NavLinkData[] | null;
};

export type PostalAddress = {
  streetAddress?: string | null;
  locality?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  countryCode?: string | null;
};

export type SiteSettings = {
  siteName?: string | null;
  legalName?: string | null;
  email?: string | null;
  phone?: string | null;
  fax?: string | null;
  address?: PostalAddress | null;
  openingHours?: string | null;
  mapEmbedUrl?: string | null;
  socialLinks?: { _key: string; platform: string; url: string }[] | null;
  footerText?: string | null;
  newsletterHeading?: string | null;
  newsletterText?: string | null;
  copyright?: string | null;
  defaultSeo?: Seo;
  mainMenu?: MenuItemData[] | null;
  footerMenus?: { _key: string; title: string; links?: NavLinkData[] | null }[] | null;
} | null;

export type Testimonial = { _id: string; quote: string; name: string; role?: string | null; company?: string | null };

export type HeroSlide = LinkTarget & { _key: string; image: SanityImage };

export type HomePage = {
  heading?: string | null;
  heroSlides?: HeroSlide[] | null;
  featuresHeading?: string | null;
  features?: { _key: string; title: string; text?: string | null; icon?: SanityImage | null }[] | null;
  productsHeading?: string | null;
  productTiles?: (LinkTarget & { _key: string; label: string; image: SanityImage })[] | null;
  intro?: PortableTextBlock[] | null;
  newsHeading?: string | null;
  testimonialsHeading?: string | null;
  testimonialsSubheading?: string | null;
  testimonials?: (Testimonial | null)[] | null;
  seo?: Seo;
} | null;
