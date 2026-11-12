import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./objects/blockContent";
import { footerColumn, heroSlide, menuItem, navLink } from "./objects/navigation";
import { seo } from "./objects/seo";
import { enquiry } from "./documents/enquiry";
import { homePage } from "./documents/homePage";
import { page } from "./documents/page";
import { post } from "./documents/post";
import { product } from "./documents/product";
import { productCategory } from "./documents/productCategory";
import { siteSettings } from "./documents/siteSettings";
import { testimonial } from "./documents/testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  homePage,
  product,
  productCategory,
  page,
  post,
  testimonial,
  siteSettings,
  enquiry,
  blockContent,
  seo,
  navLink,
  menuItem,
  footerColumn,
  heroSlide,
];

/** Documents that should only ever exist once. */
export const singletonTypes = new Set(["siteSettings", "homePage"]);
