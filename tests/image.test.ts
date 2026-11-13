import { describe, expect, it } from "vitest";
import { imageSize, withDimensions } from "@/lib/image";
import type { SanityImage } from "@/lib/types";

describe("imageSize", () => {
  it("reads the size from a Sanity asset ref", () => {
    expect(imageSize("image-abc123-500x412-png")).toEqual({ width: 500, height: 412 });
  });
  it("returns null for anything else", () => {
    expect(imageSize(undefined)).toBeNull();
    expect(imageSize("file-abc-pdf")).toBeNull();
  });
});

describe("withDimensions", () => {
  it("adds the aspect ratio from the ref", () => {
    const image = withDimensions<SanityImage>({ asset: { _type: "reference", _ref: "image-x-1000x500-jpg" } });
    expect(image.dimensions).toEqual({ width: 1000, height: 500, aspectRatio: 2 });
  });
  it("leaves images without a parsable ref alone", () => {
    const image = { asset: { _type: "reference" as const, _ref: "nope" } };
    expect(withDimensions(image)).toBe(image);
  });
});
