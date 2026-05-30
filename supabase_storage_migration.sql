-- ==========================================================================
-- Vybe Algeria Connect – Supabase Storage Migration for Brand Assets
-- Run this in your Supabase Dashboard → SQL Editor
-- ==========================================================================

-- 1. Create the brand-assets bucket if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-assets',
  'brand-assets',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 2. Note: RLS is already enabled by default on storage.objects in Supabase.
-- (We omit ALTER TABLE storage.objects because only supabase_admin can execute it).

-- 3. Create RLS Policy: Public read access to all brand assets
DROP POLICY IF EXISTS "Public Access to Brand Assets" ON storage.objects;
CREATE POLICY "Public Access to Brand Assets" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'brand-assets');

-- 4. Create RLS Policy: Authenticated users can upload to their own user folder
DROP POLICY IF EXISTS "Authenticated Users Can Upload Brand Assets" ON storage.objects;
CREATE POLICY "Authenticated Users Can Upload Brand Assets" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'brand-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5. Create RLS Policy: Authenticated users can update brand assets in their own folder
DROP POLICY IF EXISTS "Authenticated Users Can Update Brand Assets" ON storage.objects;
CREATE POLICY "Authenticated Users Can Update Brand Assets" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'brand-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'brand-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 6. Create RLS Policy: Authenticated users can delete brand assets in their own folder
DROP POLICY IF EXISTS "Authenticated Users Can Delete Brand Assets" ON storage.objects;
CREATE POLICY "Authenticated Users Can Delete Brand Assets" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'brand-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
