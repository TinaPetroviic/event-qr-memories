# Capture the Love

Multi-tenant wedding QR photo-sharing platform. Couples create an event, get a
unique guest link + QR code, and guests upload photos straight from their
phone browser - no app install required.

Built with Next.js (App Router) + TypeScript + Tailwind CSS, backed by
Supabase (Postgres, Auth, Storage).

## Features

- Email/password auth for couples (Supabase Auth)
- Dashboard listing all of a couple's events, with a "create new event" flow
- Per-event admin panel: QR code (copy link / download PNG), welcome message
  and public/private gallery settings, photo grid with delete
- Public guest page at `/e/[slug]` - couple names, date, welcome message and
  an "add photo" upload button, with an optional guest name field
- Public gallery at `/e/[slug]/gallery`, only visible when the couple enables
  it
- Postgres Row Level Security so couples only ever manage their own events,
  and guests can only insert photos (never read/edit other events' data
  beyond what's explicitly made public)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings -> API**, copy the **Project URL** and the
   **anon public** key.

## 2. Run the database migration

1. Open the **SQL Editor** in your Supabase project.
2. Paste the contents of [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
   and run it.

This creates the `events` and `photos` tables, all Row Level Security
policies, and a public `photos` storage bucket with matching storage
policies.

Alternatively, if you use the Supabase CLI locally:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Then fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
with the values from step 1.

By default, Supabase requires email confirmation for new sign-ups. You can
turn this off in **Authentication -> Providers -> Email** while developing,
or configure the confirmation email's redirect URL to point at
`/auth/callback` on your deployed domain.

## 4. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                 Landing page
  login/, signup/          Auth pages + server actions
  auth/callback/           Email confirmation redirect handler
  auth/signout/            Sign-out route
  dashboard/               Couple's dashboard (auth-gated layout)
    events/[id]/           Event admin panel (QR code, settings, photos)
  e/[slug]/                Public guest page (upload photos)
    gallery/                Public gallery (only if enabled)
lib/
  supabase/                Browser + server Supabase clients, middleware helper
  utils/                   Slug generation, Bosnian/Serbian date formatting
components/                Shared UI (QR card, upload form, photo grid, ...)
supabase/migrations/       SQL schema + RLS + storage policies
```

## Notes on the storage/security model

- The `photos` storage bucket is public for reads (so gallery images load
  fast via CDN URLs), matching the `photos_public_select` table policy which
  only exposes rows once an event's `gallery_public` flag is `true`.
- Anyone holding an event's slug/link can upload a photo to that event -
  this mirrors the QR-code sharing model where the link itself is the
  invitation.
- Only the authenticated event owner can delete photos or their event.
