import type { Metadata } from "next";
import { AdminWhatsAppAnalytics } from "@/components/admin-whatsapp-analytics";

export const metadata: Metadata = {
  title: "WhatsApp analytics",
  robots: { index: false, follow: false },
};

export default function AdminWhatsAppPage() {
  return <AdminWhatsAppAnalytics />;
}
