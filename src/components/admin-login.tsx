"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import styles from "@/app/admin/admin.module.css";

type LoginResponse = Readonly<{
  error?: string;
  code?: string;
}>;

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result: LoginResponse = await response.json();
      if (!response.ok) {
        setStatus(result.error ?? "Sign-in failed. Please try again.");
        return;
      }
      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setStatus("The sign-in service could not be reached. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="admin-login-title" className={styles.loginCard}>
      <Link className={styles.brandLink} href="/">
        <BrandLogo className={styles.adminBrandLogo} />
        <span>Grace Technologies</span>
      </Link>
      <p className={styles.eyebrow}>Secure administration</p>
      <h1 id="admin-login-title">Sign in</h1>
      <p className={styles.muted}>Use the administrator account configured for this site.</p>
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.field}>
          <span>Email address</span>
          <input
            autoComplete="username"
            autoFocus
            maxLength={254}
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <input
            autoComplete="current-password"
            maxLength={1024}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        <button className={styles.primaryButton} disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in securely"}
        </button>
        <p aria-live="polite" className={styles.errorMessage} role="alert">
          {status}
        </p>
      </form>
      <div className={styles.demoPrompt}>
        <p>Backend not connected yet?</p>
        <Link className={styles.secondaryButton} href="/admin/demo">
          Preview the dashboard with demo data
        </Link>
        <small>Read-only preview. Demo records are never saved.</small>
      </div>
    </section>
  );
}
