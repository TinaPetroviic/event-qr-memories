-- QR Uspomene - add "baptism" (Krštenje) as an event type
-- Run this against your Supabase project (SQL editor) on top of the
-- previous migrations (0001-0005).
--
-- The landing page has always advertised "Krštenja" as one of the
-- celebration types EventPix supports, but the event_type check constraint
-- from 0005 never actually included it - this migration closes that gap.

alter table public.events drop constraint if exists events_event_type_check;

alter table public.events
  add constraint events_event_type_check
    check (event_type in ('wedding', 'birthday', 'anniversary', 'corporate', 'graduation', 'baptism', 'other'));
