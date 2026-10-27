import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/dashboard",
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

import { AdminShell } from "@/components/admin-shell";

describe("Admin mobile navigation", () => {
  it("renders the company logo and an accessible dashboard menu toggle", () => {
    const markup = renderToStaticMarkup(
      <AdminShell email="admin@example.com">
        <main>Dashboard</main>
      </AdminShell>,
    );

    expect(markup).toContain('aria-label="Open dashboard menu"');
    expect(markup).toContain('aria-controls="admin-navigation"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-label="Admin navigation"');
    expect(markup).toContain("Grace Technologies");
    expect(markup).toContain("Admin");
    expect(markup).toContain("Dashboard");
    expect(markup).toContain("Contact messages");
    expect(markup).toContain("WhatsApp Analytics");
    expect(markup).toContain("Service enquiries");
    expect(markup).toContain("Admin Profile");
    expect(markup).toContain("View Public Website");
  });
});
