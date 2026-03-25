import { useState } from 'react';
import { Users, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RubrikHeader from '../components/workspace/RubrikHeader';
import ArticleCard from '../components/workspace/ArticleCard';

export default function Keadilan() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Ketimpangan', 'HAM', 'Lingkungan', 'Perempuan & Anak', 'Masyarakat Adat'];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <RubrikHeader 
        title="Keadilan"
        description="Menilai dampak nyata hukum dan kebijakan terhadap kehidupan masyarakat"
        accentColor="#4A148C"
        icon={<Users className="w-8 h-8 md:w-10 md:h-10" />}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="bg-[#F3E5F5] border border-[#CE93D8] rounded-xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="text-sm font-bold text-[#4A148C] uppercase tracking-wider">SOROTAN MINGGU INI</h3>
          </div>
          <p className="italic text-[#4A148C] text-lg font-medium leading-relaxed">
            "3 dari 5 kasus sengketa tanah masyarakat adat berakhir tanpa putusan lebih dari 2 tahun" — Laporan Komnas HAM 2025
          </p>
        </div>
        <a href="#" className="shrink-0 px-6 py-2.5 rounded-lg bg-[#4A148C] hover:bg-[#380b6b] transition-colors font-bold text-white text-sm">
          Baca Laporan &rarr;
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <ArticleCard 
            rubrik="keadilan"
            title="Warga Desa Wadas: Dua Tahun Berjuang, Tambang Andesit Tetap Beroperasi"
            snippet="Meski Pengadilan Tata Usaha Negara memenangkan gugatan warga pada 2023, aktivitas pertambangan terus berjalan dengan dasar izin baru yang diterbitkan sepihak."
            tags={['#Wadas', '#SengketaTanah', '#HAM']}
            author="Tim Investigasi"
            time="5 jam lalu"
            imageUrl="https://picsum.photos/seed/keadilan1/800/600"
            isFeatured={true}
            id="keadilan-1"
            impactStats={
              <div className="mt-6 bg-[#F3E5F5] rounded-lg p-4">
                <h4 className="text-xs font-bold text-[#4A148C] uppercase tracking-wider mb-3">Dampak Kasus</h4>
                <div className="grid grid-cols-3 gap-4 divide-x divide-[#CE93D8]">
                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <span className="text-xl mb-1">👥</span>
                    <span className="font-bold text-[#4A148C] text-sm">412 warga</span>
                    <span className="text-[10px] text-[#4A148C]/70 uppercase tracking-wider">Terdampak</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <span className="text-xl mb-1">🌱</span>
                    <span className="font-bold text-[#4A148C] text-sm">120 Ha</span>
                    <span className="text-[10px] text-[#4A148C]/70 uppercase tracking-wider">Lahan Terancam</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <span className="text-xl mb-1">⚖️</span>
                    <span className="font-bold text-[#4A148C] text-sm">Sengketa Aktif</span>
                    <span className="text-[10px] text-[#4A148C]/70 uppercase tracking-wider">Status Hukum</span>
                  </div>
                </div>
              </div>
            }
          />

          <div className="space-y-6">
            <ArticleCard 
              rubrik="keadilan"
              title="Buruh Kontrak di Kawasan Industri Batam: Upah di Bawah UMR, Tak Ada BPJS"
              snippet="Investigasi kami selama 3 bulan menemukan 40% pekerja di 12 pabrik elektronik bekerja tanpa kontrak tertulis dan jaminan kesehatan."
              tags={['#Buruh', '#UpahMinimum', '#Batam']}
              author="Sri W."
              time="6 jam lalu"
              readTime="11 mnt baca"
              imageUrl="https://picsum.photos/seed/keadilan2/800/600"
              id="keadilan-2"
              impactStats={
                <div className="mt-4 bg-[#F3E5F5] rounded-md p-2.5 inline-flex items-center gap-2">
                  <span className="text-sm">👥</span>
                  <span className="font-bold text-[#4A148C] text-xs">~3.200 pekerja terdampak</span>
                </div>
              }
            />

            <ArticleCard 
              rubrik="keadilan"
              title="Perempuan Korban KDRT: Rumah Aman Penuh, Layanan Trauma Healing Tak Ada Anggaran"
              snippet="Komnas Perempuan mencatat lonjakan laporan kekerasan dalam rumah tangga 34% tahun ini, namun fasilitas pendukung dari negara justru dipangkas."
              tags={['#KDRT', '#Perempuan', '#KomnasPerempuan']}
              author="Lili M."
              time="9 jam lalu"
              readTime="8 mnt baca"
              imageUrl="https://picsum.photos/seed/keadilan3/800/600"
              id="keadilan-3"
            />

            <ArticleCard 
              rubrik="keadilan"
              title="Suku Anak Dalam vs. Konsesi Sawit: 15 Tahun Tanpa Pengakuan Hak Atas Tanah"
              snippet="Dokumen BPN yang kami peroleh menunjukkan tidak ada satu pun proses free, prior, and informed consent (FPIC) dalam pemberian HGU kepada perusahaan."
              tags={['#MasyarakatAdat', '#Sawit', '#HAM']}
              author="Dimas A."
              time="1 hari lalu"
              readTime="14 mnt baca"
              imageUrl="https://picsum.photos/seed/keadilan4/800/600"
              id="keadilan-4"
            />
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Kasus yang Dipantau Publik</h3>
            <div className="space-y-4">
              {[
                { case: 'Penggusuran Paksa Rempang', status: 'Aktif', color: 'bg-danger' },
                { case: 'Pencemaran Sungai Citarum', status: 'Banding', color: 'bg-warning' },
                { case: 'Kekerasan Aparat di Papua', status: 'Aktif', color: 'bg-danger' },
                { case: 'Sengketa Lahan Kendeng', status: 'Selesai', color: 'bg-success' }
              ].map((item, i) => (
                <Link key={i} to={`/workspace/article/keadilan-kasus-${i}`} className="flex items-center justify-between group cursor-pointer border-b border-blue-gray/10 pb-3 last:border-0 last:pb-0">
                  <h4 className="font-bold text-sm text-dark group-hover:text-[#4A148C] transition-colors line-clamp-2 pr-4">{item.case}</h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="text-[10px] font-bold text-text-medium uppercase tracking-wider">{item.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Laporan & Data HAM</h3>
            <div className="space-y-3">
              {[
                'Laporan Tahunan Komnas HAM 2024',
                'Indeks Demokrasi Indonesia (BPS)',
                'Catatan Akhir Tahun YLBHI',
                'Data Kekerasan Terhadap Perempuan'
              ].map((doc, i) => (
                <Link key={i} to={`/workspace/article/keadilan-doc-${i}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-off-white border border-transparent hover:border-blue-gray/20 transition-colors group">
                  <BarChart2 className="w-5 h-5 text-blue-gray group-hover:text-[#4A148C] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-dark group-hover:text-[#4A148C] line-clamp-2">{doc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
