-- Capture the Love - media types (photo/video/audio) + QR card design picker
-- Run this against your Supabase project (SQL editor) on top of 0001_init.sql.

-- ============================================================================
-- photos: support video + voice-message uploads alongside photos
-- ============================================================================

alter table public.photos
  add column if not exists media_type text not null default 'photo'
    check (media_type in ('photo', 'video', 'audio'));

comment on column public.photos.media_type is
  'Kind of guest-submitted media stored at storage_path: photo, video, or audio (voice message).';

-- Existing RLS policies on public.photos key off event_id/ownership only, not
-- content type, so they do not need to change for this addition.

-- Raise the "photos" storage bucket's size limit and accepted mime types so
-- guests can upload videos and voice recordings, not just photos.
update storage.buckets
set
  file_size_limit = 104857600, -- 100 MB
  allowed_mime_types = array['image/*', 'video/*', 'audio/*', 'audio/webm', 'video/webm']
where id = 'photos';

-- ============================================================================
-- events: QR card design picker
-- ============================================================================

alter table public.events
  add column if not exists qr_design text not null default 'classic'
    check (qr_design in ('classic', 'modern', 'romantic', 'rustic'));

comment on column public.events.qr_design is
  'Visual theme key used to render/download the printable QR card.';
