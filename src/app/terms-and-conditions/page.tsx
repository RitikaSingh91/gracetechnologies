import type { Metadata } from "next";
import { UtilityPage } from "@/components/utility-page";
import { companyInformation } from "@/data/company-information";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Draft terms and conditions information for Grace Technologies Ltd.",
};

export default function TermsAndConditionsPage() {
  return (
    <UtilityPage
      description="Draft for review — this page is a placeholder and is not legal advice or reviewed terms."
      eyebrow="Legal information · Draft"
      title="Terms & Conditions"
    >
      <div className="utility-page-sections">
        <section>
          <h2>Website use</h2>
          <p>
            Add the terms governing use of this website and its content before
            publishing a final version.
          </p>
        </section>
        <section>
          <h2>Services and inquiries</h2>
          <p>
            Document applicable service terms and how website inquiries are
            handled. Submitting an inquiry does not, by itself, describe or
            establish a service agreement.
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
