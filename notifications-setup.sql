-- ============================================
-- NOTIFICATIONS SYSTEM
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable for global notifications
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'article', -- 'article', 'system', 'investigation'
  link TEXT, -- URL to redirect to
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can see their own notifications + global ones (where user_id is null)
CREATE POLICY "Users can view own or global notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Service role or triggers can insert
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Trigger Function for New Articles
CREATE OR REPLACE FUNCTION public.notify_new_article()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'Published' AND (OLD.status IS NULL OR OLD.status != 'Published') THEN
    INSERT INTO public.notifications (title, message, type, link)
    VALUES (
      'Artikel Baru Terbit!',
      NEW.title,
      'article',
      '/workspace/article/' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create Trigger on Articles Table
DROP TRIGGER IF EXISTS on_article_published ON public.articles;
CREATE TRIGGER on_article_published
  AFTER INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_article();

-- 6. Trigger Function for Investigations
CREATE OR REPLACE FUNCTION public.notify_investigation_update()
RETURNS trigger AS $$
BEGIN
  -- Notify on NEW investigation
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (title, message, type, link)
    VALUES (
      'Investigasi Baru!',
      NEW.title,
      'investigation',
      '/workspace/investigasi'
    );
  -- Notify on Status Change
  ELSIF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
    INSERT INTO public.notifications (title, message, type, link)
    VALUES (
      'Update Status Investigasi',
      'Kasus "' || NEW.title || '" kini berstatus ' || NEW.status,
      'investigation',
      '/workspace/investigasi'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create Trigger on Investigations Table
DROP TRIGGER IF EXISTS on_investigation_change ON public.investigations;
CREATE TRIGGER on_investigation_change
  AFTER INSERT OR UPDATE ON public.investigations
  FOR EACH ROW EXECUTE FUNCTION public.notify_investigation_update();
