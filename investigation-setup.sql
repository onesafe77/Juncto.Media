-- ============================================
-- INVESTIGATION IMAGES & FIELDS
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Add image_url column to investigations table
ALTER TABLE public.investigations 
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- 2. Add journalist_id for better tracking
ALTER TABLE public.investigations
ADD COLUMN IF NOT EXISTS journalist_id UUID REFERENCES auth.users(id);

-- 3. Ensure bucket exists (Manual step in Supabase Dashboard)
-- Create bucket named 'article-images' if not already exists
