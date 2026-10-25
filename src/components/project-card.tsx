"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/data/projects";

type ProjectCardProps = Readonly<{
  project: Project;
}>;

export function ProjectCard({ project }: ProjectCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `${project.id}-case-study-title`;

  function openCaseStudy() {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }

  function closeCaseStudy() {
    dialogRef.current?.close();
  }

  return (
    <>
      <article
        className={`project-card${project.websiteUrl ? " project-card--featured" : " project-card--centered"}`}
      >
        {project.websiteUrl ? (
          <a
            aria-label={`Visit ${project.name} website`}
            className="project-brand-mark"
            href={project.websiteUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt=""
              className="project-brand-mark-icon"
              height={283}
              src="/images/rehas-logo.svg"
              width={283}
            />
            <span>REHAS</span>
          </a>
        ) : project.imageSrc ? (
          <div className="project-card-art project-card-art--logo">
            <Image
              alt={project.imageAlt ?? ""}
              className="project-card-logo"
              height={project.imageHeight ?? 255}
              src={project.imageSrc}
              width={project.imageWidth ?? 210}
            />
          </div>
        ) : project.wordmark ? (
          <div
            aria-hidden="true"
            className="project-card-art project-card-art--wordmark"
          >
            <span>{project.wordmark}</span>
          </div>
        ) : (
          <div aria-hidden="true" className="project-card-art">
            <span className="project-art-arch" />
            <span className="project-art-line" />
          </div>
        )}
        <div className="project-card-content">
          <p className="project-service">{project.service}</p>
          <h3>
            {project.websiteUrl ? (
              <a
                href={project.websiteUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {project.name}
              </a>
            ) : (
              project.name
            )}
          </h3>
          {project.subtitle && (
            <p className="project-subtitle">{project.subtitle}</p>
          )}
          <div className="project-description">
            <p>{project.description}</p>
            {project.additionalDescription && (
              <p>{project.additionalDescription}</p>
            )}
          </div>
          <div className="project-card-actions">
            {project.websiteUrl && (
              <a
                className="button button-primary project-website-link"
                href={project.websiteUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                View Project <span aria-hidden="true">↗</span>
              </a>
            )}
            <button
              aria-controls={`${project.id}-case-study`}
              aria-haspopup="dialog"
              className="project-link"
              onClick={openCaseStudy}
              type="button"
            >
              {project.caseStudyActionLabel ?? "View Case Study"}{" "}
              <span aria-hidden="true">
                {project.caseStudyActionLabel ? "↗" : "→"}
              </span>
            </button>
          </div>
        </div>
      </article>

      <dialog
        aria-labelledby={titleId}
        className="case-study-dialog"
        id={`${project.id}-case-study`}
        onCancel={(event) => {
          event.preventDefault();
          closeCaseStudy();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeCaseStudy();
          }
        }}
        ref={dialogRef}
      >
        <div className="case-study-dialog-content">
          <div className="case-study-dialog-header">
            <div>
              <p className="project-service">{project.service}</p>
              <h2 id={titleId}>{project.name}</h2>
            </div>
            <button
              aria-label="Close case study"
              className="case-study-close"
              onClick={closeCaseStudy}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="case-study-description">
            <p>{project.description}</p>
            {project.additionalDescription && (
              <p>{project.additionalDescription}</p>
            )}
          </div>

          <div className="case-study-details">
            {project.caseStudySections
              ? project.caseStudySections.map((section, index) => (
                  <section
                    aria-labelledby={`${project.id}-detail-${index}`}
                    key={section.heading}
                  >
                    <h3 id={`${project.id}-detail-${index}`}>
                      {section.heading}
                    </h3>
                    <p>{section.description}</p>
                  </section>
                ))
              : (
                  <>
                    <section aria-labelledby={`${project.id}-problem-title`}>
                      <h3 id={`${project.id}-problem-title`}>Problem</h3>
                      <p>{project.problem}</p>
                    </section>
                    <section aria-labelledby={`${project.id}-approach-title`}>
                      <h3 id={`${project.id}-approach-title`}>Approach</h3>
                      <p>{project.approach}</p>
                    </section>
                    <section aria-labelledby={`${project.id}-solution-title`}>
                      <h3 id={`${project.id}-solution-title`}>Solution</h3>
                      <p>{project.solution}</p>
                    </section>
                  </>
                )}
          </div>

          <form method="dialog" className="case-study-dialog-footer">
            <button className="button button-primary" type="submit">
              Close case study
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
