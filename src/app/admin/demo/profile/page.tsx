import type { Metadata } from "next";
import { AdminDemo } from "@/components/admin-demo";

export const metadata: Metadata = {
  title: "Demo admin profile",
  robots: { index: false, follow: false },
};

export default function AdminDemoProfilePage() {
  return <AdminDemo section="profile" />;
}
