"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";

type Summary = Readonly<{
  totalContacts: number;
  newContacts: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  inProgressEnquiries: number;
  completedEnquiries: number;
}>;

const emptySummary: Summary = {
  totalContacts: 0,
  newContacts: 0,
  totalEnquiries: 0,
  pendingEnquiries: 0,
  inProgressEnquiries: 0,
  completedEnquiries: 0,
};

export function AdminDashboard() {
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/summary")
      .then(async (response) => {
        const result: Summary & { error?: string } = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load dashboard data.");
        if (active) setSummary(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Could not load dashboard data.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={styles.pageSection}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>Overview</p>
          <h1>Admin dashboard</h1>
          <p className={styles.muted}>A live view of contact messages and service enquiries.</p>
        </div>
      </div>
      {error && <p className={styles.errorMessage} role="alert">{error}</p>}
      {loading ? (
        <p className={styles.notice} role="status">Loading dashboard data...</p>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <Stat label="All contact messages" value={summary.totalContacts} href="/admin/contacts" />
            <Stat label="New contact messages" value={summary.newContacts} href="/admin/contacts?status=new" />
            <Stat label="All service enquiries" value={summary.totalEnquiries} href="/admin/enquiries" />
            <Stat label="Pending enquiries" value={summary.pendingEnquiries} href="/admin/enquiries?status=pending" />
            <Stat label="In progress" value={summary.inProgressEnquiries} href="/admin/enquiries?status=in_progress" />
            <Stat label="Completed enquiries" value={summary.completedEnquiries} href="/admin/enquiries?status=completed" />
          </div>
          <div className={styles.dashboardLinks}>
            <Link className={styles.actionCard} href="/admin/contacts">
              <strong>Manage contacts</strong>
              <span>Review messages, mark them read, and add private notes.</span>
            </Link>
            <Link className={styles.actionCard} href="/admin/enquiries">
              <strong>Manage service enquiries</strong>
              <span>Update progress from pending to completed and keep notes.</span>
            </Link>
            <Link className={styles.actionCard} href="/admin/whatsapp">
              <strong>WhatsApp click analytics</strong>
              <span>View recorded WhatsApp link interactions by time, device, and page.</span>
            </Link>
          </div>
          <p className={styles.notice}>
            Counts come directly from the configured Supabase database. Public contact forms are classified by their submission flow; no sample records are used.
          </p>
        </>
      )}
    </section>
  );
}

function Stat({ label, value, href }: Readonly<{ label: string; value: number; href: string }>) {
  return (
    <Link className={styles.statCard} href={href}>
      <span>{label}</span>
      <strong>{value.toLocaleString()}</strong>
    </Link>
  );
}
