"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import styles from "@/app/admin/admin.module.css";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/whatsapp", label: "WhatsApp analytics" },
  { href: "/admin/profile", label: "Admin profile" },
] as const;

export function AdminShell({
  children,
  email,
}: Readonly<{ children: ReactNode; email: string }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    setIsSigningOut(true);
    setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        const result: { error?: string } = await response.json();
        setError(result.error ?? "Could not sign out.");
      }
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setError("Sign-out could not reach the server. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.brandLink} href="/admin/dashboard">
          <BrandLogo className={styles.adminBrandLogo} />
          <span>Grace Technologies <small>Admin</small></span>
        </Link>
        <div className={styles.account}>
          <span className={styles.accountEmail}>{email}</span>
          <button className={styles.secondaryButton} disabled={isSigningOut} onClick={signOut} type="button">
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </header>
      <div className={styles.shellBody}>
        <nav aria-label="Admin navigation" className={styles.sidebar}>
          {navigation.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              className={styles.navLink}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link className={styles.publicLink} href="/">View public website ↗</Link>
        </nav>
        <div className={styles.content}>
          {error && <p className={styles.errorMessage} role="alert">{error}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
