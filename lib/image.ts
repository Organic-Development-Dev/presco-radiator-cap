import type { SanityImage } from "./types";

/** Pixel size encoded in a Sanity asset ref: "image-<id>-500x400-png" -> { width: 500, height: 400 }. */
export function imageSize(ref?: string | null) {
  const m = ref?.match(/-(\d+)x(\d+)-[a-z]+$/);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}

/**
 * Portable Text images are raw (no resolved asset metadata). Fill in the aspect ratio
 * from the ref so next/image gets the right width/height and the layout doesn't shift.
 */
export function withDimensions<T extends SanityImage>(image: T): T {
  const size = croppedSize(image);
  return size ? { ...image, dimensions: { ...size, aspectRatio: size.width / size.height } } : image;
}

/** Size after the editor's crop (urlFor serves the cropped image). */
export function croppedSize(image: Pick<SanityImage, "asset" | "crop">) {
  const size = imageSize(image.asset?._ref);
  if (!size) return null;
  const c = image.crop;
  if (!c) return size;
  return {
    width: Math.round(size.width * (1 - c.left - c.right)),
    height: Math.round(size.height * (1 - c.top - c.bottom)),
  };
}
