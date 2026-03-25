import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function PengaduanStatusChecker() {
  const [reportId, setReportId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId.trim()) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (reportId.startsWith('JM-')) {
        setStatus('found');
      } else {
        setStatus('not-found');
      }
    }, 800);
  };

  return (
    <div className="bg-white border border-[#E8EFF9] rounded-xl p-5">
      <h3 className="text-[15px] font-bold text-[#0D1B3E] mb-4 flex items-center gap-2">
        <span>🔍</span> Cek Status Laporan
      </h3>
      
      <form onSubmit={handleCheck} className="flex gap-2 mb-5">
        <input 
          type="text" 
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          placeholder="Masukkan nomor laporan (contoh: JM-2025-04782)"
          className="flex-1 border border-[#E8EFF9] rounded-lg h-10 px-3 text-xs focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 bg-white"
        />
        <button 
          type="submit"
          disabled={!reportId.trim() || status === 'loading'}
          className="bg-[#003087] text-white px-4 h-10 rounded-lg text-xs font-bold hover:bg-[#001A5E] transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {status === 'loading' ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
          Cek
        </button>
      </form>

      {status === 'found' && (
        <div className="border border-[#E8EFF9] rounded-lg p-4 bg-[#F4F6FA]">
          <div className="flex items-center justify-between mb-3 border-b border-[#E8EFF9] pb-3">
            <span className="font-mono font-bold text-sm text-[#0D1B3E]">{reportId}</span>
            <span className="bg-[#FFF6E0] text-[#C47A00] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
              Sedang Ditinjau
            </span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8899AA]">Kategori</span>
              <span className="font-medium text-[#0D1B3E]">Anggaran</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8899AA]">Dikirim</span>
              <span className="font-medium text-[#0D1B3E]">24 Mar 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8899AA]">Update Terakhir</span>
              <span className="font-medium text-[#0D1B3E]">25 Mar 2025 &middot; 09.14</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t border-[#E8EFF9]">
              <span className="text-[#8899AA]">Estimasi</span>
              <span className="font-medium text-[#0D1B3E]">Selesai dalam 2 hari</span>
            </div>
          </div>
        </div>
      )}

      {status === 'not-found' && (
        <div className="bg-[#FFEBEB] border border-[#FCA5A5] text-[#C41A1A] p-3 rounded-lg text-xs text-center">
          Nomor laporan tidak ditemukan. Pastikan format nomor benar (JM-TAHUN-XXXXX).
        </div>
      )}
    </div>
  );
}
