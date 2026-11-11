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
  categories?: { title: string; slug: string }[] | null;
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
  title: string;
  slug: string;
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

export type Post = PostCard & { body?: PortableTextBlock[] | null; seo?: Seo };

export type SiteSettings = {
  siteName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  socialLinks?: { _key: string; platform: string; url: string }[] | null;
  footerText?: string | null;
  defaultSeo?: Seo;
} | null;
