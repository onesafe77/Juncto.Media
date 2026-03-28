import { useState } from 'react';
import { FileText, Loader2, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import RubrikHeader from '../components/workspace/RubrikHeader';
import ArticleCard from '../components/workspace/ArticleCard';
import { useArticles } from '../hooks/useArticles';

export default function Kebijakan() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Regulasi', 'Peraturan Daerah', 'Kebijakan Fiskal', 'Reformasi Birokrasi'];
  const { articles, loading } = useArticles('Kebijakan', 10);

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
        title="Kebijakan"
        description="Analisis regulasi, kebijakan publik, dan keputusan administratif negara"
        accentColor="#003087"
        icon={<FileText className="w-8 h-8 md:w-10 md:h-10" />}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E8EFF9]">
              <Loader2 className="w-8 h-8 animate-spin text-[#003087] mb-2" />
              <p className="text-[12px] font-bold text-[#8899AA]">Memuat berita kebijakan...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                rubrik="kebijakan"
                title={article.title}
                snippet={article.content.replace(/[#*`]/g, '').slice(0, 160) + '...'}
                tags={article.tags || []}
                author={article.author || 'Tim Redaksi'}
                time={new Date(article.created_at).toLocaleDateString('id-ID')}
                imageUrl={article.image_url || `https://picsum.photos/seed/kebijakan${index}/800/600`}
                isFeatured={index === 0 && activeTab === 'Semua'}
              />
            ))
          ) : (
            <div className="py-20 bg-white rounded-xl border border-dashed border-[#E8EFF9] text-center">
              <SearchIcon size={48} className="mx-auto text-[#E8EFF9] mb-4 opacity-20" />
              <h3 className="font-bold text-[#0D1B3E] mb-1">Belum ada berita di kategori ini</h3>
              <p className="text-sm text-[#8899AA]">Berita kebijakan yang Anda upload di CMS akan muncul di sini.</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Kebijakan Terpopuler</h3>
            <div className="space-y-4">
              <div className="space-y-4">
                {articles.slice(0, 3).map((item, i) => (
                  <Link key={item.id} to={`/workspace/article/${item.id}`} className="flex gap-3 group cursor-pointer">
                    <span className="text-2xl font-heading font-bold text-blue-gray/30 group-hover:text-[#003087] transition-colors">{i + 1}</span>
                    <div>
                      <h4 className="font-bold text-sm text-dark group-hover:text-[#003087] transition-colors line-clamp-2 mb-1">{item.title}</h4>
                      <span className="text-xs text-[#8899AA]">{item.views} views</span>
                    </div>
                  </Link>
                ))}
                {!loading && articles.length === 0 && (
                  <p className="text-xs text-[#8899AA] text-center py-4">Belum ada berita terpopuler.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Kementerian Terkait</h3>
            <div className="flex flex-wrap gap-2">
              {['Kemenkeu', 'Kemenkes', 'BKPM', 'PUPR', 'Kemendagri', 'Kemenkumham'].map(k => (
                <button key={k} className="px-3 py-1.5 bg-[#F4F6FA] hover:bg-[#EEF0FF] border border-[#E8EFF9] rounded-md text-sm font-medium text-[#0D1B3E] transition-colors">
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
