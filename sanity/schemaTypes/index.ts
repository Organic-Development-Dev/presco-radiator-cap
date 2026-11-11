import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./objects/blockContent";
import { seo } from "./objects/seo";
import { enquiry } from "./documents/enquiry";
import { page } from "./documents/page";
import { post } from "./documents/post";
import { product } from "./documents/product";
import { productCategory } from "./documents/productCategory";
import { siteSettings } from "./documents/siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  product,
  productCategory,
  page,
  post,
  siteSettings,
  enquiry,
  blockContent,
  seo,
];

/** Documents that should only ever exist once. */
export const singletonTypes = new Set(["siteSettings"]);
