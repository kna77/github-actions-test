import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

describe("index.html", () => {
  it("includes the expected heading text", () => {
    const html = readFileSync(resolve("index.html"), "utf8");
    const dom = new JSDOM(html);
    const heading = dom.window.document.querySelector("h1");

    expect(heading?.textContent).toContain("こんにちは、川島太郎です");
  });
});
