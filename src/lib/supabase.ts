import "server-only";

import type { ClientFeedback } from "@/lib/client-feedback";
import type { ContactInquiry } from "@/lib/contact-inquiry";
import { createHmac } from "node:crypto";

export class SupabaseConfigurationError extends Error {
  constructor() {
    super("Supabase server environment variables are not configured.");
    this.name = "SupabaseConfigurationError";
  }
}

export class SupabaseInsertError extends Error {
  constructor(readonly status: number) {
    super("Supabase did not save the submitted record.");
    this.name = "SupabaseInsertError";
  }
}

export class SupabaseRequestError extends Error {
  constructor(readonly status: number) {
    super("Supabase rejected the administrative request.");
    this.name = "SupabaseRequestError";
  }
}

export type AdminInquiry = Readonly<{
  id: string;
  name: string;
  email: string;
  mobile_number: string | null;
  company: string | null;
  service: string;
  project_budget: string | null;
  message: string;
  submission_type: "contact" | "enquiry";
  status: string;
  internal_note: string | null;
  created_at: string;
}>;

export type AdminInquiryPage = Readonly<{
  records: AdminInquiry[];
  total: number;
}>;

export type WhatsAppClickEvent = Readonly<{
  id: string;
  page_path: string;
  device_type: "mobile" | "tablet" | "desktop" | "unknown";
  browser: string;
  created_at: string;
}>;

function getSupabaseCredentials() {
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

  return { projectUrl, serviceRoleKey };
}

function getSupabaseAuthCredentials() {
  const { projectUrl } = getSupabaseCredentials();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!anonKey) {
    throw new SupabaseConfigurationError();
  }

  return { projectUrl, anonKey };
}

function getAdminCredentials() {
  const credentials = getSupabaseCredentials();
  const adminUserId = process.env.SUPABASE_ADMIN_USER_ID;

  if (!adminUserId) {
    throw new SupabaseConfigurationError();
  }

  return { ...credentials, adminUserId };
}

async function supabaseServiceRequest(
  pathname: string,
  init: RequestInit = {},
): Promise<Response> {
  const { projectUrl, serviceRoleKey } = getSupabaseCredentials();
  const response = await fetch(`${projectUrl.origin}${pathname}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new SupabaseRequestError(response.status);
  }

  return response;
}

async function insertSupabaseRecord(
  table: "contact_inquiries" | "client_feedback" | "whatsapp_click_events",
  record: Readonly<Record<string, string | null | boolean>>,
): Promise<void> {
  const { projectUrl, serviceRoleKey } = getSupabaseCredentials();
  const response = await fetch(
    `${projectUrl.origin}/rest/v1/${table}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: "Bearer " + serviceRoleKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    throw new SupabaseInsertError(response.status);
  }
}

export async function insertContactInquiry(
  inquiry: ContactInquiry,
): Promise<void> {
  await insertSupabaseRecord("contact_inquiries", {
    name: inquiry.name,
    email: inquiry.email,
    mobile_number: inquiry.mobileNumber,
    company: inquiry.company,
    service: inquiry.service ?? "General enquiry",
    project_budget: inquiry.projectBudget,
    message: inquiry.message,
    submission_type: inquiry.submissionType,
  });
}

export async function signInAdmin(
  email: string,
  password: string,
): Promise<Readonly<{ accessToken: string; expiresIn: number; user: Record<string, unknown> }> | null> {
  const { projectUrl, anonKey } = getSupabaseAuthCredentials();
  const response = await fetch(
    `${projectUrl.origin}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (response.status === 400 || response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new SupabaseRequestError(response.status);
  }

  const result: unknown = await response.json();
  if (
    typeof result !== "object" ||
    result === null ||
    !("access_token" in result) ||
    typeof result.access_token !== "string" ||
    !("user" in result) ||
    typeof result.user !== "object" ||
    result.user === null
  ) {
    throw new SupabaseRequestError(502);
  }

  const tokenResult = result as Record<string, unknown>;
  return {
    accessToken: result.access_token,
    expiresIn:
      typeof tokenResult.expires_in === "number" ? tokenResult.expires_in : 3600,
    user: result.user as Record<string, unknown>,
  };
}

export async function getAdminUser(accessToken: string): Promise<Record<string, unknown> | null> {
  const { projectUrl, anonKey } = getSupabaseAuthCredentials();
  const response = await fetch(`${projectUrl.origin}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new SupabaseRequestError(response.status);
  }

  const user: unknown = await response.json();
  return typeof user === "object" && user !== null
    ? (user as Record<string, unknown>)
    : null;
}

export async function signOutAdmin(accessToken: string): Promise<void> {
  const { projectUrl, anonKey } = getSupabaseAuthCredentials();
  const response = await fetch(`${projectUrl.origin}/auth/v1/logout`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok && response.status !== 401) {
    throw new SupabaseRequestError(response.status);
  }
}

