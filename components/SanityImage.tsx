import Image, { getImageProps, type ImageLoader, type ImageProps } from "next/image";
import { preload as preloadResource } from "react-dom";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/lib/types";

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height" | "loader"> & {
  image: SanityImageType | null | undefined;
  alt?: string;
  /** Render width in CSS pixels; height follows the image's aspect ratio. Ignored with `fill`. */
  width?: number;
  fallbackSrc?: string;
};

/**
 * Responsive image served straight from the Sanity CDN, with a blurred placeholder from the
 * asset's LQIP. A Sanity loader lets Next build a real `srcset` (driven by `sizes` for `fill`
 * images, 1x/2x for fixed widths), so small tiles no longer download full-size photos.
 *
 * Uses `getImageProps` + a plain <img> rather than <Image loader>: a loader is a function,
 * which can't be passed from a server component to the (client) Image component.
 */
export function SanityImage({ image, alt, width = 800, fallbackSrc, fill, preload, ...rest }: Props) {
  if (!image?.asset) {
    if (!fallbackSrc) return null;
    return fill ? (
      <Image src={fallbackSrc} alt={alt ?? ""} fill preload={preload} {...rest} />
    ) : (
      <Image src={fallbackSrc} alt={alt ?? ""} width={width} height={width} preload={preload} {...rest} />
    );
  }

  const source = urlFor(image);
  // Never request more pixels than the original has (fit=max already prevents upscaling).
  const loader: ImageLoader = ({ width: w, quality }) => source.width(w).quality(quality ?? 75).url();
  const aspect = image.dimensions?.aspectRatio ?? 1;
  const { props } = getImageProps({
    src: source.url(),
    loader,
    alt: alt ?? image.alt ?? "",
    placeholder: image.lqip ? "blur" : "empty",
    blurDataURL: image.lqip ?? undefined,
    ...(fill ? { fill: true } : { width, height: Math.round(width / aspect) }),
    ...(preload ? { preload: true, fetchPriority: "high" as const } : {}),
    ...rest,
  });
  // getImageProps makes the image eager but (unlike <Image>) adds no <link rel="preload">.
  if (preload && props.src) {
    preloadResource(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: "high" });
  }

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- props come from getImageProps (alt included)
  return <img {...props} />;
}
