import { NextResponse } from "next/server";
import { adminSessionCookie } from "@/lib/admin-session";
import {
  consumeRequestRateLimit,
  isConfiguredAdmin,
  signInAdmin,
  SupabaseConfigurationError,
  SupabaseRequestError,
} from "@/lib/supabase";

const maximumRequestBytes = 4_000;

function getClientAddress(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",").at(-1)?.trim() || "unknown";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(request.url).origin !== origin) {
    return NextResponse.json({ error: "Request could not be verified." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > maximumRequestBytes) {
    return NextResponse.json({ error: "Sign-in request is too large." }, { status: 413 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const values = input as Record<string, unknown>;
  const email = typeof values.email === "string" ? values.email.trim() : "";
  const password = typeof values.password === "string" ? values.password : "";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    password.length < 1 ||
    password.length > 1024
  ) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const allowed = await consumeRequestRateLimit(
      `admin-login:${getClientAddress(request)}`,
      5,
      900,
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please wait 15 minutes and try again." },
        { status: 429 },
      );
    }

    const result = await signInAdmin(email, password);
    if (!result || !isConfiguredAdmin(result.user)) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    const response = NextResponse.json({ email: result.user.email });
    response.cookies.set({
      name: adminSessionCookie,
      value: result.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(60, Math.min(3600, result.expiresIn)),
    });
    return response;
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return NextResponse.json(
        {
          code: "SUPABASE_NOT_CONFIGURED",
          error: "Admin sign-in is unavailable until Supabase and the admin account are configured.",
        },
        { status: 503 },
      );
    }
    if (error instanceof SupabaseRequestError) {
      console.error("Admin sign-in could not reach Supabase.", { status: error.status });
    } else {
      console.error("Admin sign-in failed unexpectedly.");
    }
    return NextResponse.json(
      { error: "Sign-in is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
