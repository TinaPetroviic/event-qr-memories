-- QR Uspomene - live gallery updates
-- Run this against your Supabase project (SQL editor) on top of the
-- previous migrations.
--
-- Enables Postgres Realtime change events for the "photos" table, so the
-- gallery (admin panel and public gallery) can update live in the browser
-- when a guest adds a photo/video/voice message or the couple deletes one,
-- without needing a page refresh. The existing RLS policies on
-- public.photos still apply to realtime events (a connection only receives
-- change events for rows it would be allowed to select), so this does not
-- change who can see what - only how quickly they see it.

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'photos'
  ) then
    alter publication supabase_realtime add table public.photos;
  end if;
end $$;
