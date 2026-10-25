import { contactServices, type ContactService } from "@/data/contact-services";

export type ContactInquiry = Readonly<{
  name: string;
  email: string;
  mobileNumber: string | null;
  company: string | null;
  service: ContactService | null;
  message: string;
}>;

type ContactInquiryValidation =
  | Readonly<{ valid: true; inquiry: ContactInquiry }>
  | Readonly<{ valid: false; error: string }>;

function readTrimmedText(
  values: Record<string, unknown>,
  field: string,
): string | null {
  const value = values[field];
  return typeof value === "string" ? value.trim() : null;
}

export function validateContactInquiry(
  input: unknown,
): ContactInquiryValidation {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { valid: false, error: "Please check the form and try again." };
  }

  const values = input as Record<string, unknown>;
  const name = readTrimmedText(values, "name");
  const email = readTrimmedText(values, "email");
  const mobileValue = values.mobile_number ?? values.phone;
  const phoneRequired = Object.hasOwn(values, "phone");
  const mobileNumber =
    mobileValue === undefined || mobileValue === null
      ? ""
      : typeof mobileValue === "string"
        ? mobileValue.trim()
        : null;
  const companyValue = values.company;
  const company =
    companyValue === undefined || companyValue === null
      ? ""
      : typeof companyValue === "string"
        ? companyValue.trim()
        : null;
  const service = readTrimmedText(values, "service");
  const message = readTrimmedText(values, "message");

  if (
    !name ||
    name.length < 2 ||
    !email ||
    !message ||
    mobileNumber === null ||
    company === null ||
    (phoneRequired && !mobileNumber)
  ) {
    return {
      valid: false,
      error: "Please complete all required fields and try again.",
    };
  }

  if (
    name.length > 100 ||
    email.length > 254 ||
    mobileNumber.length > 40 ||
    company.length > 160 ||
    message.length > 5000 ||
    (service !== null && service.length > 100)
  ) {
    return {
      valid: false,
      error: "One or more fields are too long. Please shorten them and try again.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      valid: false,
      error: "Please enter a valid business email address.",
    };
  }

  if (
    mobileNumber &&
    (!/^[+()\d\s./-]+$/.test(mobileNumber) ||
      mobileNumber.replace(/\D/g, "").length < 7 ||
      mobileNumber.replace(/\D/g, "").length > 15)
  ) {
    return {
      valid: false,
      error: "Please enter a valid phone number, including its country code.",
    };
  }

  const selectedService: ContactService | null = service
    ? contactServices.find((option) => option === service) ?? null
    : null;

  if (service && !selectedService) {
    return {
      valid: false,
      error: "Please choose one of the listed services.",
    };
  }

  return {
    valid: true,
    inquiry: {
      name,
      email,
      mobileNumber: mobileNumber || null,
      company: company || null,
      service: selectedService,
      message,
    },
  };
}
