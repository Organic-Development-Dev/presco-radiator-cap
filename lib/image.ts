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
  const size = imageSize(image.asset?._ref);
  return size ? { ...image, dimensions: { ...size, aspectRatio: size.width / size.height } } : image;
}
