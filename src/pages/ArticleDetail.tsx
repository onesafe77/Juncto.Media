import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, Share2, Printer, Clock, Lock, Bot, FileText, Loader2, AlertCircle } from 'lucide-react';
import ArticleImage from '../components/workspace/ArticleImage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error: supabaseError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) throw supabaseError;
        setArticle(data);

        // Increment views
        if (data) {
          await supabase
            .from('articles')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
        }

        // Check bookmark status if user is logged in
        if (user) {
          const { data: bookmarkData } = await supabase
            .from('bookmarks')
            .select('id')
            .eq('user_id', user.id)
            .eq('article_id', id)
            .single();
          setIsBookmarked(!!bookmarkData);

          // Record reading history
          await supabase
            .from('reading_history')
            .upsert({
              user_id: user.id,
              article_id: id,
              last_read_at: new Date().toISOString()
            }, { onConflict: 'user_id,article_id' });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id, user]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.snippet || article.title,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Tautan disalin ke papan klip!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      alert('Silakan login untuk menyimpan artikel');
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', id);

        if (error) throw error;
        setIsBookmarked(false);
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, article_id: id });

        if (error) throw error;
        setIsBookmarked(true);
      }
    } catch (err: any) {
      console.error('Bookmark error:', err);
      alert('Gagal memperbarui bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#003087] mb-4" />
        <p className="font-bold text-[#8899AA]">Memuat artikel...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center p-6">
        <AlertCircle className="w-12 h-12 text-[#E31B23] mb-4" />
        <h2 className="text-2xl font-bold text-[#0D1B3E] mb-2">Artikel Tidak Ditemukan</h2>
        <p className="text-[#8899AA] mb-8">{error || 'Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.'}</p>
        <Link to="/workspace" className="bg-[#003087] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#002566] transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Article Header (Wide) */}
      <div className="p-4 lg:p-8 max-w-[1000px] mx-auto pt-12">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-[#E31B23] text-white text-[11px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-[0.1em]">
              {article.category}
            </span>
            <span className="text-[#8899AA] text-sm font-mono">/</span>
            <Link to="/workspace" className="text-sm text-[#8899AA] hover:text-[#003087] transition-colors font-bold uppercase tracking-wider">Beranda</Link>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#0D1B3E] mb-6 leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {article.tags && article.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] font-bold text-[#003087] bg-[#003087]/5 border border-[#003087]/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#003087] flex items-center justify-center font-bold text-white text-xl shadow-lg">
                {article.author ? article.author[0] : 'R'}
              </div>
              <div className="text-left">
                <p className="font-black text-base text-[#0D1B3E] leading-tight">{article.author || 'Redaksi Juncto'}</p>
                <p className="text-[11px] font-bold text-[#E31B23] uppercase tracking-widest mt-0.5">Jurnalis Investigasi</p>
              </div>
            </div>

            <div className="h-px w-24 bg-[#E8EFF9]"></div>

            <div className="flex items-center gap-6 text-[12px] font-bold text-[#8899AA] uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#003087]" /> {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#003087]" /> {article.views || 0} Pembaca</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 border-y border-[#E8EFF9] py-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F6FA] hover:bg-[#003087] hover:text-white transition-all text-[#0D1B3E] font-bold text-xs uppercase tracking-wider shadow-sm group"
            >
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Bagikan
            </button>
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-bold text-xs uppercase tracking-wider shadow-sm group ${isBookmarked
                ? 'bg-[#003087] text-white'
                : 'bg-[#F4F6FA] text-[#0D1B3E] hover:bg-[#003087] hover:text-white'
                }`}
            >
              <Bookmark className={`w-4 h-4 group-hover:scale-110 transition-transform ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Tersimpan' : 'Simpan'}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F6FA] hover:bg-[#001A5E] hover:text-white transition-all text-[#0D1B3E] font-bold text-xs uppercase tracking-wider shadow-sm group"
            >
              <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" /> Cetak
            </button>
          </div>
        </div>

        {article.image_url && (
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl scale-[1.02] border-4 border-white">
            <ArticleImage src={article.image_url} alt={article.title} variant="featured" category={article.category.toLowerCase() as any} className="w-full h-full" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] font-medium italic">
              Foto: Dokumen Redaksi Juncto.Media
            </div>
          </div>
        )}

        {/* Article Body (Narrow Reading Column) */}
        <div className="max-w-[720px] mx-auto">
          <div className="article-body selection:bg-[#003087]/10">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* Social Footer */}
          <div className="mt-12 pt-8 border-t border-[#E8EFF9]">
            <h4 className="text-xs font-black text-[#0D1B3E] uppercase tracking-[0.2em] mb-6 text-center">Bagikan Artikel Ini</h4>
            <div className="flex justify-center gap-4">
              {[
                { name: 'WhatsApp', icon: <Share2 className="w-4 h-4" />, color: '#25D366' },
                { name: 'Facebook', icon: <Share2 className="w-4 h-4" />, color: '#1877F2' },
                { name: 'X', icon: <Share2 className="w-4 h-4" />, color: '#000000' }
              ].map(platform => (
                <button
                  key={platform.name}
                  onClick={handleShare}
                  className="w-12 h-12 rounded-full border border-[#E8EFF9] flex items-center justify-center hover:scale-110 transition-all text-[#8899AA] shadow-sm hover:text-white"
                  style={{ '--hover-bg': platform.color } as any}
                >
                  {platform.icon}
                </button>
              ))}
            </div>
          </div>

          {/* AI Integration Button */}
          <div className="mt-12 mb-16">
            <Link to="/workspace/ai-legal" className="flex items-center justify-between bg-gradient-to-r from-[#003087] to-[#001A5E] text-white p-6 rounded-2xl shadow-2xl hover:shadow-[#003087]/20 transition-all border border-white/10 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-lg">Tanya AI tentang berita ini</p>
                  <p className="text-sm text-[#C5D3E8]">Dapatkan penjelasan hukum & analisis mendalam sekarang</p>
                </div>
              </div>
              <span className="font-black text-2xl group-hover:translate-x-2 transition-transform pr-2 relative z-10">&rarr;</span>
            </Link>
          </div>

          {/* Related News Grid */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 border-b border-[#E8EFF9] pb-4">
              <h3 className="text-xl font-heading font-black text-[#0D1B3E] uppercase tracking-wider">Berita Terkait</h3>
              <Link to="/workspace" className="text-sm font-bold text-[#E31B23] hover:underline">Lihat Semua &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <Link key={i} to={`/workspace/article/${i + 1}`} className="group block min-w-0">
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 shadow-md">
                    <ArticleImage src={`https://picsum.photos/seed/rel${i}/600/400`} alt="Related" variant="grid" category="kebijakan" className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1B3E] group-hover:text-[#003087] transition-colors line-clamp-2 leading-snug">
                    Analisis Dampak Regulasi Baru Terhadap Kebebasan Pers di Indonesia
                  </h4>
                  <p className="text-xs text-[#8899AA] mt-2 font-bold uppercase tracking-widest">24 Maret 2024</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
