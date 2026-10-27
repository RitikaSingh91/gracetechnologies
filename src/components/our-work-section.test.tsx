import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OurWorkSection } from "@/components/our-work-section";

describe("Our Work section heading", () => {
  it("uses the centered two-tone heading without the old subtitle", () => {
    const markup = renderToStaticMarkup(createElement(OurWorkSection));

    expect(markup).toContain("Selected Projects");
    expect(markup).toContain("Our Work");
    expect(markup).toContain("our-work-heading-accent");
    expect(markup).not.toContain(
      "Selected work across web development and e-commerce business support.",
    );
  });
});
