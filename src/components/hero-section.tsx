import Image from "next/image";

const highlights = [
  { label: "Client-focused solutions", icon: "team" },
  { label: "Reliable technology", icon: "shield" },
  { label: "End-to-end support", icon: "globe" },
] as const;

const statistics = [
  { value: "50+", label: "Projects Delivered" },
  { value: "15+", label: "Years of Experience" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support" },
] as const;

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero hero-container page-container"
    >
      <div className="hero-copy hero-text">
        <p
          aria-label="Grace Technologies Ltd. in collaboration with ANK Square Pvt. Ltd."
          className="eyebrow hero-partnership"
        >
          <span className="hero-partnership-caption">In collaboration</span>
          <span>Grace Technologies Ltd.</span>
          <span aria-hidden="true" className="hero-partnership-separator">
            ×
          </span>
          <span>ANK Square Pvt. Ltd.</span>
        </p>
        <h1 id="hero-title">Thoughtful technology for your business.</h1>
        <p className="hero-description">
          We create thoughtful digital solutions that help businesses connect
          with customers, work more efficiently, and grow with confidence.
        </p>
        <div className="hero-actions">
          <a className="button button-primary cta-button" href="#services">
            Explore Our Services
          </a>
          <a className="button button-secondary" href="#our-work">
            View Our Work
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="hero-image-wrapper">
        <Image
          alt=""
          className="responsive-graphic"
          fetchPriority="high"
          height={500}
          src="/images/creative-team.svg"
          width={750}
        />
      </div>

      <div aria-label="Company highlights and experience" className="hero-proof">
        <ul aria-label="Company highlights" className="hero-highlights">
          {highlights.map((highlight) => (
            <li className="hero-highlight" key={highlight.label}>
              <span aria-hidden="true" className="hero-highlight-icon">
                {highlight.icon === "globe" ? (
                  <svg fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18" />
                  </svg>
                ) : highlight.icon === "team" ? (
                  <svg fill="none" viewBox="0 0 24 24">
                    <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20m6-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7.5a4 4 0 0 1 0 7.75m1 3.25h1.5a3.5 3.5 0 0 1 3.5 3.5V20" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24">
                    <path d="M12 3 20 6v5.5c0 4.6-3.1 8.1-8 9.5-4.9-1.4-8-4.9-8-9.5V6l8-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                )}
              </span>
              <span>{highlight.label}</span>
            </li>
          ))}
        </ul>

        <ul aria-label="Company experience" className="hero-statistics">
          {statistics.map((statistic) => (
            <li className="hero-statistic" key={statistic.label}>
              <strong>{statistic.value}</strong>
              <span>{statistic.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
