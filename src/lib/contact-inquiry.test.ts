import { describe, expect, it } from "vitest";
import { validateContactInquiry } from "@/lib/contact-inquiry";

const validInquiry = {
  name: "Jordan Taylor",
  phone: "+1 (555) 000-0000",
  email: "jordan@company.com",
  message: "I would like to discuss a web project.",
};

describe("Contact inquiry validation", () => {
  it.each([
    ["US", "+1 (555) 000-0000"],
    ["UK", "+44 20 7946 0958"],
    ["India", "+91 98765 43210"],
  ])("accepts a valid %s phone number", (_region, phone) => {
    expect(validateContactInquiry({ ...validInquiry, phone }).valid).toBe(true);
  });

  it("trims inquiry fields before returning them", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      name: "  Jordan Taylor  ",
      phone: "  +44 20 7946 0958 ",
      email: " jordan@company.com ",
      message: "  Project details  ",
    });

    expect(result).toMatchObject({
      valid: true,
      inquiry: {
        name: "Jordan Taylor",
        mobileNumber: "+44 20 7946 0958",
        email: "jordan@company.com",
        message: "Project details",
      },
    });
  });

  it.each([
    [{ ...validInquiry, name: " " }, "complete all required fields"],
    [{ ...validInquiry, email: "not-an-email" }, "valid business email"],
    [{ ...validInquiry, phone: "12345" }, "valid phone number"],
    [{ ...validInquiry, phone: "" }, "complete all required fields"],
    [{ ...validInquiry, message: " " }, "complete all required fields"],
  ])("rejects invalid input with a useful message", (input, expectedMessage) => {
    const result = validateContactInquiry(input);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain(expectedMessage);
    }
  });

  it("keeps the existing modal's optional phone number compatible", () => {
    const result = validateContactInquiry({
      name: "Jordan Taylor",
      email: "jordan@company.com",
      service: "Digital Marketing",
      message: "Please contact me about a project.",
    });

    expect(result.valid).toBe(true);
  });

  it("classifies the public contact form separately from service enquiries", () => {
    const contact = validateContactInquiry(validInquiry);
    const enquiry = validateContactInquiry({
      ...validInquiry,
      service: "Digital Marketing",
      submission_type: "enquiry",
    });

    expect(contact).toMatchObject({
      valid: true,
      inquiry: { submissionType: "contact" },
    });
    expect(enquiry).toMatchObject({
      valid: true,
      inquiry: { submissionType: "enquiry" },
    });
  });

  it("accepts an optional project budget for service enquiries", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      service: "Web & Mobile App Development",
      submission_type: "enquiry",
      project_budget: "$5,000–$15,000",
    });

    expect(result).toMatchObject({
      valid: true,
      inquiry: { projectBudget: "$5,000–$15,000" },
    });
  });

  it("rejects malformed or oversized project budget values", () => {
    expect(
      validateContactInquiry({ ...validInquiry, project_budget: 5000 }).valid,
    ).toBe(false);
    expect(
      validateContactInquiry({
        ...validInquiry,
        project_budget: "x".repeat(101),
      }).valid,
    ).toBe(false);
  });

  it("rejects unknown submission types", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      submission_type: "internal",
    });

    expect(result.valid).toBe(false);
  });
});
