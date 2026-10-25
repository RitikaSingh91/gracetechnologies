import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";

describe("Project cards", () => {
  it("shows only the two selected project cards", () => {
    expect(projects).toHaveLength(2);
    expect(projects.map((project) => project.name)).toEqual([
      "Rehas.in",
      "Flappy",
    ]);
  });

  it("keeps both project card descriptions close to 75 words", () => {
    const wordCounts = projects.map((project) =>
      [project.description, project.additionalDescription]
        .filter(Boolean)
        .join(" ")
        .trim()
        .split(/\s+/).length,
    );

    for (const wordCount of wordCounts) {
      expect(wordCount).toBeGreaterThanOrEqual(70);
      expect(wordCount).toBeLessThanOrEqual(76);
    }
  });

  it("centers the service and name for each project", () => {
    for (const project of projects.filter((item) => !item.websiteUrl)) {
      const markup = renderToStaticMarkup(
        createElement(ProjectCard, { project }),
      );

      expect(markup).toContain('class="project-card project-card--centered"');
      expect(markup).toContain(project.service.replaceAll("&", "&amp;"));
      expect(markup).toContain(project.name);
    }
  });

  it("renders the Rehas featured project with full description and secure project links", () => {
    const rehas = projects.find((project) => project.id === "rehas");

    if (!rehas) {
      throw new Error("Rehas project is missing.");
    }

    const markup = renderToStaticMarkup(
      createElement(ProjectCard, { project: rehas }),
    ).replaceAll("&amp;", "&");

    expect(markup).toContain('class="project-card project-card--featured"');
    expect(markup).toContain('src="/images/rehas-logo.svg"');
    expect(markup).toContain(">REHAS</span>");
    expect(markup).toContain("<h3><a");
    expect(markup).toContain("Rehas.in</a></h3>");
    expect(markup).not.toContain("Wellness & Spiritual Platform");
    expect(markup).toContain(
      "Rehas.in is a digital wellness and spiritual platform bringing together ancient wisdom and modern wellness practices.",
    );
    expect(markup).toContain(
      'class="button button-primary project-website-link" href="https://rehas.in/" rel="noopener noreferrer" target="_blank"',
    );
    expect(markup).toContain("View Project");
    expect(markup).toContain(
      'aria-label="Visit Rehas.in website" class="project-brand-mark" href="https://rehas.in/" rel="noopener noreferrer" target="_blank"',
    );
    expect(markup).toContain(
      'href="https://rehas.in/" rel="noopener noreferrer" target="_blank">',
    );
  });

  it("renders Flappy's professional e-commerce description and case study", () => {
    const flappy = projects.find((project) => project.id === "flappy");

    if (!flappy) {
      throw new Error("Flappy project is missing.");
    }

    const markup = renderToStaticMarkup(
      createElement(ProjectCard, { project: flappy }),
    ).replaceAll("&amp;", "&");

    expect(markup).toContain(
      "Flappy is an e-commerce garments business, with a project focus on merchant account management.",
    );
    expect(markup).toContain(
      "Grace Technologies supported the business from the ground up as it established its digital commerce presence.",
    );
    expect(markup).toContain("E-commerce in Garments");
    expect(markup).toContain("Support from the Ground Up");
    expect(markup).toContain(
      "The work brought together the needs of a garments business operating through e-commerce and merchant account management.",
    );
    expect(markup).not.toContain("Detailed case study coming soon.");
  });

  it("renders the cropped Flappy logo, category, and name in order", () => {
    const flappy = projects.find((project) => project.id === "flappy");

    if (!flappy) {
      throw new Error("Flappy project is missing.");
    }

    const markup = renderToStaticMarkup(
      createElement(ProjectCard, { project: flappy }),
    );

    expect(markup).toContain("%2Fimages%2Fflappy-logo.jpg");
    expect(markup).toContain('alt="Flappy shopping bag logo mark"');
    const logoIndex = markup.indexOf("%2Fimages%2Fflappy-logo.jpg");
    const serviceIndex = markup.indexOf('<p class="project-service">');
    const nameIndex = markup.indexOf("<h3>Flappy</h3>");

    expect(logoIndex).toBeLessThan(serviceIndex);
    expect(serviceIndex).toBeLessThan(nameIndex);
  });

  it("places each project category above its name", () => {
    for (const project of projects) {
      const markup = renderToStaticMarkup(
        createElement(ProjectCard, { project }),
      );
      const serviceIndex = markup.indexOf('<p class="project-service">');
      const nameIndex = markup.indexOf(project.name, serviceIndex);

      expect(serviceIndex).toBeGreaterThanOrEqual(0);
      expect(nameIndex).toBeGreaterThan(serviceIndex);
    }
  });
});
