"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/app/admin/admin.module.css";

type ClickEvent = Readonly<{
  id: string;
  page_path: string;
  device_type: string;
  browser: string;
  created_at: string;
}>;

export function AdminWhatsAppAnalytics() {
  const [days, setDays] = useState("30");
  const [events, setEvents] = useState<ClickEvent[]>([]);
  const [limited, setLimited] = useState(false);
  const [loadedFor, setLoadedFor] = useState("");
  const [error, setError] = useState("");
  const loading = loadedFor !== days;

  useEffect(() => {
    let active = true;
    fetch(`/api/analytics/whatsapp?days=${days}`)
      .then(async (response) => {
        const result: { events?: ClickEvent[]; limited?: boolean; error?: string } =
          await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load analytics.");
        if (active) {
          setEvents(result.events ?? []);
          setLimited(result.limited ?? false);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load analytics.");
      })
      .finally(() => {
        if (active) setLoadedFor(days);
      });
    return () => {
      active = false;
    };
  }, [days]);

  const deviceTotals = useMemo(() => groupTotals(events, "device_type"), [events]);
  const browserTotals = useMemo(() => groupTotals(events, "browser"), [events]);
  const pageTotals = useMemo(() => groupTotals(events, "page_path").slice(0, 8), [events]);
  const dailyTotals = useMemo(() => {
    const daysToShow = Number(days);
    const counts = new Map<string, number>();
    for (let index = daysToShow - 1; index >= 0; index -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - index);
      counts.set(date.toISOString().slice(0, 10), 0);
    }
    for (const event of events) {
      const date = event.created_at.slice(0, 10);
      if (counts.has(date)) counts.set(date, (counts.get(date) ?? 0) + 1);
    }
    return [...counts.entries()];
  }, [days, events]);

  function exportCsv() {
    const rows = [
      ["Timestamp", "Page", "Device", "Browser"],
      ...events.map((event) => [
        event.created_at,
        event.page_path,
        event.device_type,
        event.browser,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `whatsapp-clicks-last-${days}-days.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const maxDaily = Math.max(1, ...dailyTotals.map(([, count]) => count));

  return (
    <section className={styles.pageSection}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>Engagement</p>
          <h1>WhatsApp click analytics</h1>
          <p className={styles.muted}>Aggregate click events only; no message content or visitor identity is collected.</p>
        </div>
        <div className={styles.analyticsActions}>
          <label className={styles.filterField}>
            <span className={styles.visuallyHidden}>Reporting period</span>
            <select onChange={(event) => setDays(event.target.value)} value={days}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </label>
          <button className={styles.secondaryButton} disabled={loading || events.length === 0} onClick={exportCsv} type="button">
            Export CSV
          </button>
        </div>
      </div>
      {error && <p className={styles.errorMessage} role="alert">{error}</p>}
      {limited && <p className={styles.notice}>Only the newest 5,000 events are included in this report.</p>}
      {loading ? (
        <p className={styles.notice} role="status">Loading analytics...</p>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}><span>WhatsApp link clicks</span><strong>{events.length.toLocaleString()}</strong></div>
            <div className={styles.statCard}><span>Pages with activity</span><strong>{pageTotals.length.toLocaleString()}</strong></div>
            <div className={styles.statCard}><span>Reporting window</span><strong>{days} days</strong></div>
          </div>
          {events.length === 0 ? (
            <p className={styles.emptyState}>
              No WhatsApp clicks were recorded in this period. Clicks will appear after a WhatsApp link is added to the public site and the updated database schema is applied.
            </p>
          ) : (
            <div className={styles.analyticsGrid}>
              <section className={styles.analyticsPanel}>
                <h2>Daily clicks</h2>
                <div aria-label={`WhatsApp clicks per day in the last ${days} days`} className={styles.barChart} role="img">
                  {dailyTotals.map(([date, count]) => (
                    <div className={styles.barColumn} key={date} title={`${date}: ${count} clicks`}>
                      <span className={styles.bar} style={{ height: `${Math.max(count === 0 ? 0 : 4, (count / maxDaily) * 100)}%` }} />
                      {days === "7" && <small>{new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</small>}
                    </div>
                  ))}
                </div>
              </section>
              <TotalsPanel title="Device breakdown" totals={deviceTotals} />
              <TotalsPanel title="Browser breakdown" totals={browserTotals} />
              <TotalsPanel title="Top pages" totals={pageTotals} />
            </div>
          )}
        </>
      )}
    </section>
  );
}

function groupTotals(events: ClickEvent[], field: keyof Pick<ClickEvent, "device_type" | "browser" | "page_path">) {
  const counts = new Map<string, number>();
  for (const event of events) {
    counts.set(event[field], (counts.get(event[field]) ?? 0) + 1);
  }
  return [...counts.entries()].sort((first, second) => second[1] - first[1]);
}

function TotalsPanel({ title, totals }: Readonly<{ title: string; totals: [string, number][] }>) {
  return (
    <section className={styles.analyticsPanel}>
      <h2>{title}</h2>
      {totals.length === 0 ? (
        <p className={styles.muted}>No activity yet.</p>
      ) : (
        <ul className={styles.totalsList}>
          {totals.map(([label, count]) => (
            <li key={label}><span>{label}</span><strong>{count}</strong></li>
          ))}
        </ul>
      )}
    </section>
  );
}
