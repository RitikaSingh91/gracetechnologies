import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContactSection } from "@/components/contact-section";

describe("Contact section", () => {
  const markup = renderToStaticMarkup(createElement(ContactSection));

  it("renders the contact form and company information in the existing section", () => {
    expect(markup).toContain('class="contact-section" id="contact"');
    expect(markup).toContain('aria-labelledby="contact-title"');
    expect(markup).toContain("Let&#x27;s Talk About Your Project");
    expect(markup).toContain("Full Name");
    expect(markup).toContain("Phone Number");
    expect(markup).toContain("Email Address");
    expect(markup).toContain("Message");
    expect(markup).toContain("Send Message");
    expect(markup).toContain(
      'href="mailto:contact@gracetechnologies.uk"',
    );
    expect(markup).toContain("Grace Technologies Ltd.");
    expect(markup).toContain("Romford, Greater London, United Kingdom");
    expect(markup).toContain("Schedule a Consultation");
  });

  it("keeps the fields labeled and enables the honeypot without exposing it", () => {
    expect(markup).toContain('for="contact-name">Full Name</label>');
    expect(markup).toContain('for="contact-phone">Phone Number</label>');
    expect(markup).toContain('for="contact-email">Email Address</label>');
    expect(markup).toContain('for="contact-message">Message</label>');
    expect(markup).toContain('class="contact-honeypot" aria-hidden="true"');
    expect(markup).toContain('tabindex="-1" name="website"');
  });
});
