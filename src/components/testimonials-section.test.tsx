import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TestimonialsSection } from "@/components/testimonials-section";
import { testimonials } from "@/data/testimonials";

describe("Testimonials section", () => {
  it("publishes the three provided service testimonials", () => {
    expect(testimonials).toHaveLength(3);
    expect(testimonials.every((testimonial) => testimonial.published)).toBe(
      true,
    );
    expect(testimonials.map((testimonial) => testimonial.service)).toEqual([
      "Web & Mobile App Development",
      "Merchant Account Management",
      "AI & Workflow Automation",
    ]);
  });

  it("shows the supplied client feedback and attributions", () => {
    const markup = renderToStaticMarkup(createElement(TestimonialsSection));

    expect(markup).toContain("CLIENT EXPERIENCES");
    expect(markup).toContain("Trusted Partnerships. Meaningful Results.");
    expect(markup).toContain(
      "Discover how businesses work with Grace Technologies to build better digital experiences, improve operations, and solve real business challenges.",
    );
    expect(markup).toContain('aria-label="Client testimonials"');
    expect(markup.match(/<li class="[^"]*">/g)).toHaveLength(3);
    expect(markup).toContain("Web &amp; Mobile App Development");
    expect(markup).toContain("Merchant Account Management");
    expect(markup).toContain("AI &amp; Workflow Automation");
    expect(
      testimonials.map((testimonial) => testimonial.quote),
    ).toEqual([
      "Grace Technologies helped us turn our ideas into a clean, user-friendly digital experience. The team was responsive, understood our requirements, and delivered a solution that made our business operations easier.",
      "We needed a reliable partner to help us improve our payment operations. Grace Technologies provided a practical approach, clear communication, and support throughout the process. The experience was professional from start to finish.",
      "Grace Technologies helped us identify opportunities to simplify repetitive tasks and improve our workflow. Their approach was straightforward, thoughtful, and focused on solving real business problems.",
    ]);
    expect(markup).toContain("Michael Anderson");
    expect(markup).toContain("Business Owner, New York, USA");
    expect(markup).toContain("Sarah Mitchell");
    expect(markup).toContain("Retail Business Owner, Texas, USA");
    expect(markup).toContain("David Wilson");
    expect(markup).toContain("Operations Manager, California, USA");
    expect(markup).toContain(
      "These testimonials are illustrative sample content and are not verified customer reviews.",
    );
  });
});
