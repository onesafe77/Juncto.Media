import { useState } from 'react';
import { BarChart2, FileText, Loader2, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import RubrikHeader from '../components/workspace/RubrikHeader';
import ArticleCard from '../components/workspace/ArticleCard';
import { useArticles } from '../hooks/useArticles';

export default function Anggaran() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'APBN', 'APBD', 'Proyek Strategis', 'Dana Desa', 'Subsidi'];
  const { articles, loading } = useArticles('Anggaran', 10);

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
        title="Anggaran"
        description="Melacak aliran uang negara — dari APBN, APBD, hingga proyek pemerintah"
        accentColor="#1B5E20"
        icon={<BarChart2 className="w-8 h-8 md:w-10 md:h-10" />}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="bg-[#F1F8E9] border border-[#A5D6A7] rounded-xl p-4 sm:p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#A5D6A7]">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-[#1B5E20] mb-1 uppercase tracking-wider">💰 APBN 2025</span>
            <span className="text-3xl font-heading font-extrabold text-[#1B5E20]">Rp3.621 T</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center pt-4 sm:pt-0">
            <span className="text-sm font-bold text-[#1B5E20] mb-1 uppercase tracking-wider">📉 Realisasi</span>
            <span className="text-3xl font-heading font-extrabold text-[#1B5E20]">Rp1.204 T <span className="text-lg font-medium">(33%)</span></span>
          </div>
          <div className="flex flex-col items-center justify-center text-center pt-4 sm:pt-0">
            <span className="text-sm font-bold text-[#1B5E20] mb-1 uppercase tracking-wider">📊 Defisit</span>
            <span className="text-3xl font-heading font-extrabold text-[#1B5E20]">-2.8% <span className="text-lg font-medium">GDP</span></span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E8EFF9]">
              <Loader2 className="w-8 h-8 animate-spin text-[#1B5E20] mb-2" />
              <p className="text-[12px] font-bold text-[#8899AA]">Memuat berita anggaran...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                rubrik="anggaran"
                title={article.title}
                snippet={article.content.replace(/[#*`]/g, '').slice(0, 160) + '...'}
                tags={article.tags || []}
                author={article.author || 'Tim Redaksi'}
                time={new Date(article.created_at).toLocaleDateString('id-ID')}
                imageUrl={article.image_url || `https://picsum.photos/seed/anggaran${index}/800/600`}
                isFeatured={index === 0 && activeTab === 'Semua'}
              />
            ))
          ) : (
            <div className="py-20 bg-white rounded-xl border border-dashed border-[#A5D6A7] text-center">
              <SearchIcon size={48} className="mx-auto text-[#A5D6A7] mb-4 opacity-20" />
              <h3 className="font-bold text-[#0D1B3E] mb-1">Belum ada berita di kategori ini</h3>
              <p className="text-sm text-[#8899AA]">Berita anggaran yang Anda upload di CMS akan muncul di sini.</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-white rounded-xl border border-blue-gray/30 p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Anggaran Terpopuler</h3>
            <div className="space-y-4">
              {articles.slice(0, 3).map((item, i) => (
                <Link key={item.id} to={`/workspace/article/${item.id}`} className="flex gap-3 group cursor-pointer">
                  <span className="text-2xl font-heading font-bold text-blue-gray/30 group-hover:text-[#1B5E20] transition-colors">{i + 1}</span>
                  <div>
                    <h4 className="font-bold text-sm text-dark group-hover:text-[#1B5E20] transition-colors line-clamp-2 mb-1">{item.title}</h4>
                    <span className="text-xs text-[#8899AA]">{item.views} views</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Proyek Terpantau</h3>
            <div className="space-y-5">
              {[
                { name: 'Tol Trans Sumatra', progress: 75, budget: 'Rp120 T' },
                { name: 'Bendungan Bener', progress: 42, budget: 'Rp2.06 T' },
                { name: 'LRT Jabodebek Fase 2', progress: 15, budget: 'Rp32 T' }
              ].map((project, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold text-dark mb-1">
                    <span>{project.name}</span>
                    <span className="text-[#1B5E20]">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-gray/20 rounded-full mb-1">
                    <div className="h-full bg-[#1B5E20] rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <div className="text-xs text-[#8899AA] text-right">Anggaran: {project.budget}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
