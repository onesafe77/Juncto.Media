-- ============================================
-- ARTICLE TAGS SYSTEM
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Add tags column to articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Create index for tag searching
CREATE INDEX IF NOT EXISTS articles_tags_idx ON public.articles USING GIN (tags);

-- 3. Update existing records (optional, if you want default tags)
-- UPDATE public.articles SET tags = '{}' WHERE tags IS NULL;
