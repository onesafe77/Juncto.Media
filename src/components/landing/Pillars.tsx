import { FileText, BarChart2, Shield, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Pillars() {
  const PILLARS = [
    {
      num: "01", iconBg: "#EEF0FF", iconColor: "#4A5FD4",
      label: "Pilar Pertama", title: "Kebijakan", tag: "Regulasi",
      icon: FileText,
      desc: "Membedah regulasi, peraturan pemerintah, dan keputusan administratif yang membentuk arah negara.",
      bullets: [
        "Analisis mendalam regulasi baru setiap minggu",
        "Lacak dampak kebijakan fiskal & moneter negara",
        "Monitor reformasi birokrasi 34 kementerian"
      ]
    },
    {
      num: "02", iconBg: "#E8F5EE", iconColor: "#1A8C5B",
      label: "Pilar Kedua", title: "Anggaran", tag: "APBN / APBD",
      icon: BarChart2,
      desc: "Melacak aliran uang negara dari APBN, APBD, hingga proyek strategis — mengungkap ke mana pajak rakyat mengalir.",
      bullets: [
        "Pantau realisasi APBN Rp3.621 triliun secara akurat",
        "Audit jurnalistik proyek infrastruktur strategis",
        "Lacak serapan dana desa di 76.000 desa Indonesia"
      ]
    },
    {
      num: "03", iconBg: "#FFEBEB", iconColor: "#C41A1A",
      label: "Pilar Ketiga", title: "Hukum", tag: "Peradilan",
      icon: Shield,
      desc: "Mengawasi proses peradilan, aparat penegak hukum, dan akses masyarakat terhadap keadilan.",
      bullets: [
        "Monitor jadwal sidang perkara publik setiap hari",
        "Analisis putusan MA dan MK yang berdampak luas",
        "Lacak OTT KPK dan perkembangan setiap kasusnya"
      ]
    },
    {
      num: "04", iconBg: "#FFF6E0", iconColor: "#C47A00",
      label: "Pilar Keempat", title: "Keadilan", tag: "Masyarakat",
      icon: Users,
      desc: "Menilai dampak nyata hukum dan kebijakan terhadap masyarakat akar rumput — dari buruh hingga masyarakat adat.",
      bullets: [
        "Liputan langsung korban ketimpangan hukum",
        "Pantau kasus sengketa tanah masyarakat adat aktif",
        "Investigasi pelanggaran HAM & akses bantuan hukum"
      ]
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

        {/* Grid 4 Kartu */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-[32px] lg:mb-[44px]"
        >
          {PILLARS.map((pillar, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="group bg-white border border-[#E8EFF9] rounded-[16px] p-[28px_22px_22px] min-h-[380px] cursor-pointer transition-all duration-200 hover:border-[#C5D3E8] hover:shadow-[0_4px_24px_rgba(0,48,135,0.07)] flex flex-col w-full"
            >
              <div className="text-[11px] font-bold tracking-[0.12em] text-[#C5D3E8] mb-[18px]">
                {pillar.num}
              </div>
              
              <div 
                className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center mb-[16px]"
                style={{ backgroundColor: pillar.iconBg }}
              >
                <pillar.icon size={22} color={pillar.iconColor} strokeWidth={2} />
              </div>
              
              <div 
                className="text-[10px] font-bold tracking-[0.1em] uppercase mb-[6px]"
                style={{ color: pillar.iconColor }}
              >
                {pillar.label}
              </div>
              
              <h3 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#0D1B3E] mb-[8px]">
                {pillar.title}
              </h3>
              
              <p className="text-[13px] text-[#6B7A99] leading-[1.65] mb-[18px]">
                {pillar.desc}
              </p>
              
              <ul className="flex flex-col gap-[7px] mb-[20px] flex-grow">
                {pillar.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span 
                      className="w-[5px] h-[5px] rounded-full shrink-0 mt-[6px]"
                      style={{ backgroundColor: pillar.iconColor }}
                    ></span>
                    <span className="text-[11px] text-[#8899AA] leading-[1.5]">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="h-[1px] bg-[#F0F4FB] mb-[14px] w-full"></div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold tracking-[0.1em] text-[#B0BDD4] uppercase">
                  {pillar.tag}
                </span>
                <div className="w-[28px] h-[28px] rounded-full border border-[#E8EFF9] flex items-center justify-center group-hover:border-[#C5D3E8] group-hover:bg-[#F4F6FA] transition-colors">
                  <ArrowRight size={14} className="text-[#8899AA] transform group-hover:translate-x-[2px] transition-transform" />
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
