import type { Metadata } from "next";
import { UtilityPage } from "@/components/utility-page";
import { companyInformation } from "@/data/company-information";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Draft privacy policy information for Grace Technologies Ltd.",
};

export default function PrivacyPolicyPage() {
  return (
    <UtilityPage
      description="Draft for review — this page is a placeholder and is not legal advice or a reviewed privacy policy."
      eyebrow="Legal information · Draft"
      title="Privacy Policy"
    >
      <div className="utility-page-sections">
        <section>
          <h2>Information to be documented</h2>
          <p>
            Add details here about the personal information collected through
            this website, including contact inquiries, and the purposes for
            which it is used.
          </p>
        </section>
        <section>
          <h2>Data handling and retention</h2>
          <p>
            Describe the company&apos;s data storage, retention, security, and
            deletion practices before publishing a final policy.
          </p>
        </section>
        <section>
          <h2>Questions</h2>
          <p>
            Contact{" "}
            <a href={`mailto:${companyInformation.email}`}>
              {companyInformation.email}
            </a>{" "}
            with questions while this draft is being completed.
          </p>
        </section>
      </div>
    </UtilityPage>
  );
}
