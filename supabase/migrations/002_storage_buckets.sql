-- ============================================================================
-- Storage Buckets for file uploads
-- ============================================================================

-- 1. AVATARS bucket — profile photo uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. DISCIPLINE-DEN-MEDIA bucket — Discipline Den post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('discipline-den-media', 'discipline-den-media', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- RLS Policies — avatars bucket
-- ============================================================================

-- Anyone can view avatars (public bucket)
CREATE POLICY avatars_select ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar (path starts with their user id)
CREATE POLICY avatars_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update (upsert) their own avatar
CREATE POLICY avatars_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own avatar
CREATE POLICY avatars_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- RLS Policies — discipline-den-media bucket
-- ============================================================================

-- Anyone can view discipline den media (public bucket)
CREATE POLICY discipline_den_media_select ON storage.objects
  FOR SELECT
  USING (bucket_id = 'discipline-den-media');

-- Authenticated users can upload media to their own folder
CREATE POLICY discipline_den_media_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'discipline-den-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own media
CREATE POLICY discipline_den_media_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'discipline-den-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
