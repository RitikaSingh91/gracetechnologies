import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ServicesSection,
  services as serviceDetails,
} from "@/components/services-section";

const services = [
  {
    id: "web-mobile-app-development",
    title: "Web & Mobile App Development",
    heading: "Digital Products Built Around Your Business",
    approach: "Discovery & Planning",
    cta: "Discuss Your Digital Project",
  },
  {
    id: "merchant-account-management",
    title: "Merchant Account Management",
    heading: "Payment Solutions That Support Your Business",
    approach: "Provider & Requirement Review",
    cta: "Discuss Your Payment Needs",
  },
  {
    id: "agentic-ai-workflow-automation",
    title: "Agentic AI & Workflow Automation",
    heading: "Turn Repetitive Work Into Smarter Workflows",
    approach: "Identify the Bottleneck",
    cta: "Explore AI for Your Business",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    heading: "Build Your Digital Presence With Purpose",
    approach: "Understand Your Audience",
    cta: "Build Your Marketing Strategy",
  },
] as const;

describe("Services section", () => {
  const markup = renderToStaticMarkup(createElement(ServicesSection)).replaceAll(
    "&amp;",
    "&",
  );

  it.each(services)(
    "links $title to its dedicated service page",
    ({ id }) => {
      expect(markup).toContain(`href="/services/${id}"`);
      expect(serviceDetails.find((service) => service.id === id)).toBeDefined();
    },
  );

  it.each(serviceDetails)(
    "provides overview, features, approach, and use cases for $title",
    (service) => {
      expect(service.description).toBeTruthy();
      expect(service.details.heading).toBeTruthy();
      expect(service.details.challenge).toBeTruthy();
      expect(service.keyFeatures.length).toBeGreaterThan(0);
      expect(service.useCases.length).toBeGreaterThan(0);
      expect(service.details.approach.length).toBeGreaterThan(0);
    },
  );

  it("renders all service cards without in-page detail links", () => {
    expect(markup).toContain("Learn More");
    expect(markup).not.toContain("service-details-");
  });
});
