"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import styles from "@/app/admin/admin.module.css";

type DemoSection = "dashboard" | "contacts" | "enquiries" | "whatsapp" | "profile";

const demoContacts = [
  {
    name: "Alex Morgan",
    email: "alex.morgan@example.invalid",
    phone: "+1 202 555 0142",
    service: "General enquiry",
    date: "Today, 10:24 AM",
    message: "We are exploring a new website for our growing consultancy and would like to discuss the options.",
    status: "New",
  },
  {
    name: "Priya Shah",
    email: "priya.shah@example.invalid",
    phone: "+44 20 7946 0182",
    service: "General enquiry",
    date: "Yesterday, 3:10 PM",
    message: "Could someone contact me about improving our existing digital presence?",
    status: "Read",
  },
];

const demoEnquiries = [
  {
    name: "Taylor Reed",
    email: "taylor.reed@example.invalid",
    phone: "+1 202 555 0107",
    service: "Web & Mobile App Development",
    date: "Today, 9:05 AM",
    message: "We need a customer portal with a simple booking and account-management experience.",
    status: "Pending",
  },
  {
    name: "Samira Khan",
    email: "samira.khan@example.invalid",
    phone: "+44 20 7946 0124",
    service: "Agentic AI & Workflow Automation",
    date: "Monday, 1:42 PM",
    message: "We would like to automate a few repetitive internal workflows and understand what is feasible.",
    status: "In progress",
  },
];

const sections: ReadonlyArray<{
  id: DemoSection;
  title: string;
  subtitle: string;
}> = [
  { id: "dashboard", title: "Dashboard", subtitle: "A sample overview of the admin workspace." },
  { id: "contacts", title: "Contact messages", subtitle: "Example messages from the public contact form." },
  { id: "whatsapp", title: "WhatsApp Analytics", subtitle: "An example of the aggregate engagement report." },
  { id: "enquiries", title: "Service enquiries", subtitle: "Example enquiries arranged by service and status." },
  { id: "profile", title: "Admin Profile", subtitle: "Example administrator account settings." },
];

