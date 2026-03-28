import { useState } from 'react';
import { Scale, FileText, Loader2, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import RubrikHeader from '../components/workspace/RubrikHeader';
import ArticleCard from '../components/workspace/ArticleCard';
import { useArticles } from '../hooks/useArticles';

export default function Hukum() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Korupsi', 'Pidana Umum', 'Perdata', 'Mahkamah Agung', 'MK', 'KPK'];
  const { articles, loading } = useArticles('Hukum', 10);

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
        title="Hukum"
        description="Mengawasi proses peradilan, aparat penegak hukum, dan akses keadilan"
        accentColor="#B71C1C"
        icon={<Scale className="w-8 h-8 md:w-10 md:h-10" />}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl p-4 sm:p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#B71C1C] animate-pulse"></span>
          <h3 className="text-sm font-bold text-[#B71C1C] uppercase tracking-wider">KASUS TERPANTAU:</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'Sidang Harvey Moeis', status: 'Persidangan hari ini' },
            { name: 'Kasus Rafael Alun', status: 'Banding MA' },
            { name: 'Perkara BPJS', status: 'Putusan tunda' }
          ].map((kasus, i) => (
            <button key={i} className="flex flex-col items-start bg-white border border-[#EF9A9A] hover:border-[#B71C1C] rounded-lg px-4 py-2 transition-colors text-left group shadow-sm">
              <span className="font-bold text-dark group-hover:text-[#B71C1C] text-sm">{kasus.name}</span>
              <span className="text-xs text-[#B71C1C] font-medium">{kasus.status}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E8EFF9]">
              <Loader2 className="w-8 h-8 animate-spin text-[#B71C1C] mb-2" />
              <p className="text-[12px] font-bold text-[#8899AA]">Memuat berita hukum...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                rubrik="hukum"
                title={article.title}
                snippet={article.content.replace(/[#*`]/g, '').slice(0, 160) + '...'}
                tags={article.tags || []}
                author={article.author || 'Tim Hukum'}
                time={new Date(article.created_at).toLocaleDateString('id-ID')}
                imageUrl={article.image_url || `https://picsum.photos/seed/hukum${index}/800/600`}
                isFeatured={index === 0 && activeTab === 'Semua'}
              />
            ))
          ) : (
            <div className="py-20 bg-white rounded-xl border border-dashed border-[#EF9A9A] text-center">
              <SearchIcon size={48} className="mx-auto text-[#EF9A9A] mb-4 opacity-20" />
              <h3 className="font-bold text-[#0D1B3E] mb-1">Belum ada berita di kategori ini</h3>
              <p className="text-sm text-[#8899AA]">Berita hukum yang Anda upload di CMS akan muncul di sini.</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Hukum Terpopuler</h3>
            <div className="space-y-4">
              {articles.slice(0, 3).map((item, i) => (
                <Link key={item.id} to={`/workspace/article/${item.id}`} className="flex gap-3 group cursor-pointer">
                  <span className="text-2xl font-heading font-bold text-blue-gray/30 group-hover:text-[#B71C1C] transition-colors">{i + 1}</span>
                  <div>
                    <h4 className="font-bold text-sm text-dark group-hover:text-[#B71C1C] transition-colors line-clamp-2 mb-1">{item.title}</h4>
                    <span className="text-xs text-[#8899AA]">{item.views} views</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Jadwal Sidang Hari Ini</h3>
            <div className="space-y-4">
              {[
                { case: 'Korupsi BTS 4G', time: '09:00 WIB', court: 'PN Tipikor Jakarta Pusat' },
                { case: 'Sengketa Lahan Wadas', time: '10:30 WIB', court: 'PTUN Semarang' },
                { case: 'Uji Materiil UU ITE', time: '13:00 WIB', court: 'Mahkamah Konstitusi' },
                { case: 'Praperadilan Tersangka KPK', time: '14:00 WIB', court: 'PN Jakarta Selatan' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 group border-l-2 border-transparent hover:border-[#B71C1C] pl-2 transition-colors">
                  <div className="text-xs font-mono font-bold text-[#B71C1C] shrink-0 mt-0.5">{item.time}</div>
                  <div>
                    <h4 className="font-bold text-sm text-dark group-hover:text-[#B71C1C] transition-colors line-clamp-2 mb-1">{item.case}</h4>
                    <span className="text-[11px] text-[#8899AA]">{item.court}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Putusan Terbaru MA</h3>
            <div className="space-y-3">
              {[
                { no: '123 K/Pid.Sus/2025', desc: 'Kasasi Ditolak, Vonis 15 Tahun Tetap' },
                { no: '45 P/HUM/2025', desc: 'Uji Materiil Perda Retribusi Diterima' },
                { no: '89 PK/Pdt/2025', desc: 'Peninjauan Kembali Sengketa Merek' }
              ].map((doc, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F4F6FA] border border-transparent hover:border-blue-gray/20 transition-colors group">
                  <FileText className="w-5 h-5 text-[#8899AA] group-hover:text-[#B71C1C] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono font-bold text-[#B71C1C] mb-1">{doc.no}</div>
                    <span className="text-sm font-medium text-dark group-hover:text-[#B71C1C] line-clamp-2">{doc.desc}</span>
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
