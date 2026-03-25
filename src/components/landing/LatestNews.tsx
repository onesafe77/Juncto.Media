import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { motion } from 'motion/react';
import ArticleImage from '../workspace/ArticleImage';

export default function LatestNews() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-[48px] lg:py-[96px] bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-[24px] lg:px-[60px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-[32px] lg:mb-[48px] border-b border-gray-200 pb-4"
        >
          <h2 className="text-[28px] lg:text-[40px] font-heading font-extrabold text-[#003087]">Liputan Terkini</h2>
          <Link to="/workspace" className="text-[#003087] font-bold hover:text-[#001f5c] transition-colors hidden sm:block">
            Lihat Semua Berita &rarr;
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] lg:gap-[40px]">
          {/* Featured */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 group cursor-pointer min-w-0"
          >
            <div className="relative mb-[16px] lg:mb-[24px]">
              <ArticleImage src="https://picsum.photos/seed/court/800/450" alt="Court" variant="grid" category="hukum" />
              <div className="absolute top-4 left-4 bg-[#003087] text-white text-[10px] lg:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Hukum
              </div>
            </div>
            <h3 className="text-[24px] lg:text-[32px] font-heading font-bold text-gray-900 mb-[12px] lg:mb-[16px] group-hover:text-[#003087] transition-colors leading-tight truncate sm:whitespace-normal sm:line-clamp-2">
              Skandal Mafia Peradilan: Bagaimana Putusan Kasasi Bisa Dibeli
            </h3>
            <p className="text-gray-600 mb-[16px] lg:mb-[24px] line-clamp-2 text-[15px] lg:text-[18px]">
              Investigasi mendalam mengungkap jaringan makelar kasus yang beroperasi di lembaga peradilan tertinggi, melibatkan panitera hingga hakim agung.
            </p>
            <div className="flex items-center gap-4 text-[13px] lg:text-sm text-gray-500 font-medium truncate">
              <span>Oleh Tim Investigasi</span>
              <span className="flex items-center gap-1 shrink-0"><Clock className="w-4 h-4" /> 2 jam lalu</span>
              <span className="hidden sm:inline shrink-0">8 mnt baca</span>
            </div>
          </motion.div>

          {/* List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            className="lg:col-span-4 flex flex-col gap-[20px] lg:gap-[32px] min-w-0"
          >
            {[
              { tag: 'Kebijakan', color: 'bg-[#003087]', title: 'RUU Penyiaran: Ancaman Baru Kebebasan Pers?', time: '4 jam lalu' },
              { tag: 'Anggaran', color: 'bg-orange-600', title: 'Jejak Dana Desa yang Menguap di Proyek Fiktif', time: '6 jam lalu' },
              { tag: 'Keadilan', color: 'bg-green-700', title: 'Gusuran Paksa Warga Pesisir Demi Proyek Strategis', time: '1 hari lalu' }
            ].map((item, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex gap-[16px] lg:gap-[20px] group cursor-pointer min-w-0">
                <ArticleImage src={`https://picsum.photos/seed/news${idx}/200/200`} alt="News" variant="thumb" category={item.tag.toLowerCase() as any} />
                <div className="flex flex-col justify-center lg:justify-between py-1 min-w-0">
                  <div className="min-w-0">
                    <span className={`text-[9px] lg:text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider ${item.color} mb-[8px] inline-block shrink-0`}>
                      {item.tag}
                    </span>
                    <h4 className="font-heading font-bold text-gray-900 text-[15px] lg:text-[16px] leading-snug group-hover:text-[#003087] transition-colors truncate sm:whitespace-normal sm:line-clamp-2 mb-[8px] lg:mb-0">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {item.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="mt-[32px] sm:hidden">
          <Link to="/workspace" className="block text-center w-full py-3 rounded border-2 border-[#003087] text-[#003087] font-bold hover:bg-[#003087] hover:text-white transition-colors">
            Lihat Semua Berita &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
