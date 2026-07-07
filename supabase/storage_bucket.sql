-- ============================================================================
-- Property Images — Supabase Storage bucket + policies
-- Run ONCE in Supabase Dashboard → SQL Editor → New Query → Run.
-- Creates a PUBLIC bucket "property-images" and allows anon upload/read/delete
-- (matches the permissive RLS used elsewhere in this project).
-- ============================================================================

-- 1. Create the public bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  10485760,  -- 10 MB per file
  array['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 10485760,
      allowed_mime_types = array['image/jpeg','image/jpg','image/png','image/webp','image/gif'];

-- 2. Policies on storage.objects for this bucket
drop policy if exists "property_images_read"   on storage.objects;
drop policy if exists "property_images_insert" on storage.objects;
drop policy if exists "property_images_update" on storage.objects;
drop policy if exists "property_images_delete" on storage.objects;

create policy "property_images_read"
  on storage.objects for select
  using ( bucket_id = 'property-images' );

create policy "property_images_insert"
  on storage.objects for insert
  with check ( bucket_id = 'property-images' );

create policy "property_images_update"
  on storage.objects for update
  using ( bucket_id = 'property-images' )
  with check ( bucket_id = 'property-images' );

create policy "property_images_delete"
  on storage.objects for delete
  using ( bucket_id = 'property-images' );

-- Done. The admin panel "Upload from PC" button now stores real images here
-- and saves their public URLs to the property's images array.
