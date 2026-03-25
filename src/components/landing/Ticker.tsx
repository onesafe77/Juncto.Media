import { motion } from 'motion/react';

export default function Ticker() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[40px] bg-[#E31B23] text-white overflow-hidden flex items-center z-50">
      <div className="px-3 lg:px-4 font-bold uppercase text-[10px] lg:text-sm whitespace-nowrap z-10 bg-[#E31B23] pr-3 lg:pr-4 border-r border-white/20 relative flex items-center">
        <span className="mr-1.5 lg:mr-2">🔴</span> TERBARU:
      </div>
      <div className="flex-1 overflow-hidden relative flex">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="whitespace-nowrap text-[12px] lg:text-sm font-medium flex shrink-0 items-center"
        >
          <div className="flex shrink-0 items-center">
            <span className="mx-3 lg:mx-4 hover:underline cursor-pointer">DPR Sahkan RUU Kesehatan di Tengah Protes Nakes</span> <span className="text-white/50">&bull;</span>
            <span className="mx-3 lg:mx-4 hover:underline cursor-pointer">Investigasi: Aliran Dana Proyek BTS Kominfo</span> <span className="text-white/50">&bull;</span>
            <span className="mx-3 lg:mx-4 hover:underline cursor-pointer">Vonis Bebas Terdakwa Korupsi Asabri Dibatalkan MA</span> <span className="text-white/50">&bull;</span>
            <span className="mx-3 lg:mx-4 hover:underline cursor-pointer">Laporan Khusus: Dampak Polusi Udara Jakarta terhadap Anak</span> <span className="text-white/50">&bull;</span>
          </div>
          <div className="flex shrink-0 items-center">
            <span className="mx-3 lg:mx-4 hover:underline cursor-pointer">DPR Sahkan RUU Kesehatan di Tengah Protes Nakes</span> <span className="text-white/50">&bull;</span>
            <span className="mx-3 lg:mx-4 hover:underline cursor-pointer">Investigasi: Aliran Dana Proyek BTS Kominfo</span> <span className="text-white/50">&bull;</span>
            <span className="mx-3 lg:mx-4 hover:underline cursor-pointer">Vonis Bebas Terdakwa Korupsi Asabri Dibatalkan MA</span> <span className="text-white/50">&bull;</span>
            <span className="mx-3 lg:mx-4 hover:underline cursor-pointer">Laporan Khusus: Dampak Polusi Udara Jakarta terhadap Anak</span> <span className="text-white/50">&bull;</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
