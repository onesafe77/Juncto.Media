import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PengaduanGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      num: "1",
      title: "Pilih kategori yang paling sesuai",
      desc: "Kategori membantu redaksi mengarahkan laporan ke desk yang tepat."
    },
    {
      num: "2",
      title: "Jelaskan kronologi dengan detail",
      desc: "Sertakan tanggal, lokasi, nama instansi, dan pihak yang terlibat."
    },
    {
      num: "3",
      title: "Lampirkan bukti yang Anda miliki",
      desc: "Dokumen, foto, atau screenshot memperkuat laporan Anda."
    },
    {
      num: "4",
      title: "Simpan nomor laporan Anda",
      desc: "Gunakan untuk memantau status tindak lanjut redaksi."
    }
  ];

  return (
    <div className="bg-[#F4F6FA] border border-[#E8EFF9] rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between lg:cursor-default"
      >
        <h3 className="text-[15px] font-bold text-[#0D1B3E] flex items-center gap-2">
          <span>📋</span> Cara Melapor yang Efektif
        </h3>
        <div className="lg:hidden text-[#8899AA]">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      
      <div className={`px-5 pb-5 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#003087] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#0D1B3E] mb-1">{step.title}</h4>
                  <p className="text-[11px] text-[#8899AA] leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="absolute left-2.5 top-6 bottom-[-16px] w-[0.5px] border-l border-dashed border-[#C5D3E8]"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
