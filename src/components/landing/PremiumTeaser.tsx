import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import ArticleImage from '../workspace/ArticleImage';

export default function PremiumTeaser() {
  return (
    <section className="py-[48px] lg:py-[96px] bg-[#001f5c] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-gradient-to-b lg:bg-gradient-to-l from-[#003087]/40 to-transparent pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto px-[24px] lg:px-[60px] grid grid-cols-1 lg:grid-cols-12 gap-[40px] lg:gap-[64px] items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E31B23]/20 border border-[#E31B23]/50 text-[10px] lg:text-xs font-bold uppercase tracking-wider mb-[16px] lg:mb-[24px] text-red-400">
            <Lock className="w-3 h-3" /> Eksklusif Member
          </div>
          <h2 className="text-[32px] lg:text-[48px] font-heading font-extrabold mb-[16px] lg:mb-[24px] leading-[1.2]">
            Investigasi Mendalam.<br />
            Hanya untuk Member Premium.
          </h2>
          <p className="text-white/70 text-[16px] lg:text-[18px] mb-[32px] lg:mb-[40px] leading-relaxed">
            Akses laporan investigasi eksklusif, serial multi-part, dokumen pendukung asli, dan analisis data mentah yang tidak kami publikasikan secara gratis.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded bg-[#E31B23] hover:bg-[#c5171e] transition-colors font-bold text-[16px] lg:text-lg shadow-lg shadow-red-500/20">
            Upgrade ke Premium &mdash; Rp150.000/bln &rarr;
          </Link>
        </motion.div>

        <div className="lg:col-span-7 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#E31B23]/20 to-[#003087]/20 blur-2xl rounded-full opacity-50"></div>
          
          <div className="relative space-y-[16px] lg:space-y-[24px]">
            {[1, 2].map((i, idx) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-[16px] lg:p-[24px] flex flex-col sm:flex-row gap-[16px] lg:gap-[24px] hover:bg-white/10 transition-colors group cursor-pointer min-w-0"
              >
                <div className="w-full sm:w-48 h-[180px] sm:h-[140px] lg:h-32 rounded-lg overflow-hidden shrink-0 relative">
                  <ArticleImage src={`https://picsum.photos/seed/investigation${i}/400/300`} alt="Investigasi" variant="grid" category="hukum" className="w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2 shrink-0">
                      <span className="bg-[#E31B23] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">Premium</span>
                      <span className="text-white/50 text-xs font-mono shrink-0">Part {i} of 3</span>
                    </div>
                    <h3 className="text-[18px] lg:text-xl font-heading font-bold text-white mb-2 leading-snug group-hover:text-white/80 transition-colors truncate sm:whitespace-normal sm:line-clamp-2">
                      {i === 1 ? 'Jejak Hitam Tambang Ilegal di Hutan Lindung Kalimantan' : 'Gurita Bisnis Pejabat Daerah di Proyek Infrastruktur'}
                    </h3>
                    <div className="relative hidden sm:block">
                      <p className="text-white/60 text-[13px] lg:text-sm line-clamp-2">
                        Dokumen rahasia yang kami peroleh menunjukkan adanya aliran dana miliaran rupiah ke rekening pribadi pejabat terkait perizinan...
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between shrink-0">
                    <span className="text-[11px] lg:text-xs text-white/50 font-medium truncate">Oleh Tim Investigasi</span>
                    <span className="text-[#E31B23] text-[13px] lg:text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                      Baca Selengkapnya &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
