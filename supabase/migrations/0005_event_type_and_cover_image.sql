-- QR Uspomene - event type picker + optional cover image
-- Run this against your Supabase project (SQL editor) on top of the
-- previous migrations (0001-0004).
--
-- This migration:
--   1. Adds a fixed-enum "event_type" column to public.events, so the
--      dashboard/create-event form can offer a category dropdown
--      (wedding, birthday, anniversary, corporate, graduation, other).
--   2. Adds a nullable "cover_image_path" column to public.events, storing
--      the path of an optional cover/feature image within the existing
--      "photos" storage bucket - same pattern as photos.storage_path.
--   3. Adds owner-only storage policies scoped to a "covers/" path prefix,
--      so cover images (unlike guest-submitted media) can only be uploaded
--      or removed by the event's owner.

-- ============================================================================
-- events: event_type
-- ============================================================================

alter table public.events
  add column if not exists event_type text not null default 'other'
    check (event_type in ('wedding', 'birthday', 'anniversary', 'corporate', 'graduation', 'other'));

comment on column public.events.event_type is
  'Category of the event, shown as a badge/icon in the dashboard and admin panel. '
  'Purely descriptive - does not change any behaviour or feature availability.';

-- ============================================================================
-- events: cover_image_path
-- ============================================================================

alter table public.events add column if not exists cover_image_path text;

comment on column public.events.cover_image_path is
  'Optional path (within the "photos" storage bucket, under the covers/ prefix) '
  'of a feature image shown on the guest page and dashboard. Null if the couple/'
  'organizer has not uploaded one - every reader of this column must treat '
  'null as "no cover image, render as before".';

-- ============================================================================
-- Storage: owner-only cover image uploads within the existing "photos" bucket
-- ============================================================================
-- Cover images are stored at covers/<event_id>/<uuid>.<ext> - a path prefix
-- distinct from guest-submitted media (<event_id>/<uuid>.<ext>), so they can
-- never be picked up by the photos-table-driven queries/policies (the path
-- is only ever referenced via events.cover_image_path, never inserted into
-- public.photos).
--
-- Unlike guest uploads - open to anon/authenticated via
-- "photos_bucket_public_insert" in 0001_init.sql, since knowledge of the
-- event's slug/id is the whole point of the QR-sharing model - a cover image
-- should only ever be writable by the event's owner. The existing insert
-- policy does not accidentally grant this: it checks that
-- (storage.foldername(name))[1] is a real event id, and for a covers/...
-- path that first segment is the literal string "covers", which never
-- matches an event id. So these are genuinely new, additive policies.

drop policy if exists "photos_bucket_covers_owner_insert" on storage.objects;
create policy "photos_bucket_covers_owner_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = 'covers'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[2]
        and e.owner_id = auth.uid()
    )
  );

-- Lets the owner replace a cover image in place (upsert) as well as clean up
-- the old file when a new one is uploaded or the cover is removed.
drop policy if exists "photos_bucket_covers_owner_update" on storage.objects;
create policy "photos_bucket_covers_owner_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = 'covers'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[2]
        and e.owner_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = 'covers'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[2]
        and e.owner_id = auth.uid()
    )
  );

drop policy if exists "photos_bucket_covers_owner_delete" on storage.objects;
create policy "photos_bucket_covers_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = 'covers'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[2]
        and e.owner_id = auth.uid()
    )
  );

-- Public read access is already covered by the existing
-- "photos_bucket_public_read" policy from 0001_init.sql (bucket_id =
-- 'photos', any path) - which is exactly what we want here too, since cover
-- images are meant to be visible to guests on the public event page.
