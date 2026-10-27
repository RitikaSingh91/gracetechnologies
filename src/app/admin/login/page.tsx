import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin-login";
import styles from "@/app/admin/admin.module.css";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className={styles.loginPage}>
      <AdminLogin />
    </main>
  );
}
