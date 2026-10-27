import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ServicePage from "@/app/services/[slug]/page";

describe("Service detail enquiry flow", () => {
  it.each([
    ["web-mobile-app-development", "Web & Mobile App Development"],
    ["merchant-account-management", "Merchant Account Management"],
    ["agentic-ai-workflow-automation", "Agentic AI & Workflow Automation"],
    ["digital-marketing", "Digital Marketing"],
  ])("provides service-specific enquiry buttons for %s", async (slug, title) => {
    const page = await ServicePage({
      params: Promise.resolve({ slug }),
    });
    const markup = renderToStaticMarkup(page);
    const encodedTitle = title.replaceAll("&", "&amp;");
    const selectedServiceAttribute = `data-enquiry-service="${encodedTitle}"`;

    expect(markup.split(selectedServiceAttribute)).toHaveLength(3);
    expect(markup).toContain('data-enquiry-trigger="true"');
    expect(markup).toContain('name="project_budget"');
    expect(markup).toContain('name="company"');
    expect(markup).toContain('name="phone"');
    expect(markup).toContain("Project Description or Message");
    expect(markup).not.toContain('href="/#contact">Contact Us');
  });
});
