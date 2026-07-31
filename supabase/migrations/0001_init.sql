-- Capture the Love - initial schema
-- Multi-tenant wedding QR photo-sharing platform.
-- Run this against your Supabase project (SQL editor, or `supabase db push`).

-- ============================================================================
-- Extensions
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- Tables
-- ============================================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  bride_name text not null,
  groom_name text not null,
  wedding_date date not null,
  slug text not null unique,
  welcome_message text not null default 'Hvala vam što ste dio našeg dana! Podijelite svoje fotografije s nama.',
  gallery_public boolean not null default false,
  created_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 80)
);

comment on table public.events is 'One row per couple/wedding event created in the app.';

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  storage_path text not null,
  guest_name text,
  created_at timestamptz not null default now()
);

comment on table public.photos is 'Guest-submitted photos for a given event.';

create index if not exists photos_event_id_idx on public.photos (event_id);
create index if not exists events_owner_id_idx on public.events (owner_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.events enable row level security;
alter table public.photos enable row level security;

-- --- events -----------------------------------------------------------------

-- Anyone (including unauthenticated guests) can look up an event by slug so
-- the public guest page (/e/[slug]) and QR code flow work without login.
-- The row does not contain sensitive data (owner_id is an opaque uuid).
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read"
  on public.events for select
  to anon, authenticated
  using (true);

-- Couples can create events for themselves only.
drop policy if exists "events_owner_insert" on public.events;
create policy "events_owner_insert"
  on public.events for insert
  to authenticated
  with check (owner_id = auth.uid());

-- Couples can update only their own events (settings, welcome message, etc).
drop policy if exists "events_owner_update" on public.events;
create policy "events_owner_update"
  on public.events for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Couples can delete only their own events.
drop policy if exists "events_owner_delete" on public.events;
create policy "events_owner_delete"
  on public.events for delete
  to authenticated
  using (owner_id = auth.uid());

-- --- photos -------------------------------------------------------------

-- Guests (anonymous or signed in) can upload a photo to any existing event.
-- Knowledge of the event's slug/id is the "access token" here, matching the
-- QR-code sharing model - anyone with the link can contribute a photo.
drop policy if exists "photos_public_insert" on public.photos;
create policy "photos_public_insert"
  on public.photos for insert
  to anon, authenticated
  with check (
    exists (select 1 from public.events e where e.id = photos.event_id)
  );

-- The event owner can always see all photos for their own event (admin panel).
drop policy if exists "photos_owner_select" on public.photos;
create policy "photos_owner_select"
  on public.photos for select
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = photos.event_id and e.owner_id = auth.uid()
    )
  );

-- Anyone can see photos for events whose gallery has been made public.
drop policy if exists "photos_public_select" on public.photos;
create policy "photos_public_select"
  on public.photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = photos.event_id and e.gallery_public = true
    )
  );

-- Only the event owner can delete photos (from the admin panel).
drop policy if exists "photos_owner_delete" on public.photos;
create policy "photos_owner_delete"
  on public.photos for delete
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = photos.event_id and e.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- Storage: "photos" bucket
-- ============================================================================
-- Objects are stored as: <event_id>/<uuid>.<ext>
-- The bucket is public for read (so guest galleries load fast via CDN URLs),
-- write access is governed by the policies below.

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

-- Anyone can upload a photo, as long as the first path segment is a real
-- event id (mirrors the photos_public_insert table policy above).
drop policy if exists "photos_bucket_public_insert" on storage.objects;
create policy "photos_bucket_public_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'photos'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[1]
    )
  );

-- Public read access (bucket is public, this mirrors that at the RLS layer
-- too so the storage API behaves consistently with public URLs).
drop policy if exists "photos_bucket_public_read" on storage.objects;
create policy "photos_bucket_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photos');

-- Only the owning couple can delete photo files, matched via the event_id
-- folder segment in the object path.
drop policy if exists "photos_bucket_owner_delete" on storage.objects;
create policy "photos_bucket_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'photos'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[1]
        and e.owner_id = auth.uid()
    )
  );
