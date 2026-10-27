import type { Metadata } from "next";
import { AdminProfile } from "@/components/admin-profile";

export const metadata: Metadata = {
  title: "Admin profile",
  robots: { index: false, follow: false },
};

export default function AdminProfilePage() {
  return <AdminProfile />;
}
