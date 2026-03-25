import { CheckCircle, Copy, RefreshCw, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface PengaduanSuccessStateProps {
  reportNumber: string;
  onReset: () => void;
}

export default function PengaduanSuccessState({ reportNumber, onReset }: PengaduanSuccessStateProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E8EFF9] rounded-xl p-8 lg:p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
      <div className="w-20 h-20 bg-[#E8F5EE] rounded-full flex items-center justify-center text-[#10B981] mb-6">
        <CheckCircle className="w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-bold text-[#0D1B3E] mb-2">Laporan Berhasil Dikirim!</h2>
      <p className="text-[#8899AA] mb-8 max-w-md">
        Terima kasih atas partisipasi Anda. Laporan Anda akan ditinjau oleh redaksi dalam waktu 3×24 jam.
      </p>

      <div className="bg-[#F4F6FA] border border-[#E8EFF9] rounded-xl p-6 w-full max-w-sm mb-8 relative">
        <p className="text-xs font-bold text-[#8899AA] uppercase tracking-wider mb-2">Nomor Laporan Anda</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl font-mono font-black text-[#003087] tracking-wider">{reportNumber}</span>
          <button 
            onClick={handleCopy}
            className="p-2 text-[#8899AA] hover:text-[#003087] hover:bg-white rounded-lg transition-colors"
            title="Salin nomor laporan"
          >
            {copied ? <CheckCircle className="w-5 h-5 text-[#10B981]" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-[#E31B23] mt-3 font-medium">
          ⚠️ Simpan nomor ini untuk mengecek status laporan Anda.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button 
          onClick={() => {
            // Scroll to status checker
            const checker = document.querySelector('input[placeholder*="Masukkan nomor laporan"]');
            if (checker) {
              checker.scrollIntoView({ behavior: 'smooth', block: 'center' });
              (checker as HTMLInputElement).focus();
            }
          }}
          className="flex-1 h-12 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-[#003087] text-white hover:bg-[#001A5E] transition-colors"
        >
          Cek Status Laporan
          <ArrowRight className="w-4 h-4" />
        </button>
        <button 
          onClick={onReset}
          className="flex-1 h-12 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border border-[#E8EFF9] text-[#0D1B3E] hover:bg-[#F4F6FA] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Kirim Baru
        </button>
      </div>
    </div>
  );
}
