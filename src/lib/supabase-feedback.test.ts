import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  insertClientFeedback,
  SupabaseConfigurationError,
} from "@/lib/supabase";

const feedback = {
  name: "Jordan Taylor",
  email: "jordan@company.com",
  service: "Digital Marketing" as const,
  rating: 5,
  feedback: "The team was clear and helpful throughout the project.",
};

describe("Supabase client feedback persistence", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("reports missing Supabase configuration instead of saving", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    await expect(insertClientFeedback(feedback)).rejects.toBeInstanceOf(
      SupabaseConfigurationError,
    );
  });

  it("inserts feedback into the review-only feedback table", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 201 }));

    await insertClientFeedback(feedback);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.supabase.co/rest/v1/client_feedback",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          apikey: "test-service-role-key",
          Authorization: "Bearer test-service-role-key",
          Prefer: "return=minimal",
        }),
        body: JSON.stringify(feedback),
      }),
    );
  });
});
