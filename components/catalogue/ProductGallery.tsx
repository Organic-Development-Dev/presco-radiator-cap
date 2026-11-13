"use client";

import { useRef, useState } from "react";
import { SanityImage } from "@/components/SanityImage";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/site";
import type { SanityImage as SanityImageType } from "@/lib/types";

/** Main product image with selectable thumbnails. */
export function ProductGallery({ images, title }: { images: SanityImageType[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? null;
  const zoom = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => current?.asset && zoom.current?.showModal()}
        disabled={!current?.asset}
        aria-label={current?.asset ? `Enlarge image of ${title}` : undefined}
        className="relative block aspect-square w-full overflow-hidden rounded-xl bg-surface enabled:cursor-zoom-in"
      >
        <SanityImage
          image={current}
          alt={current?.alt || title}
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-6"
        />
      </button>

      {current?.asset && (
        <dialog
          ref={zoom}
          onClick={() => zoom.current?.close()}
          aria-label={`${title} – enlarged image`}
          className="m-auto max-h-[95vh] max-w-[95vw] bg-transparent p-0 backdrop:bg-black/80"
        >
          <SanityImage
            image={current}
            alt={current.alt || title}
            width={1200}
            sizes="95vw"
            className="h-auto max-h-[90vh] w-auto max-w-[95vw] cursor-zoom-out object-contain"
          />
          <button
            type="button"
            onClick={() => zoom.current?.close()}
            className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-secondary"
          >
            Close
          </button>
        </dialog>
      )}

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
