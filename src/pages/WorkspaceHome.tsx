import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Share2, Clock, Lock, Search, Loader2 } from 'lucide-react';
import ArticleImage from '../components/workspace/ArticleImage';
import { useArticles } from '../hooks/useArticles';

export default function WorkspaceHome() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Kebijakan', 'Anggaran', 'Hukum', 'Keadilan'];
  const { articles, loading } = useArticles(activeTab === 'Semua' ? undefined : activeTab, 10);

  // Get first article as featured if available
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const otherArticles = articles.length > 1 ? articles.slice(1) : articles;

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      {/* Row 1: Featured News */}
      {featuredArticle ? (
        <div className="mb-8 animate-in fade-in duration-700">
          <Link to={`/workspace/article/${featuredArticle.id}`} className="block relative aspect-[21/9] min-h-[300px] rounded-xl overflow-hidden group shadow-lg">
            <ArticleImage
              src={featuredArticle.image_url || "https://picsum.photos/seed/featured/1200/600"}
              alt={featuredArticle.title}
              variant="featured"
              category={featuredArticle.category.toLowerCase() as any}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001A5E] via-[#001A5E]/40 to-transparent pointer-events-none"></div>

            <div className="absolute top-4 left-4 bg-[#003087] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {featuredArticle.category}
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight group-hover:text-[#C5D3E8] transition-colors max-w-4xl truncate sm:whitespace-normal sm:line-clamp-2">
                {featuredArticle.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-[#C5D3E8] font-medium truncate">
                  <span>{featuredArticle.author || 'Tim Redaksi'}</span>
                  <span className="flex items-center gap-1 shrink-0"><Clock className="w-4 h-4" /> {new Date(featuredArticle.created_at).toLocaleDateString('id-ID')}</span>
                  {featuredArticle.is_premium && <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">PREMIUM</span>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm" onClick={(e) => e.preventDefault()}>
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm" onClick={(e) => e.preventDefault()}>
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : !loading && (
        <div className="mb-8 p-12 bg-white rounded-xl border border-dashed border-[#C5D3E8] text-center">
          <p className="text-[#8899AA] font-bold">Belum ada artikel unggulan.</p>
        </div>
      )}

      {/* Row 2: Trending Ticker */}
      <div className="mb-8 rounded-lg overflow-hidden flex bg-[#E31B23] text-white shadow-sm">
        <div className="px-4 py-2 font-bold uppercase text-xs sm:text-sm whitespace-nowrap z-10 bg-[#E31B23] border-r border-white/20 flex items-center">
          🔴 TERBARU:
        </div>
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-medium flex shrink-0">
            {articles.length > 0 ? (
              <>
                <div className="flex shrink-0">
                  {articles.map(a => (
                    <Link key={a.id} to={`/workspace/article/${a.id}`} className="mx-4 hover:underline cursor-pointer">{a.title}</Link>
                  ))}
                </div>
                <div className="flex shrink-0">
                  {articles.map(a => (
                    <Link key={`${a.id}-dup`} to={`/workspace/article/${a.id}`} className="mx-4 hover:underline cursor-pointer">{a.title}</Link>
                  ))}
                </div>
              </>
            ) : (
              <span className="mx-4">Menunggu berita terbaru...</span>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Main Grid + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab
                  ? 'bg-[#003087] text-white shadow-md'
                  : 'bg-white text-text-medium hover:bg-blue-gray/20 border border-blue-gray/30'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E8EFF9]">
                <Loader2 className="w-8 h-8 animate-spin text-[#003087] mb-2" />
                <p className="text-[12px] font-bold text-[#8899AA]">Memuat artikel...</p>
              </div>
            ) : articles.length > 0 ? (
              articles.map((item) => (
                <Link key={item.id} to={`/workspace/article/${item.id}`} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-blue-gray/20 hover:shadow-md transition-all group min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-full sm:w-48 aspect-video sm:aspect-[4/3] rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <ArticleImage
                      src={item.image_url || `https://picsum.photos/seed/${item.id}/400/300`}
                      alt={item.title}
                      variant="grid"
                      category={item.category.toLowerCase() as any}
                      className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="min-w-0">
                      <span className="bg-[#003087] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block shrink-0">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-heading font-bold text-dark mb-2 leading-snug group-hover:text-[#003087] transition-colors truncate sm:whitespace-normal sm:line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-text-medium text-sm hidden sm:line-clamp-2 mb-4">
                        {item.content.replace(/[#*`]/g, '').slice(0, 150)}...
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-text-light font-medium flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 shrink-0" /> <span className="shrink-0">{new Date(item.created_at).toLocaleDateString('id-ID')} &bull; {item.views} Views</span>
                      </span>
                      <div className="flex gap-2 shrink-0">
                        <button className="p-1.5 text-text-light hover:text-[#003087] transition-colors" onClick={(e) => e.preventDefault()}>
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-text-light hover:text-[#003087] transition-colors" onClick={(e) => e.preventDefault()}>
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-20 bg-white rounded-xl border border-dashed border-[#C5D3E8] text-center">
                <Search size={48} className="mx-auto text-[#C5D3E8] mb-4 opacity-20" />
                <h3 className="font-bold text-[#0D1B3E] mb-1">Belum ada berita</h3>
                <p className="text-sm text-[#8899AA]">Berita yang Anda upload di CMS akan muncul di sini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-6">
          {/* Widget 1: Investigasi Terbaru */}
          <div className="bg-white rounded-xl border border-[#C5D3E8]/30 overflow-hidden">
            <div className="bg-[#001A5E] text-white p-4 flex items-center justify-between">
              <h3 className="font-heading font-bold flex items-center gap-2">
                <Search className="w-4 h-4 text-[#E31B23]" /> Investigasi Terbaru
              </h3>
              <Lock className="w-4 h-4 text-white/50" />
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3].map(i => (
                <Link key={i} to="/workspace/investigasi" className="block group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#E31B23] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Premium</span>
                    <span className="text-xs text-[#8899AA] font-mono">Part {i}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#0D1B3E] group-hover:text-[#003087] transition-colors leading-snug">
                    Gurita Bisnis Pejabat Daerah di Proyek Infrastruktur
                  </h4>
                </Link>
              ))}
            </div>
          </div>

          {/* Widget 2: Trending */}
          <div className="bg-white rounded-xl border border-[#C5D3E8]/30 p-4">
            <h3 className="font-heading font-bold text-[#0D1B3E] mb-4 border-b border-[#C5D3E8]/30 pb-2">Trending Hari Ini</h3>
            <div className="space-y-4">
              {articles.slice(0, 5).map((item, i) => (
                <Link key={item.id} to={`/workspace/article/${item.id}`} className="flex gap-3 group">
                  <span className="text-2xl font-heading font-extrabold text-[#C5D3E8]/60 group-hover:text-[#003087] transition-colors">0{i + 1}</span>
                  <h4 className="font-bold text-sm text-[#0D1B3E] group-hover:text-[#003087] transition-colors leading-snug mt-1 line-clamp-2">
                    {item.title}
                  </h4>
                </Link>
              ))}
              {!loading && articles.length === 0 && (
                <p className="text-xs text-[#8899AA] text-center py-4">Belum ada berita trending.</p>
              )}
            </div>
          </div>

          {/* Widget 3: Subscription */}
          <div className="bg-gradient-to-br from-[#003087] to-[#001A5E] rounded-xl p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <h3 className="font-heading font-bold text-xl mb-2">Upgrade Aksesmu</h3>
            <p className="text-sm text-[#C5D3E8] mb-6">Buka semua investigasi, dokumen hukum, dan AI Legal Assistant.</p>
            <Link to="/workspace/settings" className="block w-full py-3 rounded bg-[#E31B23] hover:bg-[#C8151D] transition-colors font-bold text-white text-sm shadow-lg shadow-[#E31B23]/20">
              Upgrade Premium &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
