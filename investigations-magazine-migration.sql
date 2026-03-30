-- Migration for Investigasi (Digital Magazine format)
-- Run this in your Supabase SQL Editor

ALTER TABLE investigations 
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Investigasi',
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS free_pages_count INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS pages JSONB DEFAULT '[]'::jsonb;

-- Insert 3 Dummy Investigations with 6-8 Pages
INSERT INTO investigations (id, title, description, category, journalist, status, priority, image_url, published_at, free_pages_count, pages)
VALUES 
(
  'INV-DUMMY1', 
  'Skandal Anggaran Fiktif di Dinas XYZ', 
  'Penelusuran mendalam terkait temuan BPK mengenai aliran dana fiktif sebesar Rp 40 Miliar di Dinas XYZ yang melibatkan sejumlah pejabat tinggi daerah.', 
  'Korupsi', 
  'Budi Santoso', 
  'Published', 
  'Tinggi', 
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800', 
  NOW() - INTERVAL '2 days', 
  3, 
  '[
    {"id": "p1", "order": 0, "type": "cover", "title": "Bab 1: Jejak Dana Siluman", "content": "", "image_url": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800", "is_locked": false},
    {"id": "p2", "order": 1, "type": "text", "title": "Awal Mula Temuan", "content": "Berdasarkan laporan hasil pemeriksaan BPK tahun 2023, ditemukan adanya kejanggalan pada pos belanja daerah XYZ...", "is_locked": false},
    {"id": "p3", "order": 2, "type": "quote", "title": "Tanggapan Aktivis", "content": "Ini adalah perampokan uang rakyat secara terang-terangan di siang bolong. - Ketua LSM Anti Korupsi", "is_locked": false},
    {"id": "p4", "order": 3, "type": "text_image", "title": "Dokumen BPK Bocor", "content": "Tim Juncto.Media mendapatkan salinan dokumen yang menunjukkan aliran dana ke beberapa perusahaan cangkang.", "image_url": "https://images.unsplash.com/photo-1569002243425-a131238dc5bc?auto=format&fit=crop&q=80&w=800", "is_locked": true},
    {"id": "p5", "order": 4, "type": "text", "title": "Aliran ke Pejabat", "content": "Dari 6 perusahaan vendor yang memenangkan tender, 4 di antaranya terafiliasi dengan keluarga dekat Kadis XYZ...", "is_locked": true},
    {"id": "p6", "order": 5, "type": "closing", "title": "Kesimpulan Pertama", "content": "KPK saat ini sedang memantau perkembangan kasus ini. Nantikan laporan lanjutan kami minggu depan.", "is_locked": true}
  ]'::jsonb
),
(
  'INV-DUMMY2', 
  'Kartel Tanah di Kawasan Ekonomi Khusus', 
  'Bagaimana ribuan hektar tanah warga direbut paksa menggunakan instrumen hukum yang cacat demi pembangunan kawasan industri.', 
  'Hukum & Kriminal', 
  'Siti Aminah', 
  'Published', 
  'Sedang', 
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', 
  NOW() - INTERVAL '5 days', 
  2, 
  '[
    {"id": "p1", "order": 0, "type": "cover", "title": "Bab 1: Tanah Air Mata", "content": "", "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800", "is_locked": false},
    {"id": "p2", "order": 1, "type": "text", "title": "Jeritan Petani", "content": "Sudah 3 generasi keluarga Pak Ujang bertani di lahan seluas 2 hektar ini. Namun tiba-tiba...", "is_locked": false},
    {"id": "p3", "order": 2, "type": "text_image", "title": "Sertifikat Ganda", "content": "BPN menerbitkan sertifikat HGB untuk korporasi X di atas SHM milik puluhan penduduk desa bersinar.", "image_url": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800", "is_locked": true},
    {"id": "p4", "order": 3, "type": "quote", "title": "Pengakuan Pakar", "content": "Sistem pendaftaran tanah kita masih sangat rentan dimanipulasi oleh oknum pejabat BPN - Dr. Agraria", "is_locked": true},
    {"id": "p5", "order": 4, "type": "text", "title": "Aktor Intelektual", "content": "Penelusuran kami menemukan nama seorang pengusaha ternama di balik PT. X...", "is_locked": true},
    {"id": "p6", "order": 5, "type": "text", "title": "Gugatan Hukum", "content": "Warga kini mengajukan gugatan tata usaha negara (PTUN) untuk membatalkan sertifikat korporasi.", "is_locked": true},
    {"id": "p7", "order": 6, "type": "closing", "title": "Harapan di Ujung Palu Hakim", "content": "Kini nasib ribuan warga bergantung pada integritas majelis hakim PTUN.", "is_locked": true}
  ]'::jsonb
),
(
  'INV-DUMMY3', 
  'Jual Beli Vonis di Pengadilan Tipikor', 
  'Investigasi eksklusif membongkar jaringan makelar kasus yang mempertemukan pengacara, panitera, dan hakim agung pembaca putusan.', 
  'Mafia Peradilan', 
  'Anton Wijaya', 
  'Draft', 
  'Tinggi', 
  'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&q=80&w=800', 
  NULL, 
  4, 
  '[
    {"id": "p1", "order": 0, "type": "cover", "title": "Bab 1: Harga Sebuah Keadilan", "content": "", "image_url": "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&q=80&w=800", "is_locked": false},
    {"id": "p2", "order": 1, "type": "text", "title": "Rekaman CCTV", "content": "Pada tanggal 12 Agustus 2023, terekam sebuah pertemuan di lobi hotel mewah Jakarta Selatan...", "is_locked": false},
    {"id": "p3", "order": 2, "type": "text", "title": "Sandi Durian Musang King", "content": "Dalam percakapan WhatsApp yang kami sadap, mereka menggunakan istilah Durian Musang King untuk merujuk ke fee 2 Miliar Rupiah.", "is_locked": false},
    {"id": "p4", "order": 3, "type": "quote", "title": "Komentar Ketua KY", "content": "Kami akan memanggil semua pihak yang disebutkan dalam bukti rekaman tersebut. - Ketua Komisi Yudisial", "is_locked": false},
    {"id": "p5", "order": 4, "type": "text_image", "title": "Aliran Rekening", "content": "PPATK mendeteksi transaksi mencurigakan dari rekening istri muda sang Panitera.", "image_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800", "is_locked": true},
    {"id": "p6", "order": 5, "type": "text", "title": "Vonis Bebas yang Janggal", "content": "Terdakwa kasus korupsi proyek infrastruktur Jembatan Z akhirnya divonis bebas murni pada sidang 25 Agustus.", "is_locked": true},
    {"id": "p7", "order": 6, "type": "text", "title": "Konfirmasi Pihak Terkait", "content": "Saat kami mencoba meminta konfirmasi dari Hakim A, ia menolak memberikan komentar.", "is_locked": true},
    {"id": "p8", "order": 7, "type": "closing", "title": "Bersambung", "content": "Tim kami masih mengumpulkan bukti kuat keterlibatan pihak lain sebelum diserahkan ke penegak hukum yang lebih bersih.", "is_locked": true}
  ]'::jsonb
);
ON CONFLICT (id) DO NOTHING;
