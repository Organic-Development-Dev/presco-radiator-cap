import { SanityImage } from "@/components/SanityImage";
import type { SanityImage as SanityImageType } from "@/lib/types";

/** Page title plus optional full-width hero image from the CMS. */
export function PageHeader({ title, heroImage }: { title: string; heroImage?: SanityImageType | null }) {
  return (
    <header className="mb-8">
      {heroImage?.asset && (
        <div className="relative mb-8 aspect-[3/1] overflow-hidden rounded-lg bg-surface">
          <SanityImage image={heroImage} fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
        </div>
      )}
      <h1 className="heading-section">{title}</h1>
    </header>
  );
}
