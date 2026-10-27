"use client";

import { useState, type FormEvent } from "react";
import { contactServices } from "@/data/contact-services";
import styles from "./feedback-form.module.css";

type FeedbackFields = Readonly<{
  name: string;
  email: string;
  service: string;
  rating: string;
  feedback: string;
}>;

type FeedbackErrors = Partial<Record<keyof FeedbackFields, string>>;
type SubmissionResponse = Readonly<{ message?: string; error?: string }>;

const initialFields: FeedbackFields = {
  name: "",
  email: "",
  service: "",
  rating: "",
  feedback: "",
};

function validateFields(fields: FeedbackFields): FeedbackErrors {
  const errors: FeedbackErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const feedback = fields.feedback.trim();

  if (name.length < 2) {
    errors.name = "Enter your name.";
  } else if (name.length > 100) {
    errors.name = "Your name must be 100 characters or fewer.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (email.length > 254) {
    errors.email = "Your email address must be 254 characters or fewer.";
  }

  if (!contactServices.some((service) => service === fields.service)) {
    errors.service = "Select the service you are sharing feedback about.";
  }

  if (!["1", "2", "3", "4", "5"].includes(fields.rating)) {
    errors.rating = "Choose a star rating from 1 to 5.";
  }

  if (feedback.length < 10) {
    errors.feedback = "Please enter at least 10 characters of feedback.";
  } else if (feedback.length > 5000) {
    errors.feedback = "Your feedback must be 5,000 characters or fewer.";
  }

  return errors;
}

export function FeedbackForm() {
  const [fields, setFields] = useState<FeedbackFields>(initialFields);
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [submissionIsError, setSubmissionIsError] = useState(false);

  function updateField(field: keyof FeedbackFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateFields(fields);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmissionIsError(true);
      setStatus("Please correct the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");
    setSubmissionIsError(false);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          service: fields.service,
          rating: Number(fields.rating),
          feedback: fields.feedback.trim(),
        }),
      });
      const result: SubmissionResponse = await response.json();

      if (!response.ok) {
        setSubmissionIsError(true);
        setStatus(
          result.error ?? "We could not save your feedback. Please try again.",
        );
        return;
      }

      setFields(initialFields);
      setErrors({});
      setStatus(
        result.message ??
          "Thank you. Your feedback has been received and will be reviewed before publication.",
      );
    } catch {
      setSubmissionIsError(true);
      setStatus(
        "We could not reach the feedback service. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      aria-busy={isSubmitting}
      className={styles.form}
      noValidate
      onSubmit={handleSubmit}
    >
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="feedback-name">Your name</label>
          <input
            autoComplete="name"
            id="feedback-name"
            maxLength={100}
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            required
            aria-describedby={errors.name ? "feedback-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            value={fields.name}
          />
          {errors.name && (
            <span className={styles.error} id="feedback-name-error">
              {errors.name}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="feedback-email">Email address</label>
          <input
            autoComplete="email"
            id="feedback-email"
            maxLength={254}
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            required
            type="email"
            aria-describedby={
              errors.email ? "feedback-email-error" : undefined
            }
            aria-invalid={Boolean(errors.email)}
            value={fields.email}
          />
          {errors.email && (
            <span className={styles.error} id="feedback-email-error">
              {errors.email}
            </span>
          )}
        </div>

        <fieldset
          aria-describedby={errors.rating ? "feedback-rating-error" : undefined}
          aria-invalid={Boolean(errors.rating)}
          className={`${styles.field} ${styles.fieldFull} ${styles.ratingField}`}
        >
          <legend>How would you rate your experience?</legend>
          <div className={styles.ratingOptions}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <label className={styles.ratingOption} key={rating}>
                <input
                  checked={fields.rating === String(rating)}
                  name="rating"
                  onChange={() => updateField("rating", String(rating))}
                  type="radio"
                  value={rating}
                  aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
                />
                <span aria-hidden="true">★</span>
              </label>
            ))}
          </div>
          {errors.rating && (
            <span className={styles.error} id="feedback-rating-error">
              {errors.rating}
            </span>
          )}
        </fieldset>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label htmlFor="feedback-service">Service</label>
          <select
            id="feedback-service"
            name="service"
            onChange={(event) => updateField("service", event.target.value)}
            required
            aria-describedby={
              errors.service ? "feedback-service-error" : undefined
            }
            aria-invalid={Boolean(errors.service)}
            value={fields.service}
          >
            <option disabled value="">
              Select a service
            </option>
            {contactServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {errors.service && (
            <span className={styles.error} id="feedback-service-error">
              {errors.service}
            </span>
          )}
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label htmlFor="feedback-message">Your feedback</label>
          <textarea
            id="feedback-message"
            maxLength={5000}
            minLength={10}
            name="feedback"
            onChange={(event) => updateField("feedback", event.target.value)}
            required
            rows={5}
            aria-describedby={
              errors.feedback ? "feedback-message-error" : undefined
            }
            aria-invalid={Boolean(errors.feedback)}
            value={fields.feedback}
          />
          {errors.feedback && (
            <span className={styles.error} id="feedback-message-error">
              {errors.feedback}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className="button button-primary"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Sending..." : "Submit Feedback"}
        </button>
        <p
          aria-atomic="true"
          aria-live="polite"
          className={submissionIsError ? styles.statusError : styles.status}
          role={submissionIsError ? "alert" : "status"}
        >
          {status}
        </p>
      </div>
    </form>
  );
}
