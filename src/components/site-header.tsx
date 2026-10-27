"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const navigation = [
  { href: "/#home", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#our-work", label: "Our Work" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#partnership", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <header className="site-header page-container">
      <Link
        aria-label="Grace Technologies home"
        className="brand header-brand"
        href="/#home"
      >
        <BrandLogo className="header-brand-logo" />
      </Link>

      <nav aria-label="Main navigation" className="main-navigation">
        {navigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        aria-controls="mobile-navigation"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="mobile-menu-toggle"
        onClick={() => setIsMenuOpen((open) => !open)}
        type="button"
      >
        {isMenuOpen ? (
          <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>

      <nav
        aria-label="Mobile navigation"
        className={`mobile-navigation${isMenuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
      >
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        aria-controls="enquiry-modal"
        aria-haspopup="dialog"
        className="button button-primary header-consultation-button"
        data-enquiry-trigger
        type="button"
      >
        Get Free Consultation
      </button>
    </header>
  );
}
