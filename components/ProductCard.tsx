import Link from "next/link";
import { SanityImage } from "./SanityImage";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/site";
import type { ProductCard as ProductCardType } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: ProductCardType; priority?: boolean }) {
  return (
    <Link
      href={`/product/${product.slug}/`}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative h-32 w-full">
        <SanityImage
          image={product.image}
          alt={product.image?.alt || product.title}
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
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

export function ProductGrid({ products }: { products: ProductCardType[] }) {
  if (!products.length) {
    return <p className="py-12 text-center text-gray-500">No products found.</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <li key={product._id}>
          <ProductCard product={product} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
