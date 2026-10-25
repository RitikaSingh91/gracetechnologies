import { NextResponse } from "next/server";
import { validateContactInquiry } from "@/lib/contact-inquiry";
import {
  insertContactInquiry,
  SupabaseConfigurationError,
  SupabaseInsertError,
} from "@/lib/supabase";

const maximumRequestBytes = 12_000;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > maximumRequestBytes) {
    return NextResponse.json(
      { error: "The submitted message is too large. Please shorten it." },
      { status: 413 },
    );
  }

  const origin = request.headers.get("origin");

  if (origin && new URL(request.url).origin !== origin) {
    return NextResponse.json(
      { error: "This request could not be verified. Please refresh and try again." },
      { status: 403 },
    );
  }

  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The form submission could not be read. Please try again." },
      { status: 400 },
    );
  }

  const validation = validateContactInquiry(input);

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const values =
    typeof input === "object" && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : null;

  if (values && typeof values.website === "string" && values.website.trim()) {
    return NextResponse.json(
      { message: "Your inquiry has been received." },
      { status: 201 },
    );
  }

  try {
    await insertContactInquiry(validation.inquiry);
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      console.error("Contact form Supabase configuration is missing or invalid.");
      return NextResponse.json(
        {
          code: "SUPABASE_NOT_CONFIGURED",
          error:
            "The contact form is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }

    if (error instanceof SupabaseInsertError) {
      console.error("Supabase rejected a contact inquiry.", {
        status: error.status,
      });
    } else {
      console.error("A contact inquiry could not be saved.");
    }

    return NextResponse.json(
      {
        error:
          "We could not save your inquiry right now. Please try again later.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { message: "Your inquiry has been saved. Thank you for contacting us." },
    { status: 201 },
  );
}
