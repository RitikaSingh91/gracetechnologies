import { HeroSection } from "@/components/hero-section";
import { OurWorkSection } from "@/components/our-work-section";
import { ServicesSection } from "@/components/services-section";
import { SiteHeader } from "@/components/site-header";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { EnquiryModal } from "@/components/enquiry-modal";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialsSection } from "@/components/testimonials-section";

export default function Home() {
  return (
    <div className="site-shell" id="home">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        <ServicesSection />

        <OurWorkSection />

        <TestimonialsSection />

        <AboutSection />

        <ContactSection />
      </main>

      <EnquiryModal />

      <SiteFooter />
    </div>
  );
}
