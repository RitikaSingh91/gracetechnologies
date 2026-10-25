import { describe, expect, it } from "vitest";
import { validateClientFeedback } from "@/lib/client-feedback";

const validFeedback = {
  name: "Jordan Taylor",
  email: "jordan@company.com",
  service: "Digital Marketing",
  feedback: "The team was clear and helpful throughout the project.",
};

describe("Client feedback validation", () => {
  it("trims fields and validates known service options", () => {
    expect(
      validateClientFeedback({
        ...validFeedback,
        name: " Jordan Taylor ",
        email: " jordan@company.com ",
        feedback: " Helpful support throughout the project. ",
      }),
    ).toEqual({
      valid: true,
      feedback: {
        ...validFeedback,
        name: "Jordan Taylor",
        email: "jordan@company.com",
        feedback: "Helpful support throughout the project.",
      },
    });

  });

  it.each([
    [{ ...validFeedback, name: "" }, "at least 10 characters"],
    [{ ...validFeedback, email: "not-an-email" }, "valid email"],
    [{ ...validFeedback, service: "Unknown" }, "listed services"],
    [{ ...validFeedback, feedback: "Short" }, "at least 10 characters"],
  ])("rejects invalid feedback submissions", (input, expectedMessage) => {
    const result = validateClientFeedback(input);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain(expectedMessage);
    }
  });
});
