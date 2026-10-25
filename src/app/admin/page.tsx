import type { Metadata } from "next";
import Link from "next/link";
import { UtilityPage } from "@/components/utility-page";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <UtilityPage
      description="Administrative access for Grace Technologies Ltd."
      eyebrow="Administration"
      title="Admin access"
    >
      <div className="utility-page-notice" role="status">
        <h2>Sign-in is not available yet</h2>
        <p>
          Admin authentication has not been configured. This page does not
          collect or verify credentials, and no admin dashboard is available.
        </p>
      </div>
      <Link className="button button-primary utility-page-action" href="/#contact">
        Contact us
      </Link>
    </UtilityPage>
  );
}
