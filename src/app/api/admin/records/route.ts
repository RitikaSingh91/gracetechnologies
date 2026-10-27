import { NextResponse } from "next/server";
import {
  adminApiErrorResponse,
  unauthorizedAdminResponse,
} from "@/lib/admin-api";
import { getCurrentAdmin } from "@/lib/admin-session";
import { listAdminInquiries } from "@/lib/supabase";

const validTypes = ["contact", "enquiry"] as const;
const validStatuses = [
  "new",
  "read",
  "pending",
  "contacted",
  "in_progress",
  "completed",
  "archived",
] as const;

export async function GET(request: Request) {
  try {
    if (!(await getCurrentAdmin())) {
      return unauthorizedAdminResponse();
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status") || undefined;
    const search = url.searchParams.get("search")?.slice(0, 100) || undefined;
    const rawLimit = Number(url.searchParams.get("limit") ?? 25);
    const rawOffset = Number(url.searchParams.get("offset") ?? 0);

    if (
      !validTypes.includes(type as (typeof validTypes)[number]) ||
      (status && !validStatuses.includes(status as (typeof validStatuses)[number])) ||
      !Number.isInteger(rawLimit) ||
      rawLimit < 1 ||
      rawLimit > 100 ||
      !Number.isInteger(rawOffset) ||
      rawOffset < 0 ||
      rawOffset > 100_000
    ) {
      return NextResponse.json({ error: "Invalid record filters." }, { status: 400 });
    }

    const result = await listAdminInquiries({
      type: type as "contact" | "enquiry",
      status,
      search,
      limit: rawLimit,
      offset: rawOffset,
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return adminApiErrorResponse(error);
  }
}
