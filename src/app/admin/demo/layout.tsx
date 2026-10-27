import type { ReactNode } from "react";
import styles from "@/app/admin/admin.module.css";

export default function AdminDemoLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <main className={styles.adminPage}>{children}</main>;
}
