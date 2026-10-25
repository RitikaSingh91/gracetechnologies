import { BrandLogo } from "@/components/brand-logo";

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-title"
      className="about-section page-container"
      id="partnership"
    >
      <div className="about-copy">
        <p className="eyebrow">Our Partnership</p>
        <h2 id="about-title">
          Technology built around people and possibilities.
        </h2>
        <p>
          Grace Technologies Ltd. and ANK Square Pvt. Ltd. work in partnership,
          bringing our teams&apos; strengths together to support organizations
          across the UK, USA, and India.
        </p>
        <p>
          We collaborate from discovery through delivery, combining technology
          and business expertise to shape practical solutions around each
          client&apos;s needs.
        </p>
        <button
          aria-controls="enquiry-modal"
          aria-haspopup="dialog"
          className="button button-primary"
          data-enquiry-trigger
          type="button"
        >
          Let&apos;s Work Together
        </button>
      </div>

      <aside aria-label="Our collaboration" className="about-partnership">
        <div aria-hidden="true" className="about-partnership-arch" />
        <p className="eyebrow">A shared approach</p>
        <BrandLogo className="about-partnership-logo" />
        <span className="about-partnership-connector">in collaboration with</span>
        <p className="about-partner-name">ANK Square Pvt. Ltd.</p>
        <span aria-hidden="true" className="about-partnership-rule" />
        <p className="about-region">Working across the UK, USA, and India</p>
      </aside>
    </section>
  );
}
