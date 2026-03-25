import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import RubrikHeader from '../components/workspace/RubrikHeader';
import ArticleCard from '../components/workspace/ArticleCard';

export default function Kebijakan() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Regulasi', 'Peraturan Daerah', 'Kebijakan Fiskal', 'Reformasi Birokrasi'];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <RubrikHeader 
        title="Kebijakan"
        description="Analisis regulasi, kebijakan publik, dan keputusan administratif negara"
        accentColor="#003087"
        icon={<FileText className="w-8 h-8 md:w-10 md:h-10" />}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <ArticleCard 
            rubrik="kebijakan"
            title="Omnibus Law Cipta Kerja: Tiga Tahun Pasca Pengesahan, Apa yang Berubah?"
            snippet="Revisi UU Cipta Kerja yang disahkan pada 2020 dan diperbaiki lewat Perppu 2022 kini memasuki babak baru. Analisis kami menemukan beberapa pasal kontroversial masih dipertahankan."
            tags={['#OmnibusLaw', '#Ketenagakerjaan']}
            author="Rina Sari"
            time="3 jam lalu"
            imageUrl="https://picsum.photos/seed/kebijakan1/800/600"
            isFeatured={true}
            id="kebijakan-1"
          />

          <div className="space-y-6">
            <ArticleCard 
              rubrik="kebijakan"
              title="Kementerian Keuangan Rilis Aturan Baru Insentif Pajak Investasi"
              snippet="Beleid baru yang tertuang dalam PMK 45/2025 mengatur pemberian tax holiday untuk sektor energi terbarukan dan hilirisasi mineral."
              tags={['#PajakInvestasi', '#Kemenkeu']}
              author="Ahmad Dhani"
              time="5 jam lalu"
              readTime="7 mnt baca"
              imageUrl="https://picsum.photos/seed/kebijakan2/800/600"
              id="kebijakan-2"
            />

            <ArticleCard 
              rubrik="kebijakan"
              title="Revisi PP 109/2012 tentang Pengamanan Produk Tembakau Digugat Industri"
              snippet="Sejumlah asosiasi industri rokok mengajukan uji materiil ke Mahkamah Agung terkait aturan baru pembatasan iklan dan promosi."
              tags={['#Tembakau', '#Regulasi']}
              author="Maya Putri"
              time="8 jam lalu"
              readTime="5 mnt baca"
              imageUrl="https://picsum.photos/seed/kebijakan3/800/600"
              id="kebijakan-3"
            />

            <ArticleCard 
              rubrik="kebijakan"
              title="Roadmap Transisi Energi 2025–2030: Target Ambisius di Tengah Resistensi Daerah"
              snippet="Pemerintah pusat menargetkan 23% bauran energi terbarukan, namun realisasi di tingkat provinsi masih terhambat regulasi tumpang tindih."
              tags={['#EnergiTerbarukan', '#ESDM']}
              author="Budi Laksono"
              time="1 hari lalu"
              readTime="10 mnt baca"
              imageUrl="https://picsum.photos/seed/kebijakan4/800/600"
              id="kebijakan-4"
            />
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Kebijakan Terpopuler Minggu Ini</h3>
            <div className="space-y-4">
              {[
                { title: 'RUU Perampasan Aset Kembali Mandek di Baleg DPR', views: '12.4k' },
                { title: 'Aturan Baru Impor Barang Bawaan Penumpang Direvisi', views: '10.2k' },
                { title: 'Mendagri Terbitkan SE Netralitas ASN Jelang Pilkada', views: '8.9k' },
                { title: 'Kebijakan Harga Gas Bumi Tertentu (HGBT) Diperpanjang', views: '7.5k' },
                { title: 'Polemik Tapera: Pemerintah Janji Tunda Pemotongan Gaji', views: '6.8k' }
              ].map((item, i) => (
                <Link to={`/workspace/article/kebijakan-side-${i}`} key={i} className="flex gap-3 group cursor-pointer">
                  <span className="text-2xl font-heading font-bold text-blue-gray/30 group-hover:text-[#003087] transition-colors">{i + 1}</span>
                  <div>
                    <h4 className="font-bold text-sm text-dark group-hover:text-[#003087] transition-colors line-clamp-2 mb-1">{item.title}</h4>
                    <span className="text-xs text-text-light">{item.views} views</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-gray/30 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-dark border-b border-blue-gray/20 pb-2">Filter Kementerian</h3>
            <div className="flex flex-wrap gap-2">
              {['Kemenkeu', 'Kemenkes', 'BKPM', 'PUPR', 'Kemendagri', 'Kemenkumham', 'Kemendikbud', 'Kemenhub'].map(k => (
                <button key={k} className="px-3 py-1.5 bg-off-white hover:bg-blue-gray/10 border border-blue-gray/20 rounded-md text-sm font-medium text-text-medium transition-colors">
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
