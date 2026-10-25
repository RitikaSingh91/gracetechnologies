import { contactServices, type ContactService } from "@/data/contact-services";

export type ClientFeedback = Readonly<{
  name: string;
  email: string;
  service: ContactService;
  feedback: string;
}>;

type ClientFeedbackValidation =
  | Readonly<{ valid: true; feedback: ClientFeedback }>
  | Readonly<{ valid: false; error: string }>;

export function validateClientFeedback(
  input: unknown,
): ClientFeedbackValidation {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { valid: false, error: "Please check the form and try again." };
  }

  const values = input as Record<string, unknown>;
  const name = typeof values.name === "string" ? values.name.trim() : "";
  const email = typeof values.email === "string" ? values.email.trim() : "";
  const service = typeof values.service === "string" ? values.service.trim() : "";
  const feedback =
    typeof values.feedback === "string" ? values.feedback.trim() : "";

  if (name.length < 2 || !email || !service || feedback.length < 10) {
    return {
      valid: false,
      error:
        "Please provide your name, email, service, and at least 10 characters of feedback.",
    };
  }

  if (
    name.length > 100 ||
    email.length > 254 ||
    feedback.length > 5000
  ) {
    return {
      valid: false,
      error: "One or more fields are too long. Please shorten them and try again.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  const selectedService = contactServices.find((item) => item === service);

  if (!selectedService) {
    return { valid: false, error: "Please select one of the listed services." };
  }

  return {
    valid: true,
    feedback: { name, email, service: selectedService, feedback },
  };
}
