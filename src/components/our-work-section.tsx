import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";

export function OurWorkSection() {
  return (
    <section
      aria-labelledby="our-work-title"
      className="our-work-section page-container"
      id="our-work"
    >
      <div className="section-heading">
        <p className="eyebrow">Selected projects</p>
        <h2 id="our-work-title">Our Work</h2>
        <p>
          Selected work across web development and e-commerce business support.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
