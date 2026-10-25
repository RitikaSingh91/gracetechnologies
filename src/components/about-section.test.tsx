import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AboutSection } from "@/components/about-section";

describe("About section partnership", () => {
  it("shows both company marks together in a compact partnership panel", () => {
    const markup = renderToStaticMarkup(createElement(AboutSection));

    expect(markup).toContain('aria-label="Our collaboration"');
    expect(markup).toContain('alt="Grace Technologies Ltd."');
    expect(markup).toContain('alt="ANK Square"');
    expect(markup).toContain('src="https://www.anksquare.com/logo.svg"');
    expect(markup).toContain("Two teams, working together to support your business.");
    expect(markup).toContain("Working across the UK, USA, and India");
  });
});
