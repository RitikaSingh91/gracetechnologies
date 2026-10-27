import type { Metadata } from "next";
import { AdminDemo } from "@/components/admin-demo";

export const metadata: Metadata = {
  title: "Demo contact messages",
  robots: { index: false, follow: false },
};

export default function AdminDemoContactsPage() {
  return <AdminDemo section="contacts" />;
}
