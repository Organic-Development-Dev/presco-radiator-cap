import Image, { type ImageProps } from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/lib/types";

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  image: SanityImageType | null | undefined;
  alt?: string;
  /** Render width in CSS pixels; height follows the image's aspect ratio. Ignored with `fill`. */
  width?: number;
  fallbackSrc?: string;
};

/** next/image for Sanity assets: CDN-sized, blurred placeholder from the asset's LQIP. */
export function SanityImage({ image, alt, width = 800, fallbackSrc, fill, ...rest }: Props) {
  if (!image?.asset) {
    if (!fallbackSrc) return null;
    return fill ? (
      <Image src={fallbackSrc} alt={alt ?? ""} fill {...rest} />
    ) : (
      <Image src={fallbackSrc} alt={alt ?? ""} width={width} height={width} {...rest} />
    );
  }

  const aspect = image.dimensions?.aspectRatio ?? 1;
  const src = urlFor(image).width(Math.round(width * 2)).url();
  const altText = alt ?? image.alt ?? "";
  const common = {
    src,
    placeholder: image.lqip ? ("blur" as const) : ("empty" as const),
    blurDataURL: image.lqip ?? undefined,
    // The Sanity CDN already resizes and converts formats.
    unoptimized: true,
    ...rest,
  };

  return fill ? <Image {...common} alt={altText} fill /> : <Image {...common} alt={altText} width={width} height={Math.round(width / aspect)} />;
}
