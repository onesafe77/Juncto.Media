import { useState } from 'react';
import { Users, BarChart2, Loader2, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import RubrikHeader from '../components/workspace/RubrikHeader';
import ArticleCard from '../components/workspace/ArticleCard';
import { useArticles } from '../hooks/useArticles';

export default function Keadilan() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Ketimpangan', 'HAM', 'Lingkungan', 'Perempuan & Anak', 'Masyarakat Adat'];
  const { articles, loading } = useArticles('Keadilan', 10);

  // Filter articles by sub-category tag if not "Semua"
  const filteredArticles = activeTab === 'Semua'
    ? articles
    : articles.filter(a =>
      (a.tags && a.tags.some(tag => tag.toLowerCase() === activeTab.toLowerCase())) ||
      a.title.toLowerCase().includes(activeTab.toLowerCase()) ||
      a.content.toLowerCase().includes(activeTab.toLowerCase())
    );

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <RubrikHeader
        title="Keadilan"
        description="Menilai dampak nyata hukum dan kebijakan terhadap kehidupan masyarakat"
        accentColor="#4A148C"
        icon={<Users className="w-8 h-8 md:w-10 md:h-10" />}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="bg-[#F3E5F5] border border-[#CE93D8] rounded-xl p-4 sm:p-6 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="text-sm font-bold text-[#4A148C] uppercase tracking-wider">SOROTAN MINGGU INI</h3>
          </div>
          <p className="italic text-[#4A148C] text-lg font-medium leading-relaxed">
            "3 dari 5 kasus sengketa tanah masyarakat adat berakhir tanpa putusan lebih dari 2 tahun" — Laporan Komnas HAM 2025
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E8EFF9]">
              <Loader2 className="w-8 h-8 animate-spin text-[#4A148C] mb-2" />
              <p className="text-[12px] font-bold text-[#8899AA]">Memuat berita keadilan...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                rubrik="keadilan"
                title={article.title}
                snippet={article.content.replace(/[#*`]/g, '').slice(0, 160) + '...'}
                tags={article.tags || []}
                author={article.author || 'Tim Redaksi'}
                time={new Date(article.created_at).toLocaleDateString('id-ID')}
                imageUrl={article.image_url || `https://picsum.photos/seed/keadilan${index}/800/600`}
                isFeatured={index === 0 && activeTab === 'Semua'}
              />
            ))
          ) : (
            <div className="py-20 bg-white rounded-xl border border-dashed border-[#CE93D8] text-center">
              <SearchIcon size={48} className="mx-auto text-[#CE93D8] mb-4 opacity-20" />
              <h3 className="font-bold text-[#0D1B3E] mb-1">Belum ada berita di kategori ini</h3>
              <p className="text-sm text-[#8899AA]">Berita keadilan yang Anda upload di CMS akan muncul di sini.</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-white rounded-xl border border-blue-gray/30 p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Keadilan Terpopuler</h3>
            <div className="space-y-4">
              {articles.slice(0, 3).map((item, i) => (
                <Link key={item.id} to={`/workspace/article/${item.id}`} className="flex gap-3 group cursor-pointer">
                  <span className="text-2xl font-heading font-bold text-blue-gray/30 group-hover:text-[#4A148C] transition-colors">{i + 1}</span>
                  <div>
                    <h4 className="font-bold text-sm text-dark group-hover:text-[#4A148C] transition-colors line-clamp-2 mb-1">{item.title}</h4>
                    <span className="text-xs text-[#8899AA]">{item.views} views</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Kasus Pantauan</h3>
            <div className="space-y-4">
              {[
                { case: 'Sengketa Rempang', status: 'Aktif', color: 'bg-red-500' },
                { case: 'Pencemaran Citarum', status: 'Banding', color: 'bg-amber-500' },
                { case: 'Aparat di Papua', status: 'Aktif', color: 'bg-red-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group border-b border-[#F4F6FA] pb-3 last:border-0 last:pb-0">
                  <h4 className="font-bold text-sm text-[#0D1B3E] group-hover:text-[#4A148C] transition-colors line-clamp-2 pr-4">{item.case}</h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="text-[10px] font-bold text-[#8899AA] uppercase tracking-wider">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
