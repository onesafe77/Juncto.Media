import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PengaduanSecurity() {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {
      icon: "🔐",
      title: "Enkripsi End-to-End",
      desc: "Semua data laporan dienkripsi sebelum disimpan di server kami."
    },
    {
      icon: "👤",
      title: "Identitas Terlindungi",
      desc: "Pilihan anonim memastikan tidak ada data identitas yang tersimpan."
    },
    {
      icon: "📁",
      title: "Data Terbatas",
      desc: "Hanya redaksi terverifikasi yang dapat mengakses laporan masuk."
    }
  ];

  return (
    <div className="bg-white border border-[#E8EFF9] rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between lg:cursor-default"
      >
        <h3 className="text-[15px] font-bold text-[#0D1B3E] flex items-center gap-2">
          <span>🔒</span> Keamanan Laporan Anda
        </h3>
        <div className="lg:hidden text-[#8899AA]">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      
      <div className={`px-5 pb-5 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#E8EFF9] flex items-center justify-center shrink-0 mt-0.5 text-sm">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0D1B3E] mb-1">{item.title}</h4>
                <p className="text-[11px] text-[#8899AA] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
