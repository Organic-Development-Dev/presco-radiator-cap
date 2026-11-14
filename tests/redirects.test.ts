import { describe, expect, it } from "vitest";
import { toNextRedirects } from "@/lib/redirects";

describe("toNextRedirects", () => {
  it("maps a folder path with and without its trailing slash to an internal page", () => {
    expect(toNextRedirects([{ from: "/old-page/", internal: { _type: "page", slug: "about-us" } }])).toEqual([
      { source: "/old-page", destination: "/about-us/", permanent: true },
      { source: "/old-page/", destination: "/about-us/", permanent: true },
    ]);
  });
  it("keeps file paths as they are and honours temporary redirects", () => {
    expect(toNextRedirects([{ from: "/wp-content/uploads/cat.pdf", url: "https://example.com/cat.pdf", permanent: false }])).toEqual([
      { source: "/wp-content/uploads/cat.pdf", destination: "https://example.com/cat.pdf", permanent: false },
    ]);
  });
  it("escapes pattern characters", () => {
    expect(toNextRedirects([{ from: "/a:b(1).html", url: "/x/" }])[0].source).toBe("/a\\:b\\(1\\).html");
  });
  it("drops entries without a target, self-redirects and duplicates", () => {
    expect(
      toNextRedirects([
        { from: "/a/" },
        { from: "/news/", internal: { _type: "page", slug: "news" } },
        { from: "/dup", url: "/x/" },
        { from: "/dup/", url: "/y/" },
      ]),
    ).toEqual([
      { source: "/dup", destination: "/x/", permanent: true },
      { source: "/dup/", destination: "/x/", permanent: true },
    ]);
  });
});
