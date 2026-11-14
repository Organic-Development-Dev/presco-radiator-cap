import { describe, expect, it } from "vitest";
import { catalogueSeo } from "@/components/catalogue/params";

describe("catalogueSeo", () => {
  it("indexes the unfiltered first page with a clean canonical", () => {
    expect(catalogueSeo("/products/", {})).toEqual({ path: "/products/", noIndex: false, titleSuffix: "" });
  });
  it("keeps later pages indexable and self-canonical", () => {
    expect(catalogueSeo("/products/", { page: "3" })).toEqual({ path: "/products/?page=3", noIndex: false, titleSuffix: " – Page 3" });
  });
  it("noindexes filtered views and points the canonical at the listing", () => {
    expect(catalogueSeo("/products/", { type: "pressure-cap", page: "2" })).toEqual({ path: "/products/", noIndex: true, titleSuffix: "" });
  });
});
