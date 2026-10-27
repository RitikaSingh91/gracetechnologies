"use client";

import { useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";

type Inquiry = Readonly<{
  id: string;
  name: string;
  email: string;
  mobile_number: string | null;
  company: string | null;
  service: string;
  project_budget: string | null;
  message: string;
  status: string;
  internal_note: string | null;
  created_at: string;
}>;

type InquiryType = "contact" | "enquiry";
type StatusDraft = { status: string; internal_note: string };
const pageSize = 25;

const contactStatuses = [
  ["new", "New"],
  ["read", "Read"],
  ["archived", "Archived"],
] as const;
const enquiryStatuses = [
  ["pending", "Pending"],
  ["contacted", "Contacted"],
  ["in_progress", "In progress"],
  ["completed", "Completed"],
  ["archived", "Archived"],
] as const;

export function AdminInquiryManager({
  initialStatus,
  type,
}: Readonly<{ initialStatus?: string; type: InquiryType }>) {
  const [records, setRecords] = useState<Inquiry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, StatusDraft>>({});
  const allowedStatuses = type === "contact" ? contactStatuses : enquiryStatuses;
  const [filterStatus, setFilterStatus] = useState(
    allowedStatuses.some(([status]) => status === initialStatus)
      ? initialStatus ?? ""
      : "",
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({
      type,
      limit: String(pageSize),
      offset: String(offset),
    });
    if (filterStatus) params.set("status", filterStatus);
    if (search) params.set("search", search);

    fetch(`/api/admin/records?${params}`)
      .then(async (response) => {
        const result: {
          records?: Inquiry[];
          total?: number;
          error?: string;
        } = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load records.");
        if (!active) return;
        const loaded = result.records ?? [];
        setRecords(loaded);
        setTotal(result.total ?? loaded.length);
        setDrafts(
          Object.fromEntries(
            loaded.map((record) => [
              record.id,
              {
                status: record.status,
                internal_note: record.internal_note ?? "",
              },
            ]),
          ),
        );
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Could not load records.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filterStatus, offset, search, type]);

  function updateDraft(id: string, updates: Partial<StatusDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], ...updates },
    }));
  }

  async function saveRecord(id: string) {
    setSavingId(id);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/records/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...drafts[id], type }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update this record.");
      setMessage("Record updated.");
      const saved = drafts[id];
      if (filterStatus && saved.status !== filterStatus) {
        setRecords((current) => current.filter((record) => record.id !== id));
        setTotal((current) => Math.max(0, current - 1));
      } else {
        setRecords((current) =>
          current.map((record) =>
            record.id === id
              ? {
                  ...record,
                  status: saved.status,
                  internal_note: saved.internal_note,
                }
              : record,
          ),
        );
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update this record.");
    } finally {
      setSavingId("");
    }
  }

  const title = type === "contact" ? "Contact messages" : "Service enquiries";
  const statusOptions = type === "contact" ? contactStatuses : enquiryStatuses;

  return (
    <section className={styles.pageSection}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>{type === "contact" ? "Inbox" : "Sales pipeline"}</p>
          <h1>{title}</h1>
          <p className={styles.muted}>
            {type === "contact"
              ? "Messages submitted through the public contact form."
              : "Service requests submitted through the enquiry form."}
          </p>
        </div>
        <span className={styles.totalBadge}>{total.toLocaleString()} total</span>
      </div>

      <form
        className={styles.filters}
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          setMessage("");
          const nextSearch = searchInput.trim();
          if (nextSearch !== search || offset !== 0) {
            setLoading(true);
            setOffset(0);
            setSearch(nextSearch);
          }
        }}
      >
        <label className={styles.searchField}>
          <span className={styles.visuallyHidden}>Search records</span>
          <input
            maxLength={100}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search name, email, service or message"
            value={searchInput}
          />
        </label>
        <label className={styles.filterField}>
          <span className={styles.visuallyHidden}>Filter by status</span>
          <select
            onChange={(event) => {
              setLoading(true);
              setError("");
              setMessage("");
              setOffset(0);
              setFilterStatus(event.target.value);
            }}
            value={filterStatus}
          >
            <option value="">All statuses</option>
            {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button className={styles.primaryButton} type="submit">Search</button>
      </form>

      {error && <p className={styles.errorMessage} role="alert">{error}</p>}
      {message && <p className={styles.successMessage} role="status">{message}</p>}
      {loading ? (
        <p className={styles.notice} role="status">Loading records...</p>
      ) : records.length === 0 ? (
        <p className={styles.emptyState}>No {type === "contact" ? "contact messages" : "service enquiries"} match these filters.</p>
      ) : (
        <div className={styles.recordList}>
          {records.map((record) => {
            const draft = drafts[record.id] ?? {
              status: record.status,
              internal_note: record.internal_note ?? "",
            };
            return (
              <article className={styles.recordCard} key={record.id}>
                <header className={styles.recordHeader}>
                  <div>
                    <h2>{record.name}</h2>
                    <p className={styles.recordMeta}>
                      {new Date(record.created_at).toLocaleString()} · {record.service}
                    </p>
                  </div>
                  <span className={styles.statusBadge}>{formatStatus(record.status)}</span>
                </header>
                <div className={styles.recordContact}>
                  <a href={`mailto:${encodeURIComponent(record.email)}`}>{record.email}</a>
                  {record.mobile_number && <a href={`tel:${encodeURIComponent(record.mobile_number)}`}>{record.mobile_number}</a>}
                  {record.company && <span>{record.company}</span>}
                  {record.project_budget && <span>Budget: {record.project_budget}</span>}
                </div>
                <p className={styles.recordMessage}>{record.message}</p>
                <div className={styles.recordControls}>
                  <label className={styles.field}>
                    <span>Status</span>
                    <select
                      onChange={(event) => updateDraft(record.id, { status: event.target.value })}
                      value={draft.status}
                    >
                      {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <label className={`${styles.field} ${styles.noteField}`}>
                    <span>Private internal note</span>
                    <textarea
                      maxLength={2000}
                      onChange={(event) => updateDraft(record.id, { internal_note: event.target.value })}
                      rows={2}
                      value={draft.internal_note}
                    />
                  </label>
                  <button
                    className={styles.secondaryButton}
                    disabled={savingId === record.id}
                    onClick={() => void saveRecord(record.id)}
                    type="button"
                  >
                    {savingId === record.id ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.secondaryButton}
          disabled={loading || offset === 0}
          onClick={() => {
            setLoading(true);
            setOffset(Math.max(0, offset - pageSize));
          }}
          type="button"
        >
          Previous
        </button>
        <span>
          {total === 0 ? 0 : offset + 1}–{Math.min(offset + pageSize, total)} of {total}
        </span>
        <button
          className={styles.secondaryButton}
          disabled={loading || offset + pageSize >= total}
          onClick={() => {
            setLoading(true);
            setOffset(offset + pageSize);
          }}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
