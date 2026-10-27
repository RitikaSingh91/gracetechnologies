import { NextResponse } from "next/server";
import {
  adminApiErrorResponse,
  isSameOriginRequest,
  unauthorizedAdminResponse,
} from "@/lib/admin-api";
import { getAdminAccessToken, getCurrentAdmin } from "@/lib/admin-session";
import {
  isConfiguredAdmin,
  signInAdmin,
  SupabaseRequestError,
  updateAdminPassword,
} from "@/lib/supabase";

export async function GET() {
  try {
    const user = await getCurrentAdmin();
    if (!user) {
      return unauthorizedAdminResponse();
    }
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return adminApiErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentAdmin();
    if (!user) {
      return unauthorizedAdminResponse();
    }
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Request could not be verified." }, { status: 403 });
    }

    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid password update." }, { status: 400 });
    }
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return NextResponse.json({ error: "Invalid password update." }, { status: 400 });
    }

    const values = input as Record<string, unknown>;
    const currentPassword =
      typeof values.currentPassword === "string" ? values.currentPassword : "";
    const newPassword =
      typeof values.newPassword === "string" ? values.newPassword : "";
    if (currentPassword.length < 1 || currentPassword.length > 1024) {
      return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
    }
    if (newPassword.length < 12 || newPassword.length > 1024) {
      return NextResponse.json(
        { error: "Use a new password with at least 12 characters." },
        { status: 400 },
      );
    }

    const reauthenticated = await signInAdmin(String(user.email), currentPassword);
    if (
      !reauthenticated ||
      !isConfiguredAdmin(reauthenticated.user) ||
      reauthenticated.user.id !== user.id
    ) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const token = await getAdminAccessToken();
    if (!token) {
      return unauthorizedAdminResponse();
    }
    await updateAdminPassword(token, newPassword);
    return NextResponse.json({ message: "Password updated." });
  } catch (error) {
    if (error instanceof SupabaseRequestError && error.status === 422) {
      return NextResponse.json(
        { error: "The new password does not meet your Supabase password policy." },
        { status: 400 },
      );
    }
    return adminApiErrorResponse(error);
  }
}
