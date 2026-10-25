import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

type UtilityPageProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}>;

export function UtilityPage({
  eyebrow,
  title,
  description,
  children,
}: UtilityPageProps) {
  return (
    <div className="utility-page-shell">
      <header className="utility-page-header page-container">
        <Link aria-label="Grace Technologies Ltd. home" href="/#home">
          <BrandLogo className="utility-page-logo" />
        </Link>
        <Link className="utility-page-home-link" href="/#home">
          Back to home
        </Link>
      </header>

      <main className="utility-page-main page-container">
        <article className="utility-page-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="utility-page-description">{description}</p>
          {children}
        </article>
      </main>

      <footer className="utility-page-footer">
        <p className="page-container">
          © 2026 Grace Technologies Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