export function AdminDemo({ section }: Readonly<{ section: DemoSection }>) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const currentSection = sections.find((item) => item.id === section) ?? sections[0];
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.brandLink} href="/admin/demo">
          <BrandLogo className={styles.adminBrandLogo} />
          <span className={styles.brandText}>
            <span className={styles.brandName}>Grace Technologies</span>
            <small>Admin preview</small>
          </span>
        </Link>
        <button
          aria-controls="admin-demo-navigation"
          aria-expanded={isNavigationOpen}
          aria-label={isNavigationOpen ? "Close dashboard menu" : "Open dashboard menu"}
          className={styles.menuToggle}
          onClick={() => setIsNavigationOpen((isOpen) => !isOpen)}
          type="button"
        >
          <span aria-hidden="true">{isNavigationOpen ? "×" : "☰"}</span>
        </button>
        <Link className={`${styles.secondaryButton} ${styles.demoSignIn}`} href="/admin/login">Admin sign in</Link>
      </header>
      <div className={styles.shellBody}>
        <nav
          aria-label="Demo navigation"
          className={`${styles.sidebar}${isNavigationOpen ? ` ${styles.sidebarOpen}` : ""}`}
          id="admin-demo-navigation"
        >
          {sections.map((item) => (
            <Link
              aria-current={section === item.id ? "page" : undefined}
              className={styles.navLink}
              href={item.id === "dashboard" ? "/admin/demo" : `/admin/demo/${item.id}`}
              key={item.id}
              onClick={() => setIsNavigationOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          <Link className={styles.publicLink} href="/" onClick={() => setIsNavigationOpen(false)}>View Public Website ↗</Link>
        </nav>
        <div className={styles.content}>
          <div className={styles.demoBanner} role="note">
            <strong>Demo preview — sample data only</strong>
            <span>This read-only preview works without a backend. No information is real or saved.</span>
          </div>
          <section className={styles.pageSection}>
            <div className={styles.pageHeading}>
              <div>
                <p className={styles.eyebrow}>Admin preview</p>
                <h1>{currentSection.title}</h1>
                <p className={styles.muted}>{currentSection.subtitle}</p>
              </div>
            </div>
            {section === "dashboard" && <DemoDashboard />}
            {section === "contacts" && <DemoRecords records={demoContacts} type="contact" />}
            {section === "enquiries" && <DemoRecords records={demoEnquiries} type="enquiry" />}
            {section === "whatsapp" && <DemoAnalytics />}
            {section === "profile" && <DemoProfile />}
          </section>
        </div>
      </div>
    </div>
  );
}

function DemoDashboard() {
  const stats = [
    ["All contact messages", "18", "/admin/demo/contacts"],
    ["New contact messages", "4", "/admin/demo/contacts"],
    ["Service enquiries", "12", "/admin/demo/enquiries"],
    ["Pending enquiries", "3", "/admin/demo/enquiries"],
    ["In progress", "5", "/admin/demo/enquiries"],
    ["Completed enquiries", "4", "/admin/demo/enquiries"],
  ] as const;
  return (
    <>
      <div className={styles.statsGrid}>
        {stats.map(([label, value, href]) => (
          <Link className={styles.statCard} href={href} key={label}>
            <span>{label}</span><strong>{value}</strong>
          </Link>
        ))}
      </div>
      <div className={styles.dashboardLinks}>
        {sections.slice(1).map((item) => (
          <Link className={styles.actionCard} href={`/admin/demo/${item.id}`} key={item.id}>
            <strong>{item.title}</strong><span>{item.subtitle}</span>
          </Link>
        ))}
      </div>
      <p className={styles.notice}>These counts are illustrative examples, not live database records.</p>
    </>
  );
}

function DemoRecords({
  records,
  type,
}: Readonly<{
  records: typeof demoContacts;
  type: "contact" | "enquiry";
}>) {
  return (
    <div className={styles.demoRecordList}>
      {records.map((record) => (
        <article className={styles.recordCard} key={record.email}>
          <header className={styles.recordHeader}>
            <div>
              <h2>{record.name}</h2>
              <p className={styles.recordMeta}>{record.date} · {record.service}</p>
            </div>
            <span className={styles.statusBadge}>{record.status}</span>
          </header>
          <div className={styles.recordContact}>
            <span>{record.email}</span><span>{record.phone}</span>
          </div>
          <p className={styles.recordMessage}>{record.message}</p>
          <div className={styles.demoControls}>
            <label className={styles.field}>
              <span>Status (preview only)</span>
              <select aria-label={`Sample ${type} status`} disabled value={record.status.toLowerCase().replaceAll(" ", "_")}>
                {["new", "read", "pending", "contacted", "in_progress", "completed"].map((status) => (
                  <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Private note (preview only)</span>
              <textarea disabled readOnly rows={2} value="Example internal note. Changes are disabled in demo mode." />
            </label>
            <button className={styles.secondaryButton} disabled type="button">Save disabled</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function DemoAnalytics() {
  const values = [20, 38, 29, 52, 45, 70, 57, 82, 61, 93, 73, 100, 68, 87];
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><span>WhatsApp link clicks</span><strong>126</strong></div>
        <div className={styles.statCard}><span>Most active device</span><strong>Mobile</strong></div>
        <div className={styles.statCard}><span>Reporting window</span><strong>30 days</strong></div>
      </div>
      <div className={styles.analyticsGrid}>
        <section className={styles.analyticsPanel}>
          <h2>Daily clicks (sample)</h2>
          <div aria-label="Illustrative daily WhatsApp click chart" className={styles.barChart} role="img">
            {values.map((value, index) => (
              <span className={styles.bar} key={index} style={{ height: `${value}%` }} />
            ))}
          </div>
        </section>
        <section className={styles.analyticsPanel}>
          <h2>Sample breakdown</h2>
          <ul className={styles.totalsList}>
            <li><span>Mobile</span><strong>84</strong></li>
            <li><span>Desktop</span><strong>32</strong></li>
            <li><span>Tablet</span><strong>10</strong></li>
            <li><span>Other device</span><strong>0</strong></li>
          </ul>
        </section>
      </div>
      <p className={styles.notice}>Live analytics require the Supabase schema and WhatsApp links on the public website.</p>
    </>
  );
}

function DemoProfile() {
  return (
    <section className={styles.profileCard}>
      <dl className={styles.profileList}>
        <div><dt>Administrator email</dt><dd>admin@example.invalid</dd></div>
        <div><dt>Account created</dt><dd>Sample date</dd></div>
        <div><dt>Access level</dt><dd>Authorized administrator</dd></div>
      </dl>
      <h2>Password settings</h2>
      <p className={styles.muted}>Connect Supabase to manage the real administrator account.</p>
      <button className={styles.secondaryButton} disabled type="button">Password update disabled in demo</button>
    </section>
  );
}
