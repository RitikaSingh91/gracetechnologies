import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeroSection } from "@/components/hero-section";

describe("Homepage hero", () => {
  const markup = renderToStaticMarkup(createElement(HeroSection));

  it("renders the split hero and the branded creative team graphic", () => {
    expect(markup).toContain('class="hero hero-container page-container"');
    expect(markup).toContain('class="hero-copy hero-text"');
    expect(markup).toContain('class="hero-image-wrapper"');
    expect(markup).toContain('aria-label="Company highlights and experience"');
    expect(markup).toContain('src="/images/creative-team.svg"');
    expect(markup).toContain('class="responsive-graphic"');
    expect(markup).toContain('fetchPriority="high"');
  });

  it("keeps existing navigation actions and displays company statistics", () => {
    expect(markup).toContain("Explore Our Services");
    expect(markup).toContain("View Our Work");
    expect(markup).toContain("50+");
    expect(markup).toContain("15+");
    expect(markup).toContain("100%");
    expect(markup).toContain("24/7");
  });

  it("presents both legal company names as an accessible partnership lockup", () => {
    expect(markup).toContain(
      'aria-label="Grace Technologies Ltd. in collaboration with ANK Square Pvt. Ltd."',
    );
    expect(markup).toContain(
      '<span class="hero-partnership-caption">In collaboration</span>',
    );
    expect(markup).toContain("<span>Grace Technologies Ltd.</span>");
    expect(markup).toContain('aria-hidden="true" class="hero-partnership-separator"');
    expect(markup).toContain("<span>ANK Square Pvt. Ltd.</span>");
  });
});
