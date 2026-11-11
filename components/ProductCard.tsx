import Link from "next/link";
import { SanityImage } from "./SanityImage";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/site";
import type { ProductCard as ProductCardType } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: ProductCardType; priority?: boolean }) {
  return (
    <Link
      href={`/product/${product.slug}/`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-surface">
        <SanityImage
          image={product.image}
          alt={product.image?.alt || product.title}
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-4 transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="font-semibold text-primary">{product.title}</span>
        {product.partType?.[0] && <span className="text-xs text-gray-500">{product.partType[0]}</span>}
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: ProductCardType[] }) {
  if (!products.length) {
    return <p className="py-12 text-center text-gray-500">No products found.</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <li key={product._id}>
          <ProductCard product={product} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
