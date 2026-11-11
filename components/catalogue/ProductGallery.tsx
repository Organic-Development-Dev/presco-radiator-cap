"use client";

import { useState } from "react";
import { SanityImage } from "@/components/SanityImage";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/site";
import type { SanityImage as SanityImageType } from "@/lib/types";

/** Main product image with selectable thumbnails. */
export function ProductGallery({ images, title }: { images: SanityImageType[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? null;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        <SanityImage
          image={current}
          alt={current?.alt || title}
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-6"
        />
      </div>

      {images.length > 1 && (
        <ul className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5" aria-label="Product images">
          {images.map((image, i) => (
            <li key={`${image.asset?._ref ?? "img"}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-surface transition-colors ${
                  i === active ? "border-primary" : "border-transparent hover:border-gray-300"
                }`}
              >
                <SanityImage image={image} alt="" width={160} fill sizes="120px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
