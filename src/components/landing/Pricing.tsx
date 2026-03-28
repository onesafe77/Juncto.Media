import { Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Pricing() {
  return (
    <section className="py-[48px] lg:py-[96px] bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#F4F6FA]"></div>

      <div className="max-w-[1200px] mx-auto px-[24px] lg:px-[60px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-[40px] lg:mb-[64px]"
        >
          <h2 className="text-[32px] lg:text-[48px] leading-[1.2] font-heading font-extrabold text-[#003087] mb-4">Pilih Akses Anda.</h2>
          <p className="text-[#4A5568] text-[16px] lg:text-[18px] max-w-2xl mx-auto">Dukung jurnalisme investigasi independen dan dapatkan akses tak terbatas ke seluruh fitur Juncto.Media.</p>
        </motion.div>

        <div className="flex justify-center items-center">
          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl border-2 border-[#003087] overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 bg-[#E31B23] text-white text-[10px] lg:text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              PALING POPULER
            </div>

            <div className="bg-gradient-to-br from-[#003087] to-[#001f5c] p-8 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400 fill-yellow-400" />
                <h3 className="text-xl lg:text-2xl font-heading font-bold uppercase tracking-wider">PREMIUM</h3>
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-2xl lg:text-3xl font-bold">Rp</span>
                <span className="text-4xl lg:text-5xl font-extrabold tracking-tight">150.000</span>
                <span className="text-white/70 text-sm lg:text-base">/ bulan</span>
              </div>
              <p className="text-[13px] lg:text-sm text-white/70">Batalkan kapan saja. Bebas komitmen.</p>
            </div>

            <div className="p-8">
              <ul className="space-y-4 mb-8">
                {[
                  'Semua berita & rubrik tanpa batas',
                  'Akses penuh Investigasi Eksklusif',
                  'AI Legal Assistant (Unlimited)',
                  'Template Dokumen Hukum',
                  'Bookmark & riwayat baca',
                  'Bebas iklan (Ad-free)'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 rounded-full p-0.5 shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-900 font-bold text-[15px]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth" className="block w-full py-4 rounded bg-[#E31B23] hover:bg-[#c5171e] transition-colors font-bold text-white text-center text-[16px] lg:text-lg shadow-lg shadow-red-500/20">
                Berlangganan Sekarang &rarr;
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
