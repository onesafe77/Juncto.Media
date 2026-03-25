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

-- Articles: Anyone can read published, authenticated can create
CREATE POLICY "Public can view published articles" ON articles
  FOR SELECT USING (status = 'Published');

CREATE POLICY "Authenticated users can manage articles" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

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
INSERT INTO articles (title, content, snippet, category, author, status, is_premium, views, image_url) VALUES
('KPK OTT Kadis PU Bogor: Kronologi dan Dampak Hukum', 'Investigasi mendalam tentang operasi tangkap tangan KPK terhadap Kepala Dinas PU Kota Bogor...', 'KPK berhasil melakukan OTT terhadap Kadis PU Bogor terkait dugaan suap proyek infrastruktur.', 'Hukum', 'Tim Investigasi', 'Published', false, 4821, 'https://picsum.photos/seed/kpk/800/450'),
('Omnibus Law 3 Tahun Pasca Pengesahan: Evaluasi Dampak', 'Tiga tahun berlalu sejak pengesahan UU Cipta Kerja...', 'Evaluasi komprehensif dampak Omnibus Law terhadap dunia ketenagakerjaan dan investasi.', 'Kebijakan', 'Rina Suryani', 'Published', false, 8932, 'https://picsum.photos/seed/omnibus/800/450'),
('Gurita Bisnis Pejabat Daerah: Investigasi Premium', 'Investigasi eksklusif mengungkap jaringan bisnis tersembunyi...', 'Membongkar jaringan bisnis tersembunyi pejabat daerah yang memanfaatkan jabatan untuk kepentingan pribadi.', 'Investigasi', 'Tim Investigasi', 'Published', true, 12093, 'https://picsum.photos/seed/gurita/800/450'),
('Dana IKN: Audit BPK Temukan Selisih Rp2,4 Triliun', 'Badan Pemeriksa Keuangan menemukan selisih signifikan...', 'BPK menemukan selisih anggaran sebesar Rp2,4 triliun dalam proyek IKN Nusantara.', 'Anggaran', 'Ahmad Dermawan', 'Published', false, 6745, 'https://picsum.photos/seed/ikn/800/450');
