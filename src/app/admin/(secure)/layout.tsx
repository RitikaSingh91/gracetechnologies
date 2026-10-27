import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminPage } from "@/lib/admin-session";
import styles from "@/app/admin/admin.module.css";

export const metadata = {
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await requireAdminPage();
  return (
    <main className={styles.adminPage}>
      <AdminShell email={String(user.email ?? "")}>{children}</AdminShell>
    </main>
  );
}
