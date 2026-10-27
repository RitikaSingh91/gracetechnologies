"use client";

import { testimonials } from "@/data/testimonials";
import { FeedbackForm } from "@/components/feedback-form";
import styles from "./testimonials-section.module.css";

const publishedTestimonials = testimonials.filter(
  (testimonial) => testimonial.published,
);
const displayedTestimonials =
  publishedTestimonials.length > 0 ? publishedTestimonials : testimonials;

export function TestimonialsSection() {
  const hasPublishedTestimonials = publishedTestimonials.length > 0;

  return (
    <section
      aria-labelledby="testimonials-title"
      className={`${styles.section} page-container`}
      id="testimonials"
    >
      <div className={styles.heading}>
        <h2 className={styles.title} id="testimonials-title">
          <span className={styles.titleAccent}>Client Experiences</span>
          <span className={styles.titleDivider} aria-hidden="true"> | </span>
          <span>Trusted Partnerships</span>
          <span className={styles.titleDivider} aria-hidden="true"> | </span>
          <span className={styles.titleAccent}>Meaningful Results</span>
        </h2>
      </div>

      {!hasPublishedTestimonials && (
        <p className={styles.previewNote}>
          Layout preview only. Client feedback will appear here once approved
          for publication.
        </p>
      )}
      <ul
        aria-label={
          hasPublishedTestimonials
            ? "Client testimonials"
            : "Client feedback layout preview"
        }
        className={styles.grid}
      >
        {displayedTestimonials.map((testimonial) => (
          <li className={styles.card} key={testimonial.id}>
            <div className={styles.cardHeading}>
              <p className={styles.service}>{testimonial.service}</p>
              <svg
                aria-hidden="true"
                className={styles.quoteIcon}
                fill="none"
                viewBox="0 0 32 32"
              >
                <path
                  d="M13.5 7.5H7.8a2.3 2.3 0 0 0-2.3 2.3v6.4a2.3 2.3 0 0 0 2.3 2.3h3.8c-.4 2.4-1.8 4.1-4.1 5.2m19-16.2h-5.7a2.3 2.3 0 0 0-2.3 2.3v6.4a2.3 2.3 0 0 0 2.3 2.3h3.8c-.4 2.4-1.8 4.1-4.1 5.2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
            {testimonial.published ? (
              <blockquote className={styles.quote}>{testimonial.quote}</blockquote>
            ) : (
              <p className={styles.placeholderMessage}>
                Approved client feedback will appear here.
              </p>
            )}
            <div aria-hidden="true" className={styles.divider} />
            <div className={styles.attribution}>
              <span aria-hidden="true" className={styles.avatar}>
                {testimonial.clientName
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div className={styles.attributionText}>
                <strong>
                  {testimonial.published
                    ? testimonial.clientName
                    : "Feedback placeholder"}
                </strong>
                <span>
                  {testimonial.published
                    ? testimonial.clientDescription
                    : "Not published"}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.disclosure}>
        These testimonials are illustrative sample content and are not verified
        customer reviews.
      </p>
      <div className={styles.feedback}>
        <h3>Share your experience</h3>
        <p>Your review will be checked before it appears on this page.</p>
        <FeedbackForm />
      </div>
    </section>
  );
}
