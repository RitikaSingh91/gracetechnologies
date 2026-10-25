import { NextResponse } from "next/server";
import { validateClientFeedback } from "@/lib/client-feedback";
import {
  insertClientFeedback,
  SupabaseConfigurationError,
  SupabaseInsertError,
} from "@/lib/supabase";

const maximumRequestBytes = 6_000;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > maximumRequestBytes) {
    return NextResponse.json(
      { error: "The submitted feedback is too large. Please shorten it." },
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
      { error: "The feedback submission could not be read. Please try again." },
      { status: 400 },
    );
  }

  const validation = validateClientFeedback(input);

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    await insertClientFeedback(validation.feedback);
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      console.error("Feedback form Supabase configuration is missing or invalid.");
      return NextResponse.json(
        {
          code: "SUPABASE_NOT_CONFIGURED",
          error:
            "Feedback could not be saved because the database is not configured. Please contact us by email instead.",
        },
        { status: 503 },
      );
    }

    if (error instanceof SupabaseInsertError) {
      console.error("Supabase rejected client feedback.", {
        status: error.status,
      });
    } else {
      console.error("Client feedback could not be saved.");
    }

    return NextResponse.json(
      {
        error:
          "We could not save your feedback right now. Please try again later.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      message:
        "Thank you. Your feedback has been received and will be reviewed before publication.",
    },
    { status: 201 },
  );
}