export async function updateAdminPassword(
  accessToken: string,
  password: string,
): Promise<void> {
  const { projectUrl, anonKey } = getSupabaseAuthCredentials();
  const response = await fetch(`${projectUrl.origin}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new SupabaseRequestError(response.status);
  }
}

export function isConfiguredAdmin(user: Record<string, unknown>): boolean {
  return user.id === getAdminCredentials().adminUserId;
}

export async function consumeRequestRateLimit(
  identity: string,
  maxAttempts = 5,
  windowSeconds = 900,
): Promise<boolean> {
  const { serviceRoleKey } = getSupabaseCredentials();
  const identityHash = createHmac("sha256", serviceRoleKey)
    .update(identity)
    .digest("hex");
  const response = await supabaseServiceRequest(
    "/rest/v1/rpc/consume_request_rate_limit",
    {
      method: "POST",
      body: JSON.stringify({
        p_identity_hash: identityHash,
        p_max_attempts: maxAttempts,
        p_window_seconds: windowSeconds,
      }),
    },
  );
  const allowed: unknown = await response.json();
  return allowed === true;
}

export async function listAdminInquiries(options: {
  type: "contact" | "enquiry";
  status?: string;
  search?: string;
  limit: number;
  offset: number;
}): Promise<AdminInquiryPage> {
  const params = new URLSearchParams({
    select:
      "id,name,email,mobile_number,company,service,project_budget,message,submission_type,status,internal_note,created_at",
    submission_type: `eq.${options.type}`,
    order: "created_at.desc",
    limit: String(options.limit),
    offset: String(options.offset),
  });
  if (options.status) {
    params.set("status", `eq.${options.status}`);
  }
  if (options.search) {
    const search = options.search.replace(/[%*,()]/g, "").trim();
    if (search) {
      const term = `*${search}*`;
      params.set(
        "or",
        `(name.ilike.${term},email.ilike.${term},mobile_number.ilike.${term},company.ilike.${term},service.ilike.${term},message.ilike.${term})`,
      );
    }
  }

  const response = await supabaseServiceRequest(
    `/rest/v1/contact_inquiries?${params.toString()}`,
    { headers: { Prefer: "count=exact" } },
  );
  const result: unknown = await response.json();
  if (!Array.isArray(result)) {
    throw new SupabaseRequestError(502);
  }
  const contentRange = response.headers.get("content-range");
  const rawTotal = contentRange?.split("/")[1];
  return {
    records: result as AdminInquiry[],
    total: rawTotal && rawTotal !== "*" ? Number(rawTotal) : result.length,
  };
}

export async function updateAdminInquiry(
  id: string,
  type: "contact" | "enquiry",
  updates: Readonly<{ status?: string; internal_note?: string }>,
): Promise<void> {
  const params = new URLSearchParams({
    id: `eq.${id}`,
    submission_type: `eq.${type}`,
  });
  await supabaseServiceRequest(
    `/rest/v1/contact_inquiries?${params.toString()}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(updates),
    },
  );
}

export async function countAdminInquiries(
  type: "contact" | "enquiry",
  status?: string,
): Promise<number> {
  const params = new URLSearchParams({
    select: "id",
    submission_type: `eq.${type}`,
  });
  if (status) {
    params.set("status", `eq.${status}`);
  }
  const response = await supabaseServiceRequest(
    `/rest/v1/contact_inquiries?${params.toString()}`,
    {
      method: "HEAD",
      headers: { Prefer: "count=exact" },
    },
  );
  const range = response.headers.get("content-range");
  const total = range?.split("/")[1];
  return total && total !== "*" ? Number(total) : 0;
}

export async function insertWhatsAppClick(event: {
  pagePath: string;
  deviceType: WhatsAppClickEvent["device_type"];
  browser: string;
}): Promise<void> {
  const { projectUrl, serviceRoleKey } = getSupabaseCredentials();
  const response = await fetch(
    `${projectUrl.origin}/rest/v1/whatsapp_click_events`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        page_path: event.pagePath,
        device_type: event.deviceType,
        browser: event.browser,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) {
    throw new SupabaseInsertError(response.status);
  }
}

export async function getWhatsAppAnalytics(
  since: string,
): Promise<WhatsAppClickEvent[]> {
  const params = new URLSearchParams({
    select: "id,page_path,device_type,browser,created_at",
    created_at: `gte.${since}`,
    order: "created_at.desc",
    limit: "5000",
  });
  const response = await supabaseServiceRequest(
    `/rest/v1/whatsapp_click_events?${params.toString()}`,
  );
  const result: unknown = await response.json();
  if (!Array.isArray(result)) {
    throw new SupabaseRequestError(502);
  }
  return result as WhatsAppClickEvent[];
}

export async function insertClientFeedback(
  feedback: ClientFeedback,
): Promise<void> {
  await insertSupabaseRecord("client_feedback", {
    name: feedback.name,
    email: feedback.email,
    service: feedback.service,
    feedback: feedback.feedback,
  });
}
