import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminUser, isConfiguredAdmin } from "@/lib/supabase";

export const adminSessionCookie = "grace_admin_session";

export async function getCurrentAdmin(): Promise<
  Record<string, unknown> | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookie)?.value;
  if (!token) {
    return null;
  }

  const user = await getAdminUser(token);
  return user && isConfiguredAdmin(user) ? user : null;
}

export async function getAdminAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(adminSessionCookie)?.value ?? null;
}

export async function requireAdminPage(): Promise<
  Record<string, unknown>
> {
  const user = await getCurrentAdmin();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
