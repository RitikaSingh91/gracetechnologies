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
    admin/page.tsx Admin access information
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
  schema.sql       Contact inquiry table and insert-only database permissions
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
   no inquiry access to `anon` or `authenticated`, grants only insert access
   to `service_role`, and adds the optional `mobile_number` field.
3. Copy `.env.example` to `.env.local`. In the Supabase project dashboard, open
   **Project Settings → API** and set:
   - `SUPABASE_URL` to the project URL.
   - `SUPABASE_SERVICE_ROLE_KEY` to the `service_role` secret key.
4. Keep `.env.local` private. Never add the service-role key to a `NEXT_PUBLIC_`
   variable or browser code. Restart the development server after changing
   environment variables.
5. Run `npm run dev`, open **Contact** and select **Talk to Us**, complete the
   enquiry modal, and submit it. A success message appears only after Supabase
   confirms the insert. Verify the row in
   **Table Editor → contact_inquiries**. Until the project, table, and
   environment variables are configured, submission displays a frontend
   preview message and does not send the inquiry.

The contact API validates submissions on the server and never provides an
inquiry-reading endpoint. Do not expose service-role credentials or use the
service-role key in client components. The `.env.example` file contains only
variable names; `.env.local` is gitignored.

## Validation

```bash
npm run lint
npm run build
```
