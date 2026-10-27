import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";

export function OurWorkSection() {
  return (
    <section
      aria-labelledby="our-work-title"
      className="our-work-section page-container"
      id="our-work"
    >
      <div className="section-heading our-work-heading">
        <h2 id="our-work-title">
          <span className="our-work-heading-accent">Selected Projects</span>
          <span className="our-work-heading-divider" aria-hidden="true"> | </span>
          <span>Our Work</span>
        </h2>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
