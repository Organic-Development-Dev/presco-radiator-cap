import { describe, expect, it } from "vitest";
import { addressLines, telHref, tidyLabel, truncate } from "@/lib/text";

describe("truncate", () => {
  it("keeps short text and collapses whitespace", () => {
    expect(truncate("  a   b ")).toBe("a b");
    expect(truncate(null)).toBe("");
  });
  it("cuts on a word boundary within the limit", () => {
    const out = truncate("word ".repeat(50), 40);
    expect(out.length).toBeLessThanOrEqual(40);
    expect(out.endsWith("word…")).toBe(true);
  });
});

describe("tidyLabel", () => {
  it("drops brackets and converts ALL CAPS to title case", () => {
    expect(tidyLabel("FUEL CAP (DIFF. UNDERNEATH TO PAG830)")).toBe("Fuel Cap");
  });
  it("cuts long labels at the first comma and keeps codes with digits", () => {
    expect(tidyLabel("HEXAGONAL PRESSURE CAP 10LB, SHORT REACH")).toBe("Hexagonal Pressure Cap 10LB");
  });
  it("leaves mixed-case labels alone", () => {
    expect(tidyLabel("Expansion Tank Cap")).toBe("Expansion Tank Cap");
  });
});

describe("addressLines / telHref", () => {
  it("skips empty address parts", () => {
    expect(addressLines({ streetAddress: "Unit D86", locality: "Worcester", region: " ", postalCode: "WR3 8TJ" })).toEqual([
      "Unit D86",
      "Worcester",
      "WR3 8TJ",
    ]);
  });
  it("builds a dialable tel: link", () => {
    expect(telHref("+44 (0)1905 755656")).toBe("tel:+441905755656");
  });
});
