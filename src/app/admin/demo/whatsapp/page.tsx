import type { Metadata } from "next";
import { AdminDemo } from "@/components/admin-demo";

export const metadata: Metadata = {
  title: "Demo WhatsApp analytics",
  robots: { index: false, follow: false },
};

export default function AdminDemoWhatsAppPage() {
  return <AdminDemo section="whatsapp" />;
}
