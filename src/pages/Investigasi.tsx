import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Search, Loader2, Calendar, User, ChevronRight, X } from 'lucide-react';
import ArticleImage from '../components/workspace/ArticleImage';
import { useArticles } from '../hooks/useArticles';
import { supabase } from '../lib/supabase';

export default function Investigasi() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const tabs = ['Semua', 'Kebijakan', 'Anggaran', 'Hukum', 'Keadilan'];
  const { articles, loading: loadingArticles } = useArticles('Investigasi', 12);

  useEffect(() => {
    async function fetchInvestigations() {
      setLoadingCases(true);
      const { data, error } = await supabase
        .from('investigations')
        .select('*')
        .neq('status', 'Draft')
        .order('created_at', { ascending: false });

      if (!error && data) setInvestigations(data);
      setLoadingCases(false);
    }
    fetchInvestigations();
  }, []);

  // Filter articles by sub-category tab if not "Semua"
  const filteredArticles = activeTab === 'Semua'
    ? articles
    : articles.filter(a =>
      (a.tags && a.tags.some(tag => tag.toLowerCase() === activeTab.toLowerCase())) ||
      a.title.toLowerCase().includes(activeTab.toLowerCase()) ||
      a.content.toLowerCase().includes(activeTab.toLowerCase()) ||
      a.category.toLowerCase() === activeTab.toLowerCase()
    );

  const StatusBadge = ({ status }: { status: string }) => {
    let bg = '#F3F4F6', text = '#6B7280';
    const s = status.toLowerCase();
    if (['published', 'aktif', 'selesai'].includes(s)) { bg = '#E8F5EE'; text = '#1A8C5B'; }
    else if (['review', 'proses'].includes(s)) { bg = '#EEF0FF'; text = '#4A5FD4'; }
    return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: bg, color: text }}>{status}</span>;
  };

  return (
    <div className="w-full pb-20">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-br from-[#001A5E] to-[#003087] text-white py-12 lg:py-20 px-4 lg:px-8 shadow-inner">
        <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-left-4 duration-700">
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-4">Investigasi Eksklusif</h1>
          <p className="text-[#C5D3E8] text-lg md:text-xl max-w-3xl">Laporan mendalam, dokumen rahasia, dan analisis data yang mengungkap fakta di balik layar.</p>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-12">

        {/* SECTION 1: KASUS INVESTIGASI AKTIF */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#0D1B3E] flex items-center gap-3">
              <span className="w-2 h-8 bg-[#E31B23] rounded-full"></span>
              Kasus Investigasi Aktif
            </h2>
          </div>

          {loadingCases ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[300px] h-[200px] bg-gray-100 animate-pulse rounded-2xl border border-[#E8EFF9]"></div>
              ))}
            </div>
          ) : investigations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investigations.map((item) => (
                <Link
                  key={item.id}
                  to={`/workspace/investigasi/${item.id}`}
                  className="bg-white rounded-2xl border border-[#E8EFF9] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group text-left w-full cursor-pointer"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.image_url || `https://picsum.photos/seed/${item.id}/600/400`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-[#0D1B3E] mb-2 line-clamp-2 leading-tight group-hover:text-[#003087] transition-colors">{item.title}</h3>
                    <p className="text-sm text-[#8899AA] line-clamp-3 mb-4 flex-1">{item.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#F4F6FA] text-[11px] font-bold text-[#8899AA] uppercase tracking-wider">
                      <div className="flex items-center gap-1.5"><User size={12} className="text-[#003087]" /> {item.journalist || 'Tim Juncto'}</div>
                      <div className="flex items-center gap-1.5"><Calendar size={12} /> {item.target_date ? 'Target: ' + item.target_date : 'On Progress'}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 bg-[#F4F6FA] rounded-2xl border-2 border-dashed border-[#E8EFF9] text-center">
              <Search size={40} className="mx-auto text-[#C5D3E8] mb-3 opacity-30" />
              <p className="text-sm font-bold text-[#8899AA]">Belum ada kasus investigasi aktif</p>
            </div>
          )}
        </section>

        {/* SECTION 2: LAPORAN MENDALAM (ARTIKEL) */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-black text-[#0D1B3E] flex items-center gap-3">
              <span className="w-2 h-8 bg-[#003087] rounded-full"></span>
              Laporan Mendalam
            </h2>
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 sm:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab
                    ? 'bg-[#003087] text-white shadow-md'
                    : 'bg-white text-text-medium hover:bg-blue-gray/20 border border-blue-gray/30'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {loadingArticles ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-[#C5D3E8]">
                <Loader2 className="w-10 h-10 animate-spin text-[#003087] mb-4" />
                <p className="font-bold text-[#8899AA]">Memuat laporan investigasi...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/workspace/article/${article.id}`}
                  className="bg-white rounded-2xl border border-blue-gray/30 overflow-hidden hover:shadow-xl transition-all group flex flex-col min-w-0 animate-in fade-in zoom-in-95 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-full aspect-[4/3] relative overflow-hidden shrink-0">
                    <ArticleImage
                      src={article.image_url || `https://picsum.photos/seed/inv${index}/800/600`}
                      alt={article.title}
                      variant="grid"
                      category={article.category.toLowerCase() as any}
                      className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/90 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                      <span className="bg-[#E31B23] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Search className="w-3 h-3" /> Investigasi
                      </span>
                      {article.is_premium && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3" /> Premium
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 min-w-0">
                    <h2 className="text-xl font-heading font-bold text-[#0D1B3E] mb-3 leading-tight group-hover:text-[#003087] transition-colors truncate sm:whitespace-normal sm:line-clamp-3">
                      {article.title}
                    </h2>

                    <p className="text-[#8899AA] mb-4 hidden sm:line-clamp-3 text-sm flex-1">
                      {article.content.replace(/[#*`]/g, '').slice(0, 150)}...
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8EFF9]">
                      <div className="text-xs text-[#8899AA] font-medium truncate">
                        {article.author || 'Tim Investigasi'} &bull; {new Date(article.created_at).toLocaleDateString('id-ID')}
                      </div>
                      <div className="text-[#003087] font-bold text-sm flex items-center gap-1 shrink-0 transition-colors group-hover:text-[#E31B23]">
                        Baca <span className="hidden sm:inline">Lengkap</span> &rarr;
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-[#C5D3E8] text-center">
                <Search size={48} className="mx-auto text-[#C5D3E8] mb-4 opacity-20" />
                <h3 className="font-bold text-[#0D1B3E] mb-1">Belum ada laporan investigasi</h3>
                <p className="text-sm text-[#8899AA]">Laporan investigasi yang Anda upload di CMS akan muncul di sini.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
