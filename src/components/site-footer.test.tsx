import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";

describe("Site footer contact details", () => {
  it("shows both partner emails in the footer Contact column", () => {
    const markup = renderToStaticMarkup(createElement(SiteFooter));
    const contactSection = markup.match(
      /<section aria-labelledby="footer-contact-title" class="footer-contact">([\s\S]*?)<\/section>/,
    )?.[1];
    const partnerSection = markup.match(
      /<section aria-label="ANK Square partner information" class="footer-partner">([\s\S]*?)<\/section>/,
    )?.[1];

    expect(contactSection).toContain('href="mailto:contact@gracetechnologies.uk"');
    expect(contactSection).toContain('href="mailto:contact@anksquare.com"');
    expect(partnerSection).toContain('href="mailto:contact@anksquare.com"');
  });
});
