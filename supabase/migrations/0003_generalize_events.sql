-- QR Uspomene - generalize events from weddings-only to any event type
-- Run this against your Supabase project (SQL editor) on top of
-- 0001_init.sql and 0002_media_and_qr_design.sql.
--
-- This migration:
--   1. Renames wedding_date -> event_date (same date column, neutral name).
--   2. Adds a single flexible title column, backfilled from the existing
--      bride_name/groom_name pair so no existing event's display name is
--      lost (e.g. "Tina" + "Josip" becomes "Tina & Josip").
--   3. Drops bride_name/groom_name now that their data lives in title.

-- ============================================================================
-- events: wedding_date -> event_date
-- ============================================================================

alter table public.events rename column wedding_date to event_date;

-- ============================================================================
-- events: single flexible "title" field replacing bride_name/groom_name
-- ============================================================================

alter table public.events add column if not exists title text;

update public.events
set title = trim(bride_name || ' & ' || groom_name)
where title is null;

alter table public.events alter column title set not null;

comment on column public.events.title is
  'Free-form event name shown to guests and in the dashboard, e.g. "Nina & Marko", '
  '"Rođendan Amele", or "10 godina firme X". Replaces the old bride_name/groom_name pair '
  'so the platform works for any kind of event, not just weddings.';

alter table public.events drop column bride_name;
alter table public.events drop column groom_name;

-- Note: the slug_format check constraint from 0001_init.sql only validates
-- the slug string itself (character set + length), so it needs no change here.
