import type { Metadata } from "next";
import { AdminDemo } from "@/components/admin-demo";

export const metadata: Metadata = {
  title: "Demo service enquiries",
  robots: { index: false, follow: false },
};

export default function AdminDemoEnquiriesPage() {
  return <AdminDemo section="enquiries" />;
}
