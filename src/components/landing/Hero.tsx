import { Play, Shield, Bot, FileCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Ticker from './Ticker';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#003087] text-white pt-[120px] pb-[80px] lg:pt-[160px] lg:pb-[160px] px-[20px] lg:px-0">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/newsroom/1920/1080?blur=10')] opacity-20 mix-blend-overlay"></div>

      <div className="relative z-10 w-full max-w-[800px] mx-auto px-5 lg:px-0 py-10 lg:py-0 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[12px] lg:text-sm font-medium mb-6 lg:mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse"></span>
          LIVE &middot; Dual Oversight Media Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[28px] sm:text-[32px] lg:text-[64px] font-heading font-black tracking-tight leading-[1.1] mb-4 lg:mb-6"
        >
          <span className="whitespace-nowrap">Mengawasi Kekuasaan.</span><br />
          Mengawal <span className="text-[#E31B23] underline decoration-[#E31B23]/30 underline-offset-4 lg:underline-offset-8">Keadilan.</span>
        </motion.h1>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col lg:flex-row items-center gap-[10px] lg:gap-4 mb-10 lg:mb-16 w-full lg:w-auto"
        >
          <Link to="/workspace" className="w-full lg:w-auto px-8 py-3.5 lg:py-4 rounded bg-[#E31B23] hover:bg-[#C8151D] transition-colors font-bold flex items-center justify-center gap-2 text-[15px] lg:text-lg">
            <Play className="w-5 h-5 fill-current" />
            Mulai Baca Gratis
          </Link>
          <Link to="/workspace/investigasi" className="w-full lg:w-auto px-8 py-3.5 lg:py-4 rounded border border-white/30 hover:bg-white/10 transition-colors font-bold flex items-center justify-center gap-2 text-[15px] lg:text-lg">
            Lihat Investigasi Premium &rarr;
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col lg:flex-row items-center gap-4 mb-12 lg:mb-16"
        >
          <div className="flex -space-x-3">
            <img className="w-10 h-10 rounded-full border-2 border-[#003087] object-cover" src="https://i.pravatar.cc/150?img=32" alt="User" referrerPolicy="no-referrer" />
            <img className="w-10 h-10 rounded-full border-2 border-[#003087] object-cover" src="https://i.pravatar.cc/150?img=11" alt="User" referrerPolicy="no-referrer" />
            <img className="w-10 h-10 rounded-full border-2 border-[#003087] object-cover" src="https://i.pravatar.cc/150?img=12" alt="User" referrerPolicy="no-referrer" />
            <img className="w-10 h-10 rounded-full border-2 border-[#003087] object-cover" src="https://i.pravatar.cc/150?img=5" alt="User" referrerPolicy="no-referrer" />
            <img className="w-10 h-10 rounded-full border-2 border-[#003087] object-cover" src="https://i.pravatar.cc/150?img=15" alt="User" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex gap-1 text-amber-400 mb-1">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="text-sm font-medium text-white/80">Dipercaya 149.969+ Pembaca</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 lg:gap-8 text-[13px] lg:text-sm font-medium text-white/70"
        >
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" /> Data Terverifikasi
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4" /> AI-Powered
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Investigasi Independen
          </div>
        </motion.div>
      </div>

      <Ticker />
    </section>
  );
}
