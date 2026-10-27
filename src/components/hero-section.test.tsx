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

  it("keeps the homepage hero focused on the business technology message", () => {
    expect(markup).toContain(
      "<h1 id=\"hero-title\">Thoughtful technology for your business.</h1>",
    );
    expect(markup).toContain(
      "Digital solutions for growing businesses",
    );
    expect(markup).not.toContain("ANK Square");
    expect(markup).not.toContain("In collaboration");
  });

  it("groups the headline, copy, and calls to action in one hero column", () => {
    const content = markup.slice(
      markup.indexOf('<div class="hero-copy hero-text">'),
      markup.indexOf('<div aria-hidden="true" class="hero-image-wrapper">'),
    );

    expect(content).toContain("Thoughtful technology for your business.");
    expect(content).toContain("We help businesses build better digital experiences");
    expect(content).toContain("Explore Our Services");
    expect(content).toContain("View Our Work");
  });
});
