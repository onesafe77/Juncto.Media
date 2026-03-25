import { useState } from 'react';
import { Scale, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import RubrikHeader from '../components/workspace/RubrikHeader';
import ArticleCard from '../components/workspace/ArticleCard';

export default function Hukum() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Korupsi', 'Pidana Umum', 'Perdata', 'Mahkamah Agung', 'MK', 'KPK'];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <RubrikHeader 
        title="Hukum"
        description="Mengawasi proses peradilan, aparat penegak hukum, dan akses keadilan"
        accentColor="#B71C1C"
        icon={<Scale className="w-8 h-8 md:w-10 md:h-10" />}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl p-4 sm:p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#B71C1C] animate-pulse"></span>
          <h3 className="text-sm font-bold text-[#B71C1C] uppercase tracking-wider">KASUS TERPANTAU:</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'Sidang Harvey Moeis', status: 'Persidangan hari ini' },
            { name: 'Kasus Rafael Alun', status: 'Banding MA' },
            { name: 'Perkara BPJS', status: 'Putusan tunda' }
          ].map((kasus, i) => (
            <button key={i} className="flex flex-col items-start bg-white border border-[#EF9A9A] hover:border-[#B71C1C] rounded-lg px-4 py-2 transition-colors text-left group">
              <span className="font-bold text-dark group-hover:text-[#B71C1C] text-sm">{kasus.name}</span>
              <span className="text-xs text-[#B71C1C] font-medium">{kasus.status}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <ArticleCard 
            rubrik="hukum"
            title="Hakim Tolak Pledoi Harvey Moeis: Vonis 20 Tahun dan Uang Pengganti Rp210 Miliar"
            snippet="Pengadilan Tipikor Jakarta memvonis Harvey Moeis bersalah atas tindak pidana korupsi timah. Majelis hakim menilai pembelaan terdakwa tidak berdasar hukum."
            tags={['#HarveyMoeis', '#Tipikor']}
            author="Tim Hukum"
            time="1 jam lalu"
            imageUrl="https://picsum.photos/seed/hukum1/800/600"
            isFeatured={true}
            id="hukum-1"
            timeline={
              <div className="mt-6 border border-[#EF9A9A] bg-[#FFEBEE]/50 rounded-lg p-4">
                <h4 className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider mb-3">Timeline Kasus</h4>
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-medium text-dark relative">
                  <div className="absolute top-1.5 left-0 w-full h-0.5 bg-[#EF9A9A] -z-10"></div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#B71C1C] border-2 border-white"></div>
                    <span className="font-bold text-center mt-1">Sidang I</span>
                    <span className="text-[#B71C1C]">Des 2023</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#B71C1C] border-2 border-white"></div>
                    <span className="font-bold text-center mt-1">Tuntutan</span>
                    <span className="text-[#B71C1C]">Okt 2024</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#B71C1C] border-2 border-white"></div>
                    <span className="font-bold text-center mt-1">Pledoi</span>
                    <span className="text-[#B71C1C]">Nov 2024</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#B71C1C] border-2 border-white shadow-[0_0_0_2px_rgba(183,28,28,0.3)]"></div>
                    <span className="font-bold text-center mt-1">Vonis</span>
                    <span className="text-[#B71C1C]">Jan 2025</span>
                  </div>
                </div>
              </div>
            }
          />

          <div className="space-y-6">
            <ArticleCard 
              rubrik="hukum"
              title="MK Tolak Gugatan Sengketa Pilkada Sumatra Utara: Ini Pertimbangannya"
              snippet="Mahkamah Konstitusi dalam sidang pleno memutuskan gugatan tidak dapat diterima karena pemohon tidak memiliki kedudukan hukum (legal standing)."
              tags={['#MK', '#Pilkada', '#Sengketa']}
              author="Heri K."
              time="2 jam lalu"
              readTime="8 mnt baca"
              imageUrl="https://picsum.photos/seed/hukum2/800/600"
              id="hukum-2"
            />

            <ArticleCard 
              rubrik="hukum"
              title="KPK OTT Kepala Dinas Pekerjaan Umum Kabupaten Bogor"
              snippet="Operasi tangkap tangan dilakukan Rabu malam, mengamankan 6 orang dan barang bukti uang tunai senilai Rp2,5 miliar terkait proyek jalan."
              tags={['#KPK', '#OTT', '#Korupsi']}
              author="Devi R."
              time="30 menit lalu"
              readTime="4 mnt baca"
              imageUrl="https://picsum.photos/seed/hukum3/800/600"
              breaking={true}
              id="hukum-3"
            />

            <ArticleCard 
              rubrik="hukum"
              title="Advokat Publik: Akses Bantuan Hukum bagi Masyarakat Miskin Masih Terhalang Birokrasi"
              snippet="Survei terbaru YLBHI menunjukkan 68% masyarakat berpenghasilan rendah tidak mengetahui hak mereka atas bantuan hukum gratis dari negara."
              tags={['#BantuanHukum', '#YLBHI']}
              author="Nita S."
              time="5 jam lalu"
              readTime="7 mnt baca"
              imageUrl="https://picsum.photos/seed/hukum4/800/600"
              id="hukum-4"
            />
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Jadwal Sidang Hari Ini</h3>
            <div className="space-y-4">
              {[
                { case: 'Korupsi BTS 4G', time: '09:00 WIB', court: 'PN Tipikor Jakarta Pusat' },
                { case: 'Sengketa Lahan Wadas', time: '10:30 WIB', court: 'PTUN Semarang' },
                { case: 'Uji Materiil UU ITE', time: '13:00 WIB', court: 'Mahkamah Konstitusi' },
                { case: 'Praperadilan Tersangka KPK', time: '14:00 WIB', court: 'PN Jakarta Selatan' }
              ].map((item, i) => (
                <Link key={i} to={`/workspace/article/hukum-sidang-${i}`} className="flex gap-3 group cursor-pointer border-l-2 border-transparent hover:border-[#B71C1C] pl-2 transition-colors">
                  <div className="text-xs font-mono font-bold text-[#B71C1C] shrink-0 mt-0.5">{item.time}</div>
                  <div>
                    <h4 className="font-bold text-sm text-dark group-hover:text-[#B71C1C] transition-colors line-clamp-2 mb-1">{item.case}</h4>
                    <span className="text-[11px] text-text-light">{item.court}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Putusan Terbaru MA</h3>
            <div className="space-y-3">
              {[
                { no: '123 K/Pid.Sus/2025', desc: 'Kasasi Ditolak, Vonis 15 Tahun Tetap' },
                { no: '45 P/HUM/2025', desc: 'Uji Materiil Perda Retribusi Diterima' },
                { no: '89 PK/Pdt/2025', desc: 'Peninjauan Kembali Sengketa Merek' }
              ].map((doc, i) => (
                <Link key={i} to={`/workspace/article/hukum-doc-${i}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-off-white border border-transparent hover:border-blue-gray/20 transition-colors group">
                  <FileText className="w-5 h-5 text-blue-gray group-hover:text-[#B71C1C] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono font-bold text-[#B71C1C] mb-1">{doc.no}</div>
                    <span className="text-sm font-medium text-dark group-hover:text-[#B71C1C] line-clamp-2">{doc.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
