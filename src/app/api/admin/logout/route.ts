import { NextResponse } from "next/server";
import {
  adminSessionCookie,
  getAdminAccessToken,
} from "@/lib/admin-session";
import {
  signOutAdmin,
  SupabaseConfigurationError,
  SupabaseRequestError,
} from "@/lib/supabase";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(request.url).origin !== origin) {
    return NextResponse.json({ error: "Request could not be verified." }, { status: 403 });
  }

  const token = await getAdminAccessToken();
  let signOutFailed = false;
  if (token) {
    try {
      await signOutAdmin(token);
    } catch (error) {
      signOutFailed = true;
      if (error instanceof SupabaseRequestError) {
        console.error("Supabase could not revoke the admin session.", {
          status: error.status,
        });
      } else if (!(error instanceof SupabaseConfigurationError)) {
        console.error("Admin session revocation failed unexpectedly.");
      }
    }
  }

  const response = NextResponse.json(
    signOutFailed
      ? { error: "The sign-out session could not be revoked. Please close this browser." }
      : { message: "Signed out." },
    { status: signOutFailed ? 502 : 200 },
  );
  response.cookies.set({
    name: adminSessionCookie,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
