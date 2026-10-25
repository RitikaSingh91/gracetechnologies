import { BrandLogo } from "@/components/brand-logo";

const navigation = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#our-work", label: "Our Work" },
  { href: "#partnership", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header page-container">
      <a className="brand header-brand" href="#home">
        <BrandLogo className="header-brand-logo" />
      </a>

      <nav aria-label="Main navigation" className="main-navigation">
        {navigation.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
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
