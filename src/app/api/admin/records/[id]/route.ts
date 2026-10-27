import { NextResponse } from "next/server";
import {
  adminApiErrorResponse,
  isSameOriginRequest,
  unauthorizedAdminResponse,
} from "@/lib/admin-api";
import { getCurrentAdmin } from "@/lib/admin-session";
import { updateAdminInquiry } from "@/lib/supabase";

const validStatuses = [
  "new",
  "read",
  "pending",
  "contacted",
  "in_progress",
  "completed",
  "archived",
] as const;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await getCurrentAdmin())) {
      return unauthorizedAdminResponse();
    }
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Request could not be verified." }, { status: 403 });
    }
    if (Number(request.headers.get("content-length") ?? 0) > 4_000) {
      return NextResponse.json({ error: "Record update is too large." }, { status: 413 });
    }

    const { id } = await context.params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: "Invalid record." }, { status: 400 });
    }

    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid record update." }, { status: 400 });
    }
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return NextResponse.json({ error: "Invalid record update." }, { status: 400 });
    }

    const values = input as Record<string, unknown>;
    const updates: { status?: string; internal_note?: string } = {};
    const type = values.type;
    if (type !== "contact" && type !== "enquiry") {
      return NextResponse.json({ error: "Invalid record type." }, { status: 400 });
    }
    if ("status" in values) {
      if (
        typeof values.status !== "string" ||
        !validStatuses.includes(values.status as (typeof validStatuses)[number]) ||
        (type === "contact" && !["new", "read", "archived"].includes(values.status)) ||
        (type === "enquiry" && !["pending", "contacted", "in_progress", "completed", "archived"].includes(values.status))
      ) {
        return NextResponse.json({ error: "Choose a valid record status." }, { status: 400 });
      }
      updates.status = values.status;
    }
    if ("internal_note" in values) {
      if (
        typeof values.internal_note !== "string" ||
        values.internal_note.trim().length > 2_000
      ) {
        return NextResponse.json(
          { error: "Internal notes must be 2,000 characters or fewer." },
          { status: 400 },
        );
      }
      updates.internal_note = values.internal_note.trim() || "";
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No changes were provided." }, { status: 400 });
    }

    await updateAdminInquiry(id, type, updates);
    return NextResponse.json({ message: "Record updated." }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return adminApiErrorResponse(error);
  }
}
