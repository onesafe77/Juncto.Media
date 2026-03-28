-- ============================================
-- JUNCTO.MEDIA - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension (usually pre-enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ARTICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  snippet TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Kebijakan',
  author TEXT NOT NULL DEFAULT 'Admin',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  is_premium BOOLEAN DEFAULT FALSE,
  image_url TEXT DEFAULT '',
  views INTEGER DEFAULT 0,
  is_rag_indexed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. REPORTS TABLE (Pengaduan)
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Umum',
  reporter_name TEXT DEFAULT 'Anonim',
  reporter_email TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Baru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. JOURNALISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS journalists (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  position TEXT DEFAULT '',
  desk TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending',
  valid_until TEXT DEFAULT '-',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. INVESTIGATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS investigations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  journalist TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft',
  priority TEXT NOT NULL DEFAULT 'Sedang',
  start_date TEXT DEFAULT '',
  target_date TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_rag_indexed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. AI CHAT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  model TEXT DEFAULT 'google/gemini-2.0-flash-001',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. USER PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT DEFAULT '',
  role TEXT DEFAULT 'user',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE journalists ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Articles: Anyone can read published, authenticated can manage
CREATE POLICY "Public can view published articles" ON articles
  FOR SELECT USING (status = 'Published');

CREATE POLICY "Authenticated users can insert articles" ON articles
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can select all articles" ON articles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update articles" ON articles
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles" ON articles
  FOR DELETE TO authenticated USING (true);

-- Reports: Anyone can insert, authenticated can read
CREATE POLICY "Anyone can submit reports" ON reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can view reports" ON reports
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update reports" ON reports
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Journalists: Authenticated users can view/manage
CREATE POLICY "Authenticated can manage journalists" ON journalists
  FOR ALL USING (auth.role() = 'authenticated');

-- Investigations: Authenticated users
CREATE POLICY "Authenticated can manage investigations" ON investigations
  FOR ALL USING (auth.role() = 'authenticated');

-- AI Chat Logs: Users can only see their own
CREATE POLICY "Users can manage own chat logs" ON ai_chat_logs
  FOR ALL USING (auth.uid() = user_id);

-- Profiles: Users can view all, but only edit their own
CREATE POLICY "Public profiles are viewable" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA (Optional sample articles)
-- ============================================
-- ============================================
-- Seed data as before...
-- ============================================

-- ============================================
-- 7. RAG SYSTEM TABLES
-- ============================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents Table
CREATE TABLE IF NOT EXISTS rag_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'PDF',
  size TEXT DEFAULT '0 B',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Indexed', 'Error')),
  chunks_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PDF/Text Chunks Table
CREATE TABLE IF NOT EXISTS rag_chunks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES rag_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536), -- Dimension for OpenAI text-embedding-3-small
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can manage rag_documents" ON rag_documents
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage rag_chunks" ON rag_chunks
  FOR ALL USING (auth.role() = 'authenticated');

-- RPC for Vector Search
CREATE OR REPLACE FUNCTION match_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  similarity float,
  name TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rc.id,
    rc.document_id,
    rc.content,
    1 - (rc.embedding <=> query_embedding) AS similarity,
    rd.name
  FROM rag_chunks rc
  JOIN rag_documents rd ON rc.document_id = rd.id
  WHERE 1 - (rc.embedding <=> query_embedding) > match_threshold
  ORDER BY rc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
