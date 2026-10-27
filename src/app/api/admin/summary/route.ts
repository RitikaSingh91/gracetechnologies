import { NextResponse } from "next/server";
import {
  adminApiErrorResponse,
  unauthorizedAdminResponse,
} from "@/lib/admin-api";
import { getCurrentAdmin } from "@/lib/admin-session";
import { countAdminInquiries } from "@/lib/supabase";

export async function GET() {
  try {
    if (!(await getCurrentAdmin())) {
      return unauthorizedAdminResponse();
    }
    const [
      totalContacts,
      newContacts,
      totalEnquiries,
      pendingEnquiries,
      inProgressEnquiries,
      completedEnquiries,
    ] = await Promise.all([
      countAdminInquiries("contact"),
      countAdminInquiries("contact", "new"),
      countAdminInquiries("enquiry"),
      countAdminInquiries("enquiry", "pending"),
      countAdminInquiries("enquiry", "in_progress"),
      countAdminInquiries("enquiry", "completed"),
    ]);
    return NextResponse.json(
      {
        totalContacts,
        newContacts,
        totalEnquiries,
        pendingEnquiries,
        inProgressEnquiries,
        completedEnquiries,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return adminApiErrorResponse(error);
  }
}
