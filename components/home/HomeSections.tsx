import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { resolveHref } from "@/lib/links";
import type { HomePage } from "@/lib/types";

type Data = NonNullable<HomePage>;

/** "Why choose us": round icon, title and short text per item. */
export function Features({ heading, items }: { heading?: string | null; items: NonNullable<Data["features"]> }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={heading ? "features-heading" : undefined} className="container-site py-10 text-center">
      {heading && (
        <h2 id="features-heading" className="pb-10 text-lg font-bold uppercase text-primary">
          {heading}
        </h2>
      )}
      <ul className="grid gap-10 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item._key}>
            {item.icon?.asset && (
              <SanityImage image={item.icon} alt="" width={114} className="mx-auto size-28 rounded-full object-contain" />
            )}
            <h3 className="py-4 text-xl font-extrabold uppercase text-primary">{item.title}</h3>
            {item.text && <p className="mx-auto max-w-xs text-sm text-[#3a3a3a]">{item.text}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Product range tiles linking to categories. */
export function ProductTiles({ heading, tiles }: { heading?: string | null; tiles: NonNullable<Data["productTiles"]> }) {
  if (!tiles.length) return null;
  return (
    <section aria-labelledby={heading ? "product-tiles-heading" : undefined} className="container-site py-10">
      {heading && (
        <h2 id="product-tiles-heading" className="pb-8 text-center text-lg font-bold uppercase text-primary">
          {heading}
        </h2>
      )}
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((tile) => {
          const href = resolveHref(tile);
          const content = (
            <>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
                <SanityImage
                  image={tile.image}
                  alt={tile.image.alt ?? ""}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-3 block text-center font-semibold uppercase text-secondary group-hover:text-primary">
                {tile.label}
              </span>
            </>
          );
          return (
            <li key={tile._key}>
              {href ? (
                <Link href={href} className="group block">
                  {content}
                </Link>
              ) : (
                <div>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
