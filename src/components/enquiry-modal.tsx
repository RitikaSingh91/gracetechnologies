"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { contactServices, type ContactService } from "@/data/contact-services";

type SubmissionResponse = Readonly<{
  code?: string;
  message?: string;
  error?: string;
}>;

type SavedScrollStyles = Readonly<{
  body: string;
  document: string;
}>;

const automaticModalSessionKey = "grace-enquiry-modal-auto-shown";
const automaticModalDelay = 1500;

export function EnquiryModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const serviceSelectRef = useRef<HTMLSelectElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const savedScrollStylesRef = useRef<SavedScrollStyles | null>(null);
  const submissionInProgress = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionIsError, setSubmissionIsError] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || window.location.pathname !== "/") {
      return;
    }

    let automaticOpenTimeout: number | undefined;

    function openModal(
      returnFocusTarget: HTMLElement | null,
      selectedService?: string,
    ) {
      if (!dialog || dialog.open) {
        return;
      }

      const service = contactServices.find(
        (contactService): contactService is ContactService =>
          contactService === selectedService,
      );
      if (serviceSelectRef.current) {
        serviceSelectRef.current.value = service ?? "";
      }

      returnFocusRef.current = returnFocusTarget;
      savedScrollStylesRef.current = {
        body: document.body.style.overflow,
        document: document.documentElement.style.overflow,
      };
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setSubmissionMessage("");
      setSubmissionIsError(false);
      dialog.showModal();
    }

    function handleDocumentClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return;
      }

      const trigger = event.target.closest<HTMLButtonElement>(
        "button[data-enquiry-trigger]",
      );

      if (!trigger || !dialog || dialog.open) {
        return;
      }

      if (automaticOpenTimeout !== undefined) {
        window.clearTimeout(automaticOpenTimeout);
      }
      window.sessionStorage.setItem(automaticModalSessionKey, "true");
      openModal(trigger, trigger.dataset.enquiryService);
    }

    document.addEventListener("click", handleDocumentClick);

    if (
      window.sessionStorage.getItem(automaticModalSessionKey) !== "true"
    ) {
      const activeElement = document.activeElement;
      const returnFocusTarget =
        activeElement instanceof HTMLElement && activeElement !== document.body
          ? activeElement
          : document.querySelector<HTMLElement>("#main-content");

      automaticOpenTimeout = window.setTimeout(() => {
        window.sessionStorage.setItem(automaticModalSessionKey, "true");
        openModal(returnFocusTarget);
      }, automaticModalDelay);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);

      if (automaticOpenTimeout !== undefined) {
        window.clearTimeout(automaticOpenTimeout);
      }

      const savedScrollStyles = savedScrollStylesRef.current;

      if (savedScrollStyles) {
        document.body.style.overflow = savedScrollStyles.body;
        document.documentElement.style.overflow = savedScrollStyles.document;
        savedScrollStylesRef.current = null;
      }
    };
  }, []);

  function closeModal() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    const savedScrollStyles = savedScrollStylesRef.current;

    if (savedScrollStyles) {
      document.body.style.overflow = savedScrollStyles.body;
      document.documentElement.style.overflow = savedScrollStyles.document;
      savedScrollStylesRef.current = null;
    }

    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setSubmissionMessage("");
    setSubmissionIsError(false);

    const formData = new FormData(event.currentTarget);
    const inquiry = {
      ...Object.fromEntries(formData.entries()),
      submission_type: "enquiry",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      });
      const result: SubmissionResponse = await response.json();

      if (!response.ok) {
        setSubmissionIsError(true);
        setSubmissionMessage(
          result.code === "SUPABASE_NOT_CONFIGURED"
            ? "This contact form is currently a frontend preview. Your message has not been sent because Supabase is not configured."
            : result.error ?? "We could not save your inquiry. Please try again.",
        );
        return;
      }

      formRef.current?.reset();
      setSubmissionMessage(
        result.message ?? "Your inquiry has been saved. Thank you for contacting us.",
      );
    } catch {
      setSubmissionIsError(true);
      setSubmissionMessage(
        "We could not reach the contact service. Please check your connection and try again.",
      );
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <dialog
      aria-labelledby="enquiry-modal-title"
      aria-modal="true"
      className="enquiry-modal"
      id="enquiry-modal"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeModal();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
      onClose={handleDialogClose}
      ref={dialogRef}
    >
      <div className="enquiry-modal-panel">
        <header className="enquiry-modal-header">
          <BrandLogo className="enquiry-modal-logo" />
          <h2 id="enquiry-modal-title">Let&apos;s Talk</h2>
          <button
            aria-label="Close enquiry form"
            className="enquiry-modal-close"
            onClick={closeModal}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <form
          className="contact-form enquiry-form"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="contact-form-grid">
            <div className="form-field">
              <label htmlFor="enquiry-name">Name</label>
              <input
                autoComplete="name"
                autoFocus
                id="enquiry-name"
                maxLength={100}
                name="name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="enquiry-email">Business Email</label>
              <input
                autoComplete="email"
                id="enquiry-email"
                maxLength={254}
                name="email"
                required
                type="email"
              />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="enquiry-service">Service Type</label>
              <select
                defaultValue=""
                id="enquiry-service"
                name="service"
                required
                ref={serviceSelectRef}
              >
                <option disabled value="">
                  Choose a service
                </option>
                {contactServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="enquiry-message">Message</label>
              <textarea
                id="enquiry-message"
                maxLength={5000}
                name="message"
                required
                rows={3}
              />
            </div>
          </div>

          <div className="contact-form-footer enquiry-form-footer">
            <button
              className="button button-primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </button>
            <p
              aria-atomic="true"
              aria-live="polite"
              className={`form-status${submissionIsError ? " form-status-error" : ""}`}
              role={submissionIsError ? "alert" : "status"}
            >
              {submissionMessage}
            </p>
          </div>
        </form>
      </div>
    </dialog>
  );
}
