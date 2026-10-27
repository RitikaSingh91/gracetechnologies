"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "@/app/admin/admin.module.css";

type ProfileData = Readonly<{
  email?: string;
  createdAt?: string;
}>;

export function AdminProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/profile")
      .then(async (response) => {
        const result: ProfileData & { error?: string } = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load profile.");
        if (active) setProfile(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setIsError(true);
          setStatus(cause instanceof Error ? cause.message : "Could not load profile.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsError(false);
    if (newPassword !== confirmation) {
      setIsError(true);
      setStatus("The new password and confirmation do not match.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result: { message?: string; error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setStatus(result.message ?? "Password updated.");
    } catch (cause) {
      setIsError(true);
      setStatus(cause instanceof Error ? cause.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.pageSection}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>Account</p>
          <h1>Admin profile</h1>
          <p className={styles.muted}>View the configured administrator identity and update its password.</p>
        </div>
      </div>
      {loading ? (
        <p className={styles.notice} role="status">Loading profile...</p>
      ) : (
        <>
          {profile && (
            <section aria-label="Administrator details" className={styles.profileCard}>
              <dl className={styles.profileList}>
                <div><dt>Administrator email</dt><dd>{profile.email}</dd></div>
                <div><dt>Account created</dt><dd>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}</dd></div>
                <div><dt>Access level</dt><dd>Authorized administrator</dd></div>
              </dl>
            </section>
          )}
          <section className={styles.profileCard}>
            <h2>Change password</h2>
            <p className={styles.muted}>Confirm your current password. New passwords must contain at least 12 characters.</p>
            <form className={styles.form} onSubmit={updatePassword}>
              <label className={styles.field}>
                <span>Current password</span>
                <input autoComplete="current-password" onChange={(event) => setCurrentPassword(event.target.value)} required type="password" value={currentPassword} />
              </label>
              <label className={styles.field}>
                <span>New password</span>
                <input autoComplete="new-password" minLength={12} onChange={(event) => setNewPassword(event.target.value)} required type="password" value={newPassword} />
              </label>
              <label className={styles.field}>
                <span>Confirm new password</span>
                <input autoComplete="new-password" minLength={12} onChange={(event) => setConfirmation(event.target.value)} required type="password" value={confirmation} />
              </label>
              <button className={styles.primaryButton} disabled={saving} type="submit">
                {saving ? "Updating..." : "Update password"}
              </button>
            </form>
          </section>
          {status && <p className={isError ? styles.errorMessage : styles.successMessage} role={isError ? "alert" : "status"}>{status}</p>}
        </>
      )}
    </section>
  );
}
