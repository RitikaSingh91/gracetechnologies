import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminDemo } from "@/components/admin-demo";

describe("Admin demo mobile navigation", () => {
  it("provides all dashboard sections and an accessible menu toggle", () => {
    const markup = renderToStaticMarkup(<AdminDemo section="contacts" />);

    expect(markup).toContain('aria-label="Open dashboard menu"');
    expect(markup).toContain('aria-controls="admin-demo-navigation"');
    expect(markup).toContain('aria-label="Demo navigation"');
    expect(markup).toContain("Dashboard");
    expect(markup).toContain("Contact messages");
    expect(markup).toContain("WhatsApp Analytics");
    expect(markup).toContain("Service enquiries");
    expect(markup).toContain("Admin Profile");
    expect(markup).toContain("View Public Website");
  });
});
