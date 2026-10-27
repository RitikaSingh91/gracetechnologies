import { NextResponse } from "next/server";
import {
  adminApiErrorResponse,
  getClientAddress,
  isSameOriginRequest,
  unauthorizedAdminResponse,
} from "@/lib/admin-api";
import { getCurrentAdmin } from "@/lib/admin-session";
import {
  consumeRequestRateLimit,
  getWhatsAppAnalytics,
  insertWhatsAppClick,
} from "@/lib/supabase";

function getDeviceType(userAgent: string) {
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) {
    return "tablet" as const;
  }
  if (/mobile|android|iphone|ipod/i.test(userAgent)) {
    return "mobile" as const;
  }
  return userAgent ? ("desktop" as const) : ("unknown" as const);
}

function getBrowser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/opr\//i.test(userAgent)) return "Opera";
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/chrome\//i.test(userAgent) && !/chromium/i.test(userAgent)) return "Chrome";
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) return "Safari";
  return "Other";
}

export async function POST(request: Request) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Request could not be verified." }, { status: 403 });
    }
    if (Number(request.headers.get("content-length") ?? 0) > 1_000) {
      return NextResponse.json({ error: "Analytics event is too large." }, { status: 413 });
    }
    const allowed = await consumeRequestRateLimit(
      `whatsapp-click:${getClientAddress(request)}`,
      60,
      900,
    );
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
    }
    const path =
      typeof input === "object" &&
      input !== null &&
      !Array.isArray(input) &&
      "pagePath" in input &&
      typeof input.pagePath === "string"
        ? input.pagePath
        : "";
    if (!path.startsWith("/") || path.startsWith("//") || path.length > 200) {
      return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    await insertWhatsAppClick({
      pagePath: path.split("?")[0],
      deviceType: getDeviceType(userAgent),
      browser: getBrowser(userAgent),
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return adminApiErrorResponse(error);
  }
}

export async function GET(request: Request) {
  try {
    if (!(await getCurrentAdmin())) {
      return unauthorizedAdminResponse();
    }
    const period = new URL(request.url).searchParams.get("days") ?? "30";
    if (!["7", "30", "90"].includes(period)) {
      return NextResponse.json({ error: "Choose a supported reporting period." }, { status: 400 });
    }
    const since = new Date(Date.now() - Number(period) * 86_400_000).toISOString();
    const events = await getWhatsAppAnalytics(since);
    return NextResponse.json(
      { events, limited: events.length === 5000 },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return adminApiErrorResponse(error);
  }
}
