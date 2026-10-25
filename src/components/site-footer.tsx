import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { socialLinks } from "@/data/social-links";
import { companyInformation } from "@/data/company-information";

const quickLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#partnership", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#our-work", label: "Our Work" },
  { href: "/#contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

const serviceLinks = [
  {
    href: "/#web-mobile-app-development",
    label: "Web & Mobile App Development",
  },
  {
    href: "/#merchant-account-management",
    label: "Merchant Account Management",
  },
  {
    href: "/#agentic-ai-workflow-automation",
    label: "Agentic AI & Workflow Automation",
  },
  { href: "/#digital-marketing", label: "Digital Marketing" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main page-container">
        <section aria-labelledby="footer-brand-title" className="footer-brand">
          <Link
            aria-label="Grace Technologies Ltd. home"
            className="brand footer-wordmark"
            href="/#home"
          >
            <BrandLogo className="footer-brand-logo" />
          </Link>
          <address className="footer-address">
            Grace Technologies Ltd.
            <br />
            398 Whalebone Lane South
            <br />
            Romford, Greater London
            <br />
            RM6 6HP, United Kingdom
          </address>
        </section>

        <nav aria-label="Footer quick links" className="footer-navigation">
          <h2>Quick Links</h2>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Our services" className="footer-navigation">
          <h2>Our Services</h2>
          <ul>
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-contact-title" className="footer-contact">
          <h2 id="footer-contact-title">Contact</h2>
          <ul className="footer-contact-details">
            <li>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <rect
                  height="15"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  width="19"
                  x="2.5"
                  y="4.5"
                />
                <path
                  d="m3.5 6 8.5 7 8.5-7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
              <a href={`mailto:${companyInformation.email}`}>
                {companyInformation.email}
              </a>
            </li>
            {companyInformation.phone && (
              <li>
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M10 17.5h4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.7"
                  />
                </svg>
                <a href={`tel:${companyInformation.phone}`}>
                  {companyInformation.phone}
                </a>
              </li>
            )}
            {companyInformation.address && (
              <li>
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="2.2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
                <span>{companyInformation.address}</span>
              </li>
            )}
          </ul>
          <button
            aria-controls="enquiry-modal"
            aria-haspopup="dialog"
            className="button button-primary"
            data-enquiry-trigger
            type="button"
          >
            Let&apos;s Talk
          </button>
        </section>

        <section
          aria-label="ANK Square partner information"
          className="footer-partner"
        >
          <div className="footer-partner-introduction">
            <a
              aria-label="Ank Square website"
              className="footer-partner-logo-link"
              href="https://www.anksquare.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt="Ank Square"
                className="footer-partner-logo"
                height={48}
                src="https://www.anksquare.com/logo.svg"
                unoptimized
                width={160}
              />
            </a>
            <p>
              Empowering businesses with innovative digital solutions.
              Transform your vision into reality with our expertise.
            </p>
          </div>
          <ul className="footer-partner-details">
            <li>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <rect
                  height="15"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  width="19"
                  x="2.5"
                  y="4.5"
                />
                <path
                  d="m3.5 6 8.5 7 8.5-7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
              <a href="mailto:contact@anksquare.com">contact@anksquare.com</a>
            </li>
            <li>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path
                  d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M10 17.5h4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.7"
                />
              </svg>
              <a href="tel:+919939337638">+91-9939337638</a>
            </li>
            <li>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path
                  d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2.2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
              Ank Square Pvt. Ltd., Ramjaipal Road, Opp. Gola Road, Near Hotel
              Magadh Palace, Patna, Bihar, India - 801503
            </li>
          </ul>
        </section>
      </div>

      <section
        aria-labelledby="footer-social-title"
        className="site-footer-social page-container"
      >
        <div>
          <h2 id="footer-social-title">Connect With Us</h2>
          <p>
            Follow us for technology updates, projects, and company news.
          </p>
        </div>
        <ul aria-label="Social media and email links" className="footer-social-links">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                aria-label={link.name}
                className="footer-social-link"
                href={link.href}
                rel={link.opensNewTab ? "noopener noreferrer" : undefined}
                target={link.opensNewTab ? "_blank" : undefined}
                title={link.name}
              >
                {link.icon}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="site-footer-bottom">
        <p className="page-container">
          © 2026 Grace Technologies Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
