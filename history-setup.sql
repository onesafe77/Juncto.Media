-- ============================================
-- READING HISTORY SYSTEM
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create Reading History Table
CREATE TABLE IF NOT EXISTS public.reading_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id) -- One entry per article per user, updated on view
);

-- 2. Enable RLS
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can only see their own history
CREATE POLICY "Users can view own history" ON public.reading_history
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert/update their own history
CREATE POLICY "Users can manage own history" ON public.reading_history
  FOR ALL USING (auth.uid() = user_id);

-- 4. Indices for Performance
CREATE INDEX IF NOT EXISTS history_user_id_idx ON public.reading_history(user_id);
CREATE INDEX IF NOT EXISTS history_last_read_at_idx ON public.reading_history(last_read_at DESC);
