import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ServicesSection } from "@/components/services-section";

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
    "connects $title to its service details and enquiry",
    ({ id, title, heading, approach, cta }) => {
      expect(markup).toContain(`href="#service-details-${id}"`);
      expect(markup).toContain(`id="service-details-${id}"`);
      expect(markup).toContain(
        `<h3 class="service-detail-title" id="service-details-title-${id}">${title}</h3><h4 class="service-detail-subheading">${heading}</h4>`,
      );
      expect(markup).toContain(approach);
      expect(markup).toContain(`data-enquiry-service="${title}"`);
      expect(markup).toContain(cta);
    },
  );

  it("does not send service links back to the partnership section", () => {
    expect(markup).not.toContain('href="#partnership"');
  });

  it("omits tailored-solution lists while retaining service enquiries", () => {
    expect(markup).not.toContain("Our Tailored Solutions");
    expect(markup).not.toContain("service-solutions-list");
    expect(markup).toContain("Discuss Your Digital Project");
  });

  it("renders the provided service illustrations with descriptive alt text", () => {
    expect(markup).toContain('src="/images/web-development.png"');
    expect(markup).toContain(
      'alt="Developer working at a laptop with code and gears"',
    );
    expect(markup).toContain('width="956" height="716"');
    expect(markup).toContain('src="/images/merchant-account-management.jpg"');
    expect(markup).toContain(
      'alt="Two professionals discussing across a desk with a laptop"',
    );
    expect(markup).toContain('width="2400" height="1800"');
    expect(markup).toContain('src="/images/agentic-ai.svg"');
    expect(markup).toContain(
      'alt="Artificial intelligence illustration representing smart business workflows"',
    );
    expect(markup).toContain('width="500" height="500"');
    expect(markup).toContain('src="/images/digital-marketing.jpg"');
    expect(markup).toContain(
      'alt="Business owner reviewing a declining financial graph on a laptop"',
    );
    expect(markup).toContain('width="6251" height="4690"');
    expect(markup).toContain("service-detail--image-right");
    expect(markup).toContain("service-detail--image-left");
    expect(markup).toContain(
      'class="service-detail service-detail--with-image service-detail--image-left" id="service-details-merchant-account-management"',
    );
  });

  it("avoids unsupported payment and AI outcome promises", () => {
    expect(markup.toLowerCase()).not.toContain("guaranteed approval");
    expect(markup.toLowerCase()).not.toContain("instant account activation");
    expect(markup.toLowerCase()).not.toContain("completely replace employees");
  });
});
