import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import ArticleImage from '../workspace/ArticleImage';

export default function Pillars() {
  const PILLARS = [
    {
      num: "01",
      tagColor: "bg-[#4A5FD4]",
      label: "Pilar Pertama", title: "Kebijakan", category: "kebijakan" as const,
      image: "https://picsum.photos/seed/kebijakan/800/600",
      headline: "RUU Penyiaran: Ancaman Baru Kebebasan Pers atau Regulasi Masa Depan?",
      snippet: "Analisis mendalam mengenai pasal-pasal kontroversial dalam draf terbaru RUU Penyiaran yang memicu perdebatan publik secara luas. Tim Riset menemukan potensi pembungkaman terhadap pers independen melalui pasal-pasal karet.",
      time: "2 jam lalu",
      author: "Tim Riset Regulasi"
    },
    {
      num: "02",
      tagColor: "bg-[#1A8C5B]",
      label: "Pilar Kedua", title: "Anggaran", category: "anggaran" as const,
      image: "https://picsum.photos/seed/anggaran/400/300",
      headline: "Jejak Dana Desa yang Menguap di Proyek Fiktif Infrastruktur Daerah",
      time: "5 jam lalu"
    },
    {
      num: "03",
      tagColor: "bg-[#C41A1A]",
      label: "Pilar Ketiga", title: "Hukum", category: "hukum" as const,
      image: "https://picsum.photos/seed/hukum/400/300",
      headline: "Skandal Makelar Kasus: Bagaimana Putusan Kasasi Bisa Dikendalikan Tingkat Atas",
      time: "8 jam lalu"
    },
    {
      num: "04",
      tagColor: "bg-[#C47A00]",
      label: "Pilar Keempat", title: "Keadilan", category: "keadilan" as const,
      image: "https://picsum.photos/seed/keadilan/400/300",
      headline: "Gusuran Paksa Warga Pesisir Demi Ambisi Proyek Strategis Nasional Triliunan",
      time: "1 hari lalu"
    }
  ];

  const featured = PILLARS[0];
  const sidebars = PILLARS.slice(1);

  const STATS = [
    { num: "500+", label: "Investigasi" },
    { num: "10.000+", label: "Pembaca Aktif" },
    { num: "4", label: "Pilar Pengawasan" },
    { num: "34", label: "Kementerian" }
  ];

  return (
    <section className="py-12 md:py-[72px] bg-[#F4F6FA] font-sans">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[60px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-[40px] lg:mb-[52px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[28px] h-[1px] bg-[#C5D3E8]"></div>
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#8899AA] uppercase">
              Fokus Investigasi
            </span>
            <div className="w-[28px] h-[1px] bg-[#C5D3E8]"></div>
          </div>

          <h2 className="text-[28px] sm:text-[34px] lg:text-[48px] font-black text-[#0D1B3E] tracking-[-0.03em] leading-[1.1] mb-4">
            Empat Lensa <span className="text-[#E31B23]">Pengawasan</span>
          </h2>

          <p className="text-[15px] text-[#6B7A99] leading-[1.7] max-w-[520px]">
            Kami membedah kekuasaan melalui empat pilar utama — memastikan setiap kebijakan, anggaran, dan proses hukum berpihak pada keadilan publik.
          </p>
        </motion.div>

        {/* Editorial News Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-[40px] lg:mb-[52px]">
          {/* Featured Article (lg: 8 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 group cursor-pointer"
          >
            <div className="relative rounded-[16px] overflow-hidden mb-5">
              <ArticleImage src={featured.image} alt={featured.headline} variant="featured" category={featured.category as any} />
              <div className="absolute top-5 left-5">
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full text-white uppercase tracking-[0.08em] ${featured.tagColor} shadow-sm backdrop-blur-sm bg-opacity-90`}>
                  {featured.title}
                </span>
              </div>
            </div>

            <h3 className="text-[24px] md:text-[32px] font-black tracking-[-0.01em] text-[#0D1B3E] mb-3 leading-[1.25] group-hover:text-[#003087] transition-colors">
              {featured.headline}
            </h3>

            <p className="text-[15px] lg:text-[16px] text-[#6B7A99] leading-[1.7] mb-5">
              {featured.snippet}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#0D1B3E]">
                Oleh <span className="font-bold">{featured.author}</span>
              </span>
              <div className="flex items-center gap-1.5 text-[#8899AA] text-[13px] font-medium">
                <Clock size={14} />
                {featured.time}
              </div>
            </div>
          </motion.div>

          {/* Sidebar Articles (lg: 4 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <div className="h-[2px] bg-[#E8EFF9] w-full mb-2 hidden lg:block"></div>

            {sidebars.map((item, idx) => (
              <div key={idx} className="group cursor-pointer flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 pb-6 border-b border-[#E8EFF9] border-dashed last:border-0 last:pb-0">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-[140px] lg:w-full xl:w-[120px] h-[200px] sm:h-[100px] lg:h-[180px] xl:h-[90px] shrink-0 rounded-[12px] overflow-hidden">
                  <ArticleImage src={item.image} alt={item.headline} variant="thumb" category={item.category as any} />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow justify-center py-1">
                  <span className={`text-[9px] font-bold px-2 py-1 rounded text-white uppercase tracking-[0.08em] ${item.tagColor} mb-2 self-start bg-opacity-90`}>
                    {item.title}
                  </span>

                  <h4 className="text-[15px] font-bold tracking-tight text-[#0D1B3E] mb-2 leading-[1.4] group-hover:text-[#003087] transition-colors line-clamp-3">
                    {item.headline}
                  </h4>

                  <div className="flex items-center gap-1.5 text-[#8899AA] text-[11px] font-medium mt-auto">
                    <Clock size={12} />
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="border-t border-[#E8EFF9] pt-[32px] md:pt-[44px]">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 w-full lg:w-auto">
              {STATS.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center lg:items-start relative">
                  <div className="text-[24px] lg:text-[30px] font-black text-[#003087] tracking-[-0.03em] leading-none mb-1">
                    {stat.num}
                  </div>
                  <div className="text-[10px] font-bold text-[#8899AA] uppercase tracking-[0.08em] text-center lg:text-left">
                    {stat.label}
                  </div>
                  {/* Divider for desktop */}
                  {idx < STATS.length - 1 && (
                    <div className="hidden lg:block absolute right-[-24px] lg:right-[-32px] top-1/2 -translate-y-1/2 w-[1px] h-[36px] bg-[#E8EFF9]"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
              <span className="hidden sm:inline text-[13px] text-[#8899AA]">Telusuri investigasi lainnya —</span>
              <Link
                to="/workspace"
                className="w-full sm:w-auto bg-[#003087] text-white px-[20px] py-[12px] lg:py-[10px] rounded-[8px] font-bold text-sm hover:bg-[#002266] transition-colors text-center"
              >
                Akses Gratis
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section >
  );
}
