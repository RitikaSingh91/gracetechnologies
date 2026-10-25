import "server-only";

import type { ContactInquiry } from "@/lib/contact-inquiry";

export class SupabaseConfigurationError extends Error {
  constructor() {
    super("Supabase server environment variables are not configured.");
    this.name = "SupabaseConfigurationError";
  }
}

export class SupabaseInsertError extends Error {
  constructor(readonly status: number) {
    super("Supabase did not save the contact inquiry.");
    this.name = "SupabaseInsertError";
  }
}

export async function insertContactInquiry(
  inquiry: ContactInquiry,
): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new SupabaseConfigurationError();
  }

  let projectUrl: URL;

  try {
    projectUrl = new URL(supabaseUrl);
  } catch {
    throw new SupabaseConfigurationError();
  }

  const isLocalUrl = ["localhost", "127.0.0.1", "[::1]"].includes(
    projectUrl.hostname,
  );

  if (projectUrl.protocol !== "https:" && !isLocalUrl) {
    throw new SupabaseConfigurationError();
  }

  const response = await fetch(
    `${projectUrl.origin}/rest/v1/contact_inquiries`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: inquiry.name,
        email: inquiry.email,
        mobile_number: inquiry.mobileNumber,
        company: inquiry.company,
        service: inquiry.service ?? "General enquiry",
        message: inquiry.message,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    throw new SupabaseInsertError(response.status);
  }
}
