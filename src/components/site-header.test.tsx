import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site-header";

describe("Site header navigation", () => {
  const markup = renderToStaticMarkup(createElement(SiteHeader));

  it("keeps desktop links and provides an accessible mobile menu toggle", () => {
    expect(markup).toContain('aria-label="Main navigation"');
    expect(markup).toContain('aria-controls="mobile-navigation"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-label="Open navigation menu"');
    expect(markup).toContain('aria-label="Mobile navigation"');
    expect(markup).toContain('href="/#services"');
    expect(markup).toContain('href="/#our-work"');
    expect(markup).toContain('href="/#partnership"');
    expect(markup).toContain('href="/#contact"');
  });
});
