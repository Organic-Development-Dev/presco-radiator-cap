import { describe, expect, it } from "vitest";
import { documentHref, isExternalHref, resolveHref } from "@/lib/links";

describe("documentHref", () => {
  it("maps each document type to its route", () => {
    expect(documentHref("homePage")).toBe("/");
    expect(documentHref("page", "about-us")).toBe("/about-us/");
    expect(documentHref("post", "exhibitions-2020")).toBe("/blog/exhibitions-2020/");
    expect(documentHref("product", "prc820")).toBe("/product/prc820/");
    expect(documentHref("productCategory", "auto")).toBe("/product-category/auto/");
  });
  it("returns null without a slug or for unknown types", () => {
    expect(documentHref("page", null)).toBeNull();
    expect(documentHref("enquiry", "x")).toBeNull();
  });
});

describe("resolveHref", () => {
  it("prefers the internal reference over the URL", () => {
    expect(resolveHref({ internal: { _type: "page", slug: "news" }, url: "/other/" })).toBe("/news/");
  });
  it("falls back to the URL", () => {
    expect(resolveHref({ url: "https://example.com" })).toBe("https://example.com");
    expect(resolveHref({})).toBeNull();
    expect(resolveHref(null)).toBeNull();
  });
  it("appends an anchor, replacing any existing one", () => {
    expect(resolveHref({ internal: { _type: "page", slug: "about-us" }, anchor: "team" })).toBe("/about-us/#team");
    expect(resolveHref({ url: "/about-us/#old", anchor: "team" })).toBe("/about-us/#team");
  });
  it("ignores an anchor when there is no target", () => {
    expect(resolveHref({ anchor: "team" })).toBeNull();
  });
});

describe("isExternalHref", () => {
  it("detects absolute http(s) URLs only", () => {
    expect(isExternalHref("https://x.com")).toBe(true);
    expect(isExternalHref("/products/")).toBe(false);
    expect(isExternalHref("mailto:a@b.com")).toBe(false);
  });
});

describe("resolveHref anchors on non-page links", () => {
  it("never adds an anchor to mailto: or tel:", () => {
    expect(resolveHref({ url: "mailto:sales@example.com", anchor: "team" })).toBe("mailto:sales@example.com");
    expect(resolveHref({ url: "tel:+441905755656", anchor: "team" })).toBe("tel:+441905755656");
  });
});

describe("documentHref for guides and language pages", () => {
  it("routes application guides and language pages", () => {
    expect(documentHref("applicationGuide", "auto-europe")).toBe("/applications/auto-europe/");
    expect(documentHref("localePage", "fr")).toBe("/fr/");
  });
});
