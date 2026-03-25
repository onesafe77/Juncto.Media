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
      image: "https://picsum.photos/seed/kebijakan/400/300",
      headline: "RUU Penyiaran: Ancaman Baru Kebebasan Pers atau Regulasi Masa Depan?",
      snippet: "Analisis mendalam mengenai pasal-pasal kontroversial dalam draf terbaru RUU Penyiaran yang memicu perdebatan publik secara luas.",
      time: "2 jam lalu",
      author: "Tim Riset Regulasi"
    },
    {
      num: "02",
      tagColor: "bg-[#1A8C5B]",
      label: "Pilar Kedua", title: "Anggaran", category: "anggaran" as const,
      image: "https://picsum.photos/seed/anggaran/400/300",
      headline: "Jejak Dana Desa yang Menguap di Proyek Fiktif Infrastruktur Daerah",
      snippet: "Investigasi mengungkap kebocoran anggaran hingga miliaran rupiah pada proyek-proyek infrastruktur fiktif di berbagai desa.",
      time: "5 jam lalu",
      author: "Divisi Audit Finansial"
    },
    {
      num: "03",
      tagColor: "bg-[#C41A1A]",
      label: "Pilar Ketiga", title: "Hukum", category: "hukum" as const,
      image: "https://picsum.photos/seed/hukum/400/300",
      headline: "Skandal Makelar Kasus: Bagaimana Putusan Kasasi Bisa Dikendalikan",
      snippet: "Membongkar jaringan mafia peradilan yang melibatkan oknum panitera hingga hakim dalam mengatur putusan kasasi tingkat akhir.",
      time: "8 jam lalu",
      author: "Tim Investigasi Hukum"
    },
    {
      num: "04",
      tagColor: "bg-[#C47A00]",
      label: "Pilar Keempat", title: "Keadilan", category: "keadilan" as const,
      image: "https://picsum.photos/seed/keadilan/400/300",
      headline: "Gusuran Paksa Warga Pesisir Demi Ambisi Proyek Strategis Nasional",
      snippet: "Liputan langsung dari lapangan menyoroti pengabaian hak asasi manusia dan ganti rugi yang tidak layak bagi warga pesisir.",
      time: "1 hari lalu",
      author: "Desk Sosial Kemasyarakatan"
    }
  ];

  const STATS = [
    { num: "500+", label: "Investigasi" },
    { num: "10.000+", label: "Pembaca Aktif" },
    { num: "4", label: "Pilar Pengawasan" },
    { num: "34", label: "Kementerian" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

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

        {/* Grid 4 Kartu (News Display) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-[40px] lg:mb-[52px]"
        >
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group bg-white rounded-[16px] overflow-hidden border border-[#E8EFF9] hover:border-[#C5D3E8] hover:shadow-[0_8px_30px_rgba(0,48,135,0.08)] transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image Section */}
              <div className="relative h-[180px] lg:h-[200px] overflow-hidden">
                <ArticleImage src={pillar.image} alt={pillar.headline} variant="grid" category={pillar.category as any} />
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full text-white uppercase tracking-[0.08em] ${pillar.tagColor} shadow-sm backdrop-blur-sm`}>
                    {pillar.title}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-[11px] font-bold tracking-[0.12em] text-[#8899AA] uppercase mb-2">
                  {pillar.label}
                </div>

                <h3 className="text-[18px] font-bold tracking-tight text-[#0D1B3E] mb-3 leading-[1.4] group-hover:text-[#003087] transition-colors line-clamp-3">
                  {pillar.headline}
                </h3>

                <p className="text-[14px] text-[#6B7A99] leading-[1.6] mb-4 line-clamp-3">
                  {pillar.snippet}
                </p>

                {/* Footer Section */}
                <div className="mt-auto pt-4 border-t border-[#F0F4FB] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#0D1B3E]">
                    Oleh <span className="font-bold">{pillar.author}</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-[#8899AA] text-[11px] font-medium">
                    <Clock size={12} />
                    {pillar.time}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
              <span className="hidden sm:inline text-[13px] text-[#8899AA]">Mulai baca sekarang —</span>
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
    </section>
  );
}
