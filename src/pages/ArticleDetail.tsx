import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Share2, Printer, Clock, Lock, Bot, FileText } from 'lucide-react';
import ArticleImage from '../components/workspace/ArticleImage';

export default function ArticleDetail() {
  const [isPremium] = useState(false); // Mock state
  const isInvestigasi = true; // Mock article type

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Article */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Kebijakan
              </span>
              <span className="text-text-light text-sm">&bull;</span>
              <Link to="/workspace" className="text-sm text-text-medium hover:text-primary transition-colors">Beranda</Link>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-dark mb-6 leading-tight">
              RUU Penyiaran: Ancaman Baru Kebebasan Pers di Era Digital?
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-blue-gray/30 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-gray/30 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=author" alt="Author" />
                </div>
                <div>
                  <p className="font-bold text-sm text-dark">Ahmad Reza</p>
                  <p className="text-xs text-text-medium">Jurnalis Kebijakan Publik</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-text-medium">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 24 Mar 2026</span>
                <span>&bull;</span>
                <span>5 mnt baca</span>
                <div className="flex gap-2 ml-2">
                  <button className="p-2 rounded-full hover:bg-blue-gray/20 transition-colors text-text-dark">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-blue-gray/20 transition-colors text-text-dark">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-blue-gray/20 transition-colors text-text-dark hidden sm:block">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 shrink-0">
            <ArticleImage src="https://picsum.photos/seed/article1/1200/600" alt="Article" variant="featured" category="kebijakan" className="w-full h-full" />
            <div className="absolute bottom-0 left-0 w-full bg-dark/70 text-white/80 text-xs p-2 backdrop-blur-sm">
              Ilustrasi: Gedung DPR RI (Foto: Juncto.Media/Dok)
            </div>
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-dark prose-p:text-text-dark prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-secondary">
            <p className="lead text-xl font-medium text-text-medium mb-8">
              Revisi Undang-Undang Penyiaran yang tengah dibahas di DPR memicu kontroversi. Sejumlah pasal dinilai berpotensi membungkam kebebasan pers dan kebebasan berekspresi di ruang digital.
            </p>

            <p>
              Jakarta, Juncto.Media — Pembahasan draf revisi Undang-Undang Nomor 32 Tahun 2002 tentang Penyiaran (RUU Penyiaran) terus menuai penolakan dari berbagai kalangan, mulai dari organisasi profesi jurnalis, pegiat hak asasi manusia, hingga pembuat konten digital.
            </p>

            <blockquote className="border-l-4 border-primary bg-light-blue/30 p-4 rounded-r-lg my-8 italic text-dark font-medium">
              "Ini bukan sekadar regulasi penyiaran konvensional, tapi upaya sistematis untuk mengontrol narasi di ruang digital yang selama ini menjadi alternatif publik."
            </blockquote>

            <h3 className="text-2xl mt-8 mb-4">Pasal-Pasal Bermasalah</h3>
            <p>
              Berdasarkan draf yang diperoleh Juncto.Media, terdapat beberapa pasal krusial yang menjadi sorotan:
            </p>
            
            <div className="bg-off-white border border-blue-gray/30 p-6 rounded-xl my-6">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Sorotan Data
              </h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Pasal 50B ayat (2) huruf c:</strong> Larangan penayangan eksklusif jurnalistik investigasi.</li>
                <li><strong>Pasal 50B ayat (2) huruf k:</strong> Larangan penayangan konten yang mengandung berita bohong, fitnah, penghinaan, pencemaran nama baik. (Dinilai karet dan tumpang tindih dengan UU ITE).</li>
                <li><strong>Pasal 8A ayat (1) huruf q:</strong> Kewenangan KPI untuk menyelesaikan sengketa jurnalistik khusus di bidang penyiaran. (Mengambil alih peran Dewan Pers).</li>
              </ul>
            </div>

            {isInvestigasi && !isPremium ? (
              <div className="relative mt-8">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10"></div>
                <p className="blur-[2px] select-none">
                  Lebih jauh lagi, penelusuran kami menemukan adanya lobi-lobi politik dari kelompok tertentu yang berkepentingan untuk meloloskan pasal larangan investigasi ini. Dokumen risalah rapat internal yang bocor menunjukkan...
                </p>
                
                <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col items-center justify-center p-8 bg-white border border-blue-gray/20 rounded-xl shadow-xl transform translate-y-1/4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-dark mb-2 text-center">Lanjutkan membaca investigasi ini</h3>
                  <p className="text-text-medium text-center mb-6 text-sm max-w-md">
                    Bagian ini berisi temuan eksklusif, dokumen rahasia, dan analisis mendalam yang hanya tersedia untuk member Juncto Premium.
                  </p>
                  <Link to="/workspace/settings" className="w-full sm:w-auto px-8 py-3 rounded bg-accent hover:bg-accent/90 transition-colors font-bold text-white text-center shadow-lg shadow-accent/20">
                    Upgrade Premium — Rp150.000/bln
                  </Link>
                  <button className="mt-4 text-sm text-text-light hover:text-dark transition-colors underline">
                    Sudah berlangganan? Masuk
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  Lebih jauh lagi, penelusuran kami menemukan adanya lobi-lobi politik dari kelompok tertentu yang berkepentingan untuk meloloskan pasal larangan investigasi ini. Dokumen risalah rapat internal yang bocor menunjukkan...
                </p>
                {/* Full content here */}
              </>
            )}
          </div>

          {/* AI Integration Button */}
          <div className="mt-24 sm:mt-16 sticky bottom-6 z-30">
            <Link to="/workspace/ai-legal" className="flex items-center justify-between bg-primary text-white p-4 rounded-xl shadow-2xl hover:bg-secondary transition-colors border border-white/10 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base">Tanya AI tentang berita ini</p>
                  <p className="text-xs text-blue-gray hidden sm:block">Dapatkan penjelasan hukum terkait artikel ini</p>
                </div>
              </div>
              <span className="font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-8 mt-16 lg:mt-0 min-w-0">
          {/* AI Widget */}
          <div className="bg-off-white border border-blue-gray/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-dark">AI Legal Insight</h3>
            </div>
            <p className="text-sm text-text-medium mb-4">
              Pasal 50B RUU Penyiaran berpotensi bertentangan dengan Pasal 4 UU No. 40 Tahun 1999 tentang Pers yang menjamin kemerdekaan pers dan hak mencari informasi.
            </p>
            <Link to="/workspace/ai-legal" className="text-sm font-bold text-primary hover:text-secondary flex items-center gap-1">
              Analisis selengkapnya <span className="text-lg leading-none">&rsaquo;</span>
            </Link>
          </div>

          {/* Related News */}
          <div>
            <h3 className="font-heading font-bold text-dark mb-4 border-b border-blue-gray/30 pb-2">Berita Terkait</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Link key={i} to={`/workspace/article/${i + 10}`} className="flex gap-3 group min-w-0">
                  <div className="w-24 h-16 rounded overflow-hidden shrink-0">
                    <ArticleImage src={`https://picsum.photos/seed/related${i}/200/150`} alt="Related" variant="thumb" category="kebijakan" className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-dark group-hover:text-primary transition-colors leading-snug truncate sm:whitespace-normal sm:line-clamp-2">
                      Dewan Pers Tolak Keras Pasal Larangan Jurnalistik Investigasi
                    </h4>
                    <span className="text-xs text-text-light mt-1 block truncate">Kemarin</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-dark text-white rounded-xl p-6">
            <h3 className="font-heading font-bold text-lg mb-2">Juncto Briefing</h3>
            <p className="text-sm text-blue-gray mb-4">Dapatkan ringkasan investigasi dan analisis hukum terbaru setiap pagi.</p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email Anda" className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-blue-gray/50 focus:border-accent outline-none text-sm" />
              <button className="w-full py-2 rounded bg-white text-dark font-bold text-sm hover:bg-off-white transition-colors">
                Berlangganan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
