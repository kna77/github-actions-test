import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

function parseRgb(color) {
  const match = color.match(/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/i);

  if (!match) {
    return null;
  }

  return match.slice(1).map(Number);
}

function isRedLike([red, green, blue]) {
  return red > 180 && green < 100 && blue < 100;
}

const redCheck =
  process.env.GITHUB_BASE_REF === "main" || process.env.GITHUB_REF_NAME === "main"
    ? it
    : it.skip;

describe("index.html", () => {
  it("includes the expected heading text", () => {
    const html = readFileSync(resolve("index.html"), "utf8");
    const dom = new JSDOM(html);
    const heading = dom.window.document.querySelector("h1");

    expect(heading?.textContent).toContain("こんにちは、川島太郎です");
  });

  redCheck("does not render any text in red", () => {
    const html = readFileSync(resolve("index.html"), "utf8");
    const css = readFileSync(resolve("style.css"), "utf8");
    const dom = new JSDOM(html, { pretendToBeVisual: true });
    const { document } = dom.window;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const textNodes = Array.from(document.querySelectorAll("body *")).filter(
      (element) => (element.textContent ?? "").trim().length > 0,
    );

    for (const element of textNodes) {
      const rgb = parseRgb(dom.window.getComputedStyle(element).color);

      if (rgb) {
        expect(isRedLike(rgb)).toBe(false);
      }
    }
  });
});
