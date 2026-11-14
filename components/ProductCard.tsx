import Link from "next/link";
import { SanityImage } from "./SanityImage";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/site";
import type { ProductCard as ProductCardType } from "@/lib/types";

export function ProductCard({ product, preload = false }: { product: ProductCardType; preload?: boolean }) {
  return (
    <Link
      href={`/product/${product.slug}/`}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative h-32 w-full rounded-lg bg-photo">
        <SanityImage
          image={product.image}
          // The link text already names the product; repeating it in the alt doubles it for screen readers.
          alt=""
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
          fill
          preload={preload}
          // 4 columns beside the 16rem filter sidebar on desktop (~240px), 3 on tablets, 2 on phones.
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
          className="object-contain transition-transform group-hover:scale-105"
        />
      </div>
      <span className="mt-4 rounded-lg bg-primary px-4 py-1 text-xs text-white transition-colors group-hover:bg-primary-dark">
        {product.title}
      </span>
      {product.partType?.[0] && <span className="mt-1 text-xs text-gray-500">{product.partType[0]}</span>}
    </Link>
  );
}

/**
 * `preloadCount`: how many leading images to preload. Only for grids at the top of the page
 * (catalogue listings); below-the-fold grids like related products should leave it at 0.
 */
export function ProductGrid({ products, preloadCount = 0 }: { products: ProductCardType[]; preloadCount?: number }) {
  if (!products.length) {
    return <p className="py-12 text-center text-gray-500">No products found.</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <li key={product._id}>
          <ProductCard product={product} preload={i < preloadCount} />
        </li>
      ))}
    </ul>
  );
}
