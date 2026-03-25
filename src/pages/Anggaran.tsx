import { useState } from 'react';
import { BarChart2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import RubrikHeader from '../components/workspace/RubrikHeader';
import ArticleCard from '../components/workspace/ArticleCard';

export default function Anggaran() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'APBN', 'APBD', 'Proyek Strategis', 'Dana Desa', 'Subsidi'];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <RubrikHeader 
        title="Anggaran"
        description="Melacak aliran uang negara — dari APBN, APBD, hingga proyek pemerintah"
        accentColor="#1B5E20"
        icon={<BarChart2 className="w-8 h-8 md:w-10 md:h-10" />}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="bg-[#F1F8E9] border border-[#A5D6A7] rounded-xl p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#A5D6A7]">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-[#1B5E20] mb-1 uppercase tracking-wider">💰 APBN 2025</span>
            <span className="text-3xl font-heading font-extrabold text-[#1B5E20]">Rp3.621 T</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center pt-4 sm:pt-0">
            <span className="text-sm font-bold text-[#1B5E20] mb-1 uppercase tracking-wider">📉 Realisasi</span>
            <span className="text-3xl font-heading font-extrabold text-[#1B5E20]">Rp1.204 T <span className="text-lg font-medium">(33%)</span></span>
          </div>
          <div className="flex flex-col items-center justify-center text-center pt-4 sm:pt-0">
            <span className="text-sm font-bold text-[#1B5E20] mb-1 uppercase tracking-wider">📊 Defisit</span>
            <span className="text-3xl font-heading font-extrabold text-[#1B5E20]">-2.8% <span className="text-lg font-medium">GDP</span></span>
          </div>
        </div>
        <div className="text-center mt-4 text-xs text-[#1B5E20]/70 font-medium">
          Data per April 2025 · Sumber: Kemenkeu
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <ArticleCard 
            rubrik="anggaran"
            title="Rp180 Triliun Dana IKN: Audit Menemukan Selisih Rp12 Triliun"
            snippet="Badan Pemeriksa Keuangan (BPK) merilis laporan audit semester I yang mengidentifikasi sejumlah temuan terkait pengadaan barang dan jasa di proyek Ibu Kota Nusantara."
            tags={['#IKN', '#BPK', '#Audit']}
            author="Tim Anggaran"
            time="2 jam lalu"
            imageUrl="https://picsum.photos/seed/anggaran1/800/600"
            isFeatured={true}
            id="anggaran-1"
            inlineChart={
              <div className="flex items-end gap-2 h-16 mt-4 opacity-80">
                <div className="w-8 bg-[#1B5E20]/30 h-1/3 rounded-t"></div>
                <div className="w-8 bg-[#1B5E20]/50 h-2/3 rounded-t"></div>
                <div className="w-8 bg-[#1B5E20] h-full rounded-t"></div>
                <div className="w-8 bg-warning h-1/4 rounded-t"></div>
              </div>
            }
          />

          <div className="space-y-6">
            <ArticleCard 
              rubrik="anggaran"
              title="Dana Desa 2025 Naik 8%, Tapi Serapan di Papua Masih di Bawah 40%"
              snippet="Kementerian Desa mencatat rendahnya serapan dana desa di wilayah 3T, memicu kekhawatiran program pembangunan infrastruktur dasar mangkrak."
              tags={['#DanaDesa', '#Papua']}
              author="Santi W."
              time="4 jam lalu"
              readTime="9 mnt baca"
              imageUrl="https://picsum.photos/seed/anggaran2/800/600"
              id="anggaran-2"
              inlineChart={
                <div className="w-full h-2 bg-blue-gray/20 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[#1B5E20] w-[38%]"></div>
                </div>
              }
            />

            <ArticleCard 
              rubrik="anggaran"
              title="Subsidi BBM 2025 Bengkak Rp47 Triliun, DPR Minta Audit Menyeluruh"
              snippet="Pembengkakan anggaran subsidi BBM dipicu oleh kenaikan konsumsi Pertalite dan fluktuasi harga minyak mentah dunia."
              tags={['#Subsidi', '#BBM', '#APBN']}
              author="Dian M."
              time="7 jam lalu"
              readTime="6 mnt baca"
              imageUrl="https://picsum.photos/seed/anggaran3/800/600"
              id="anggaran-3"
            />

            <ArticleCard 
              rubrik="anggaran"
              title="Proyek Kereta Cepat: Biaya Membengkak 2x Lipat, Siapa yang Bertanggung Jawab?"
              snippet="Investigasi kami menemukan cost overrun proyek KCJB mencapai Rp114 triliun, memaksa pemerintah menggunakan APBN sebagai penjaminan."
              tags={['#KeretaCepat', '#Infrastruktur']}
              author="Reza F."
              time="1 hari lalu"
              readTime="12 mnt baca"
              imageUrl="https://picsum.photos/seed/anggaran4/800/600"
              id="anggaran-4"
            />
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Proyek Terpantau</h3>
            <div className="space-y-5">
              {[
                { name: 'Tol Trans Sumatra', progress: 75, budget: 'Rp120 T' },
                { name: 'Bendungan Bener', progress: 42, budget: 'Rp2.06 T' },
                { name: 'LRT Jabodebek Fase 2', progress: 15, budget: 'Rp32 T' },
                { name: 'Food Estate Kalteng', progress: 60, budget: 'Rp1.5 T' }
              ].map((project, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold text-dark mb-1">
                    <span>{project.name}</span>
                    <span className="text-[#1B5E20]">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-gray/20 rounded-full mb-1">
                    <div className="h-full bg-[#1B5E20] rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <div className="text-xs text-text-light text-right">Anggaran: {project.budget}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Dokumen Anggaran</h3>
            <div className="space-y-3">
              {[
                'APBN 2025 (UU No. 19/2024)',
                'Laporan Keuangan Pemerintah Pusat 2024',
                'Ikhtisar Hasil Pemeriksaan BPK Sem. II',
                'Buku Nota Keuangan 2025'
              ].map((doc, i) => (
                <Link key={i} to={`/workspace/article/anggaran-doc-${i}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-off-white border border-transparent hover:border-blue-gray/20 transition-colors group">
                  <FileText className="w-5 h-5 text-blue-gray group-hover:text-[#1B5E20] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-dark group-hover:text-[#1B5E20] line-clamp-2">{doc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
