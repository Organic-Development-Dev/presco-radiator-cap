import type { Metadata } from "next";
import { ProductsListing, productsMetadata } from "@/components/catalogue/listing";

/*
 * Unfiltered first page only, so it's prerendered (no searchParams). Filtered and paginated
 * views are rewritten to /catalogue-results/ in next.config: see components/catalogue/listing.tsx.
 */

export function generateMetadata(): Promise<Metadata> {
  return productsMetadata({});
}

export default function ProductsPage() {
  return <ProductsListing searchParams={{}} />;
}
