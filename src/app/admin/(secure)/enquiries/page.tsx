import type { Metadata } from "next";
import { AdminInquiryManager } from "@/components/admin-inquiry-manager";

export const metadata: Metadata = {
  title: "Service enquiries",
  robots: { index: false, follow: false },
};

export default async function AdminEnquiriesPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ status?: string }> }>) {
  const { status } = await searchParams;
  return <AdminInquiryManager initialStatus={status} type="enquiry" />;
}
