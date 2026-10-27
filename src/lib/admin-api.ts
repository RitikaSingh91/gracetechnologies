import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import {
  SupabaseConfigurationError,
  SupabaseInsertError,
  SupabaseRequestError,
} from "@/lib/supabase";

export function unauthorizedAdminResponse() {
  return NextResponse.json(
    { error: "Please sign in to access this resource." },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

export function adminApiErrorResponse(error: unknown) {
  unstable_rethrow(error);

  if (error instanceof SupabaseConfigurationError) {
    return NextResponse.json(
      {
        code: "SUPABASE_NOT_CONFIGURED",
        error: "This feature requires Supabase configuration and the database schema.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (error instanceof SupabaseRequestError || error instanceof SupabaseInsertError) {
    console.error("An administrative request failed in Supabase.", {
      status: error.status,
    });
  } else {
    console.error("An administrative request failed unexpectedly.");
  }
  return NextResponse.json(
    { error: "The administrative request could not be completed." },
    { status: 502, headers: { "Cache-Control": "no-store" } },
  );
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || new URL(request.url).origin === origin;
}

export function getClientAddress(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",").at(-1)?.trim() || "unknown";
}
