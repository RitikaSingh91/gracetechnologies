import Image from "next/image";
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
        <p className="eyebrow">Working in partnership</p>
        <div className="about-partnership-logos">
          <div className="about-partner-brand">
            <BrandLogo className="about-partnership-logo" />
            <span>Grace Technologies</span>
          </div>
          <span aria-hidden="true" className="about-partnership-connector">
            +
          </span>
          <a
            aria-label="ANK Square Pvt. Ltd. website"
            className="about-partner-brand"
            href="https://www.anksquare.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="ANK Square"
              className="about-partnership-logo about-partnership-logo-ank"
              height={160}
              src="https://www.anksquare.com/logo.svg"
              unoptimized
              width={160}
            />
            <span>ANK Square Pvt. Ltd.</span>
          </a>
        </div>
        <p className="about-partner-name">
          Two teams, working together to support your business.
        </p>
        <p className="about-region">Working across the UK, USA, and India</p>
      </aside>
    </section>
  );
}
