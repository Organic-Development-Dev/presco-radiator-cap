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
        <h2 id="features-heading" className="pb-10 text-[22px] font-bold uppercase text-accent">
          {heading}
        </h2>
      )}
      <ul className="grid gap-10 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item._key}>
            {item.icon?.asset && (
              <SanityImage image={item.icon} alt="" width={114} className="mx-auto size-28 rounded-full object-contain" />
            )}
            <h3 className="py-4 text-xl font-extrabold uppercase text-accent">{item.title}</h3>
            {item.text && <p className="mx-auto max-w-xs text-sm text-body">{item.text}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Product range tiles linking to categories, on a grey band with navy dividers (as the live site). */
export function ProductTiles({ heading, tiles }: { heading?: string | null; tiles: NonNullable<Data["productTiles"]> }) {
  if (!tiles.length) return null;
  return (
    <section aria-labelledby={heading ? "product-tiles-heading" : undefined} className="bg-band py-14">
      <div className="container-site">
        {heading && (
          <h2 id="product-tiles-heading" className="pb-10 text-center text-[22px] font-bold uppercase text-accent">
            {heading}
          </h2>
        )}
        <ul className="grid gap-y-10 md:grid-cols-4 md:divide-x md:divide-accent">
          {tiles.map((tile) => {
            const href = resolveHref(tile);
            const content = (
              <>
                <SanityImage
                  image={tile.image}
                  alt={tile.image.alt ?? ""}
                  width={150}
                  sizes="150px"
                  className="mx-auto h-[150px] w-[150px] rounded-2xl bg-photo object-contain transition-transform duration-300 group-hover:scale-105 dark:p-2"
                />
                <span className="mt-6 block text-xl font-bold uppercase text-accent group-hover:underline">{tile.label}</span>
              </>
            );
            return (
              <li key={tile._key} className="px-4 text-center">
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
      </div>
    </section>
  );
}
