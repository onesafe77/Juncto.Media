import { useState, useEffect } from 'react';
import PengaduanForm from '../components/pengaduan/PengaduanForm';
import PengaduanGuide from '../components/pengaduan/PengaduanGuide';
import PengaduanSecurity from '../components/pengaduan/PengaduanSecurity';
import PengaduanStatusChecker from '../components/pengaduan/PengaduanStatusChecker';
import PengaduanSuccessState from '../components/pengaduan/PengaduanSuccessState';
import { ChevronRight, Megaphone, Inbox, CheckCircle, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PengaduanPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reportNumber, setReportNumber] = useState('');
  const [stats, setStats] = useState({ total: 0, processed: 0, finished: 0 });

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.from('reports').select('status');
      if (!error && data) {
        setStats({
          total: data.length,
          processed: data.filter(r => r.status === 'Diproses' || r.status === 'Selesai').length,
          finished: data.filter(r => r.status === 'Selesai').length,
        });
      }
    }
    fetchStats();
  }, [submitSuccess]);

  const handleSuccess = (reportId: string) => {
    setReportNumber(reportId);
    setSubmitSuccess(true);
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setReportNumber('');
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8899AA] mb-6">
        <Link to="/workspace" className="hover:text-[#003087] transition-colors">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#0D1B3E] font-medium">Pengaduan Publik</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#E31B23]/10 flex items-center justify-center text-[#E31B23]">
            <Megaphone className="w-6 h-6" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-[#0D1B3E]">
            Pengaduan Publik
          </h1>
        </div>
        <div className="w-10 h-[3px] bg-[#E31B23] mb-4"></div>
        <p className="text-[#4A5568] max-w-3xl text-sm lg:text-base mb-4">
          Laporkan dugaan korupsi, pelanggaran hukum, atau penyimpangan kebijakan kepada redaksi Juncto.Media. Identitas pelapor dijaga kerahasiaannya.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#E8F5EE] border border-[#A5D6A7] text-[#1B5E20] px-3 py-1.5 rounded-full text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          Sistem Aktif &middot; Laporan diproses dalam 3x24 jam
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 lg:gap-6 mb-8">
        <div className="bg-[#F4F6FA] rounded-[10px] p-4 lg:p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Inbox className="w-4 h-4 text-[#8899AA]" />
            <span className="text-xl lg:text-2xl font-black text-[#003087]">{stats.total.toLocaleString('id-ID')}</span>
          </div>
          <span className="text-[10px] lg:text-xs text-[#8899AA] font-medium">Total Laporan</span>
        </div>
        <div className="bg-[#F4F6FA] rounded-[10px] p-4 lg:p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-[#8899AA]" />
            <span className="text-xl lg:text-2xl font-black text-[#003087]">{stats.processed.toLocaleString('id-ID')}</span>
          </div>
          <span className="text-[10px] lg:text-xs text-[#8899AA] font-medium">Ditindaklanjuti</span>
        </div>
        <div className="bg-[#F4F6FA] rounded-[10px] p-4 lg:p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Newspaper className="w-4 h-4 text-[#8899AA]" />
            <span className="text-xl lg:text-2xl font-black text-[#003087]">{stats.finished.toLocaleString('id-ID')}</span>
          </div>
          <span className="text-[10px] lg:text-xs text-[#8899AA] font-medium">Selesai / Jadi Berita</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Widget Keamanan - Mobile: 1, Desktop: Right Col 1 */}
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 order-1 lg:order-none">
          <PengaduanSecurity />
        </div>

        {/* Form Pengaduan - Mobile: 2, Desktop: Left Col */}
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:row-span-3 order-2 lg:order-none">
          {submitSuccess ? (
            <PengaduanSuccessState reportNumber={reportNumber} onReset={handleReset} />
          ) : (
            <PengaduanForm onSuccess={handleSuccess} />
          )}
        </div>

        {/* Widget Panduan - Mobile: 3, Desktop: Right Col 2 */}
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2 order-3 lg:order-none">
          <PengaduanGuide />
        </div>

        {/* Widget Cek Status - Mobile: 4, Desktop: Right Col 3 */}
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-3 order-4 lg:order-none">
          <PengaduanStatusChecker />
        </div>
      </div>
    </div>
  );
}
