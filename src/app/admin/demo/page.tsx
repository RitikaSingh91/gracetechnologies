import type { Metadata } from "next";
import { AdminDemo } from "@/components/admin-demo";

export const metadata: Metadata = {
  title: "Admin demo preview",
  robots: { index: false, follow: false },
};

export default function AdminDemoDashboardPage() {
  return <AdminDemo section="dashboard" />;
}
