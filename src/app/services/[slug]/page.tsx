import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryModal } from "@/components/enquiry-modal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { services } from "@/components/services-section";

type ServicePageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.id === slug);

  if (!service) {
    return { title: "Service not found" };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.id === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="service-page page-container">
        <nav aria-label="Breadcrumb" className="service-page-breadcrumb">
          <Link href="/#services">Services</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{service.title}</span>
        </nav>

        <header className="service-page-hero">
          <div className="service-page-hero-copy">
            <p className="eyebrow">Our services</p>
            <h1>{service.title}</h1>
            <p className="service-page-introduction">{service.description}</p>
            <Link className="button button-primary" href="/#contact">
              Contact Us
            </Link>
          </div>
          {service.image && (
            <div className="service-page-image-frame">
              <Image
                alt={service.image.alt}
                className="service-page-image"
                height={service.image.height}
                src={service.image.src}
                width={service.image.width}
                unoptimized
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          )}
        </header>

        <section
          aria-labelledby="service-overview-title"
          className="service-page-section"
        >
          <h2 id="service-overview-title">Service overview</h2>
          <h3>{service.details.heading}</h3>
          <p>{service.details.challenge}</p>
        </section>

        <section
          aria-labelledby="service-features-title"
          className="service-page-section"
        >
          <h2 id="service-features-title">Key features and benefits</h2>
          <ul className="service-page-feature-grid">
            {service.keyFeatures.map((feature) => (
              <li key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="service-approach-title"
          className="service-page-section"
        >
          <h2 id="service-approach-title">How this service helps businesses</h2>
          <ol className="service-page-approach-list">
            {service.details.approach.map((step) => (
              <li key={step.heading}>
                <strong>{step.heading}</strong>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="service-use-cases-title"
          className="service-page-section service-page-use-cases"
        >
          <h2 id="service-use-cases-title">Examples and use cases</h2>
          <ul>
            {service.useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </section>

        <section
          aria-label="Discuss this service"
          className="service-page-contact"
        >
          <div>
            <p className="eyebrow">Let&apos;s work together</p>
            <h2>Tell us what your business needs.</h2>
          </div>
          <Link className="button button-primary" href="/#contact">
            Get a Free Consultation
          </Link>
        </section>
      </main>
      <EnquiryModal />
      <SiteFooter />
    </div>
  );
}
