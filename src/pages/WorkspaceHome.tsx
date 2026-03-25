import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Share2, Clock, Lock, Search } from 'lucide-react';
import ArticleImage from '../components/workspace/ArticleImage';

export default function WorkspaceHome() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Kebijakan', 'Anggaran', 'Hukum', 'Keadilan'];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      {/* Row 1: Featured News */}
      <div className="mb-8">
        <Link to="/workspace/article/1" className="block relative aspect-[21/9] min-h-[300px] rounded-xl overflow-hidden group">
          <ArticleImage src="https://picsum.photos/seed/featured/1200/600" alt="Featured" variant="featured" category="hukum" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001A5E] via-[#001A5E]/40 to-transparent pointer-events-none"></div>
          
          <div className="absolute top-4 left-4 bg-[#003087] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Hukum
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight group-hover:text-[#C5D3E8] transition-colors max-w-4xl truncate sm:whitespace-normal sm:line-clamp-2">
              Skandal Mafia Peradilan: Bagaimana Putusan Kasasi Bisa Dibeli
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-[#C5D3E8] font-medium truncate">
                <span>Tim Investigasi</span>
                <span className="flex items-center gap-1 shrink-0"><Clock className="w-4 h-4" /> 2 jam lalu</span>
                <span className="shrink-0">8 mnt baca</span>
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

      {/* Row 2: Trending Ticker */}
      <div className="mb-8 rounded-lg overflow-hidden flex bg-[#E31B23] text-white">
        <div className="px-4 py-2 font-bold uppercase text-xs sm:text-sm whitespace-nowrap z-10 bg-[#E31B23] border-r border-white/20 flex items-center">
          🔴 TRENDING:
        </div>
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-medium flex shrink-0">
            <div className="flex shrink-0">
              <span className="mx-4 hover:underline cursor-pointer">DPR Sahkan RUU Kesehatan di Tengah Protes Nakes</span> <span className="text-white/50">&bull;</span>
              <span className="mx-4 hover:underline cursor-pointer">Investigasi: Aliran Dana Proyek BTS Kominfo</span> <span className="text-white/50">&bull;</span>
              <span className="mx-4 hover:underline cursor-pointer">Vonis Bebas Terdakwa Korupsi Asabri Dibatalkan MA</span> <span className="text-white/50">&bull;</span>
            </div>
            <div className="flex shrink-0">
              <span className="mx-4 hover:underline cursor-pointer">DPR Sahkan RUU Kesehatan di Tengah Protes Nakes</span> <span className="text-white/50">&bull;</span>
              <span className="mx-4 hover:underline cursor-pointer">Investigasi: Aliran Dana Proyek BTS Kominfo</span> <span className="text-white/50">&bull;</span>
              <span className="mx-4 hover:underline cursor-pointer">Vonis Bebas Terdakwa Korupsi Asabri Dibatalkan MA</span> <span className="text-white/50">&bull;</span>
            </div>
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

          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} to={`/workspace/article/${item}`} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-blue-gray/20 hover:shadow-md transition-shadow group min-w-0">
                <div className="w-full sm:w-48 aspect-video sm:aspect-[4/3] rounded-lg overflow-hidden shrink-0">
                  <ArticleImage src={`https://picsum.photos/seed/news${item}/400/300`} alt="News" variant="grid" category="anggaran" className="w-full h-full" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="min-w-0">
                    <span className="bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block shrink-0">
                      Anggaran
                    </span>
                    <h3 className="text-lg font-heading font-bold text-dark mb-2 leading-snug group-hover:text-primary transition-colors truncate sm:whitespace-normal sm:line-clamp-2">
                      Jejak Dana Desa yang Menguap di Proyek Fiktif Infrastruktur Daerah
                    </h3>
                    <p className="text-text-medium text-sm hidden sm:line-clamp-2 mb-4">
                      Temuan BPK menunjukkan adanya kerugian negara miliaran rupiah dari proyek pembangunan jalan desa yang tidak pernah selesai.
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-text-light font-medium flex items-center gap-1 truncate">
                      <Clock className="w-3 h-3 shrink-0" /> <span className="shrink-0">6 jam lalu &bull; 5 mnt baca</span>
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button className="p-1.5 text-text-light hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-text-light hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
              {[1, 2, 3, 4, 5].map(i => (
                <Link key={i} to={`/workspace/article/${i}`} className="flex gap-3 group">
                  <span className="text-2xl font-heading font-extrabold text-[#C5D3E8]/60 group-hover:text-[#003087] transition-colors">0{i}</span>
                  <h4 className="font-bold text-sm text-[#0D1B3E] group-hover:text-[#003087] transition-colors leading-snug mt-1">
                    RUU Penyiaran: Ancaman Baru Kebebasan Pers di Era Digital?
                  </h4>
                </Link>
              ))}
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
