import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Search } from 'lucide-react';
import ArticleImage from '../components/workspace/ArticleImage';

export default function Investigasi() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Kebijakan', 'Anggaran', 'Hukum', 'Keadilan'];

  return (
    <div className="w-full">
      {/* Header Section: Full width dengan background gelap/gradient */}
      <div className="w-full bg-gradient-to-br from-[#001A5E] to-[#003087] text-white py-12 lg:py-20 px-4 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-4">Investigasi Eksklusif</h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl">Laporan mendalam, dokumen rahasia, dan analisis data yang mengungkap fakta di balik layar.</p>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 sm:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-text-medium hover:bg-blue-gray/20 border border-blue-gray/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium text-text-medium shrink-0">
            <span>Urutkan:</span>
            <select className="bg-white border border-blue-gray/30 rounded-lg px-3 py-2 outline-none focus:border-primary">
              <option>Terbaru</option>
              <option>Terpopuler</option>
              <option>Terlama</option>
            </select>
          </div>
        </div>

        {/* Grid Artikel: 3 kolom desktop, 1 kolom mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-2xl border border-blue-gray/30 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col min-w-0">
              <div className="w-full aspect-[4/3] relative overflow-hidden shrink-0">
                <ArticleImage src={`https://picsum.photos/seed/inv${item}/800/600`} alt="Investigasi" variant="grid" category="hukum" className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <Search className="w-3 h-3" /> Investigasi
                  </span>
                  <span className="bg-dark text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1 min-w-0">
                <h2 className="text-xl font-heading font-bold text-dark mb-3 leading-tight group-hover:text-primary transition-colors truncate sm:whitespace-normal sm:line-clamp-3">
                  {item % 2 === 1 ? 'Gurita Bisnis Pejabat Daerah di Proyek Infrastruktur' : 'Jejak Hitam Tambang Ilegal di Hutan Lindung Kalimantan'}
                </h2>
                
                <p className="text-text-medium mb-4 hidden sm:line-clamp-3 text-sm flex-1">
                  Dokumen rahasia yang kami peroleh menunjukkan adanya aliran dana miliaran rupiah ke rekening pribadi pejabat terkait perizinan tambang. Penelusuran lebih lanjut mengungkap jaringan perusahaan cangkang yang digunakan untuk menyamarkan kepemilikan.
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-blue-gray/20">
                  <div className="text-xs text-text-light font-medium truncate">
                    Tim Investigasi &bull; 2 hari lalu
                  </div>
                  <Link to={`/workspace/article/inv-${item}`} className="text-primary hover:text-secondary font-bold text-sm flex items-center gap-1 shrink-0">
                    Baca <span className="hidden sm:inline">Investigasi</span> &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
