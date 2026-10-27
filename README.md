# Grace Technologies Ltd. Website

A responsive company website built with Next.js App Router, React, TypeScript,
and standard CSS. Tailwind CSS is not used. Contact inquiries are submitted
through a server-side Next.js route to Supabase.

## Start developing

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project structure

```text
src/
  app/
    globals.css    Shared brand tokens, base styles, and responsive layouts
    api/contact/   Server-side contact inquiry endpoint
    admin/         Protected administrator dashboard
    layout.tsx     Root layout and SEO metadata
    page.tsx       Homepage section composition
    privacy-policy/page.tsx
    terms-and-conditions/page.tsx
  components/
    about-section.tsx
    brand-logo.tsx
    contact-section.tsx
    enquiry-modal.tsx
    hero-section.tsx
    our-work-section.tsx
    project-card.tsx
    service-card.tsx
    services-section.tsx
    site-header.tsx
    site-footer.tsx
    utility-page.tsx
  data/
    company-information.ts
    contact-services.ts
    projects.ts
  lib/
    contact-inquiry.ts
    supabase.ts
public/
  images/
    grace-logo.jpeg  Approved Grace Technologies logo used throughout the site
supabase/
  schema.sql       Contact/enquiry, analytics, and rate-limit schema
```

## Design system

Shared colors, typography, and layout tokens are defined at the top of
`src/app/globals.css`. The homepage includes accessible navigation, a responsive
hero, four service cards, project cards, an About section, and a Contact
section with a reusable enquiry modal and responsive footer with social links.
The approved Grace Technologies logo is shared across the header, footer, and
enquiry modal through the `BrandLogo` component.

The homepage Contact section submits name, phone, email, and message through
the server-side contact API and saves them in `public.contact_inquiries`.
There is no email-delivery integration configured, so a successful submission
confirms the database save only; it does not mean an email notification was
sent.

## Configure Supabase contact submissions

1. Create a Supabase project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In the Supabase SQL Editor, run the contents of `supabase/schema.sql`.
   This creates `public.contact_inquiries`, enables row-level security, grants
   no inquiry access to `anon` or `authenticated`, and adds the columns needed
   to separate contact messages from service enquiries.
3. Copy `.env.example` to `.env.local`. In the Supabase project dashboard, open
   **Project Settings → API** and set:
   - `SUPABASE_URL` to the project URL.
   - `SUPABASE_SERVICE_ROLE_KEY` to the `service_role` secret key.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the project `anon`/publishable key.
4. Keep `.env.local` private. Never add the service-role key to a `NEXT_PUBLIC_`
   variable or browser code. Restart the development server after changing
   environment variables.
5. Run `npm run dev`, open **Contact** and select **Talk to Us**, complete the
   enquiry modal, and submit it. A success message appears only after Supabase
   confirms the insert. Verify the row in
   **Table Editor → contact_inquiries**. Until the project, table, and
   environment variables are configured, submission displays an error and
   does not send the inquiry.

## Configure the administrator dashboard

The admin area uses Supabase Auth for password verification and a server-only
allowlist containing one Auth user ID. It has no public admin registration
route or demo credentials. If the backend is not configured yet, visit
`/admin/demo` or use **Preview the dashboard with demo data** on the sign-in
page to explore a separate, read-only preview. Demo records are clearly marked
and never reach the database.

1. Apply the current `supabase/schema.sql` in the Supabase SQL Editor. It adds
   inquiry status/private-note columns, WhatsApp click analytics, and the
   database-backed request rate limiter. Reapplying it is safe for the
   existing tables.
2. In **Authentication → Users**, create the administrator account yourself
   using a strong password. Copy that user's UUID into
   `SUPABASE_ADMIN_USER_ID`. Do not add a password to an environment variable
   or source file. Consider disabling public sign-ups in Supabase Auth if the
   project does not need them.
3. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` as described above. Keep the service-role
   key server-side only; the app uses it for protected server requests and
   never sends it to the browser.
4. Restart the application and open `/admin`. The administrator signs in with
   the Supabase Auth email/password. Sessions use an HttpOnly, SameSite=Lax
   cookie and expire after at most one hour. Sign-out revokes the Supabase
   session. Sign-in attempts are limited using the SQL rate-limit function.
5. **Contacts** and **Enquiries** display actual records written by the public
   forms. Status changes and private notes are stored in Supabase. The profile
   page can update the administrator password after reauthentication.

The WhatsApp analytics collector records only link clicks, page path, coarse
device class, browser family, and timestamp. It does not collect visitor
identity or message content. No WhatsApp links are currently configured on
the public website, so analytics will stay empty until one is added. CSV
exports contain only these aggregate event fields.

The contact API validates submissions on the server. Admin reading and update
APIs verify the Supabase Auth user ID on every request. Database row-level
security denies direct public access; do not expose service-role credentials
or use the service-role key in client components. The `.env.example` file
contains variable names only; `.env.local` is gitignored. Real sign-in and
database writes cannot be verified until deployment credentials and the SQL
schema are configured.

## Validation

```bash
npm run lint
npm run build
```
