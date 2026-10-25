"use client";

import { useRef, useState, type FormEvent } from "react";
import { companyInformation } from "@/data/company-information";

type ContactFields = Readonly<{
  name: string;
  phone: string;
  email: string;
  message: string;
}>;

type ContactErrors = Partial<Record<keyof ContactFields, string>>;
type SubmissionResponse = Readonly<{ message?: string; error?: string }>;

const initialFields: ContactFields = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

function validateFields(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  const name = fields.name.trim();
  const phone = fields.phone.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (name.length < 2) {
    errors.name = "Enter your full name.";
  } else if (name.length > 100) {
    errors.name = "Your name must be 100 characters or fewer.";
  }

  const phoneDigits = phone.replace(/\D/g, "").length;
  if (!phone) {
    errors.phone = "Enter a phone number so we can reach you.";
  } else if (!/^[+()\d\s./-]+$/.test(phone) || phoneDigits < 7 || phoneDigits > 15) {
    errors.phone = "Enter a valid phone number, including its country code.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (email.length > 254) {
    errors.email = "Your email address must be 254 characters or fewer.";
  }

  if (!message) {
    errors.message = "Tell us a little about your project.";
  } else if (message.length > 5000) {
    errors.message = "Your message must be 5,000 characters or fewer.";
  }

  return errors;
}

export function ContactSection() {
  const [fields, setFields] = useState<ContactFields>(initialFields);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [submissionIsError, setSubmissionIsError] = useState(false);
  const submissionInProgress = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  function updateField(field: keyof ContactFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    const validationErrors = validateFields(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmissionIsError(true);
      setStatus("Please correct the highlighted fields and try again.");
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setStatus("");
    setSubmissionIsError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          phone: fields.phone.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
          website: "",
        }),
      });
      const result: SubmissionResponse = await response.json();

      if (!response.ok) {
        setSubmissionIsError(true);
        setStatus(
          result.error ??
            "We could not save your inquiry right now. Please try again later.",
        );
        return;
      }

      setFields(initialFields);
      setErrors({});
      setStatus(
        result.message ??
          "Your inquiry has been saved. Thank you for contacting us.",
      );
    } catch {
      setSubmissionIsError(true);
      setStatus(
        "We could not reach the contact service. Please check your connection and try again.",
      );
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="contact-title"
      className="contact-section"
      id="contact"
    >
      <div className="contact-layout page-container">
        <form
          aria-busy={isSubmitting}
          className="contact-form contact-section-form"
          noValidate
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="contact-form-grid">
            <div className="form-field">
              <label htmlFor="contact-name">Full Name</label>
              <input
                autoComplete="name"
                id="contact-name"
                maxLength={100}
                name="name"
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Enter your full name"
                required
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                aria-invalid={Boolean(errors.name)}
                value={fields.name}
              />
              {errors.name && (
                <span className="contact-field-error" id="contact-name-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="contact-phone">Phone Number</label>
              <input
                autoComplete="tel"
                id="contact-phone"
                inputMode="tel"
                maxLength={40}
                name="phone"
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+1 (555) 000-0000"
                required
                aria-describedby={
                  errors.phone ? "contact-phone-error" : undefined
                }
                aria-invalid={Boolean(errors.phone)}
                value={fields.phone}
              />
              {errors.phone && (
                <span className="contact-field-error" id="contact-phone-error">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="contact-email">Email Address</label>
              <input
                autoComplete="email"
                id="contact-email"
                maxLength={254}
                name="email"
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@company.com"
                required
                type="email"
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                aria-invalid={Boolean(errors.email)}
                value={fields.email}
              />
              {errors.email && (
                <span className="contact-field-error" id="contact-email-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                maxLength={5000}
                name="message"
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Tell us about your project or business requirements..."
                required
                rows={5}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                aria-invalid={Boolean(errors.message)}
                value={fields.message}
              />
              {errors.message && (
                <span
                  className="contact-field-error"
                  id="contact-message-error"
                >
                  {errors.message}
                </span>
              )}
            </div>
          </div>

          <div className="contact-form-footer">
            <button
              className="button button-primary contact-submit-button"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && <span aria-hidden="true"> →</span>}
            </button>
            <p
              aria-atomic="true"
              aria-live="polite"
              className={`form-status${submissionIsError ? " form-status-error" : ""}`}
              role={submissionIsError ? "alert" : "status"}
            >
              {status}
            </p>
          </div>

          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input
              autoComplete="off"
              id="contact-website"
              name="website"
              tabIndex={-1}
            />
          </div>
        </form>

        <div className="contact-introduction">
          <p className="eyebrow">Contact us</p>
          <h2 id="contact-title">Let&apos;s Talk About Your Project</h2>
          <p className="contact-description">
            Have a business challenge or a technology idea? Tell us what you&apos;re
            working on. Our team would be glad to learn more and explore how we
            can help.
          </p>

          <address className="contact-information">
            <div className="contact-information-item">
              <span aria-hidden="true" className="contact-information-icon">
                <svg fill="none" viewBox="0 0 24 24">
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
              </span>
              <div>
                <span className="contact-information-label">Email</span>
                <a href={`mailto:${companyInformation.email}`}>
                  {companyInformation.email}
                </a>
              </div>
            </div>
            <div className="contact-information-item">
              <span aria-hidden="true" className="contact-information-icon">
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    d="M4 20V5.5L12 3l8 2.5V20M2 20h20M8 8h1m6 0h1M8 12h1m6 0h1M10 20v-4h4v4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                </svg>
              </span>
              <div>
                <span className="contact-information-label">Company</span>
                <span>Grace Technologies Ltd.</span>
              </div>
            </div>
            <div className="contact-information-item">
              <span aria-hidden="true" className="contact-information-icon">
                <svg fill="none" viewBox="0 0 24 24">
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
              </span>
              <div>
                <span className="contact-information-label">Location</span>
                <span>Romford, Greater London, United Kingdom</span>
              </div>
            </div>
          </address>

          <button
            aria-controls="enquiry-modal"
            aria-haspopup="dialog"
            className="button button-secondary contact-consultation-button"
            data-enquiry-trigger
            type="button"
          >
            Schedule a Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
