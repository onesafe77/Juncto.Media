import { Bookmark } from 'lucide-react';
import ArticleCard from '../components/workspace/ArticleCard';

export default function Bookmarks() {
  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">
            <Bookmark className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-dark relative inline-block">
            Bookmark Saya
            <div className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full bg-primary"></div>
          </h1>
        </div>
        <p className="text-text-medium text-lg mt-6">Kumpulan artikel dan investigasi yang Anda simpan untuk dibaca nanti.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        <ArticleCard 
          rubrik="kebijakan"
          title="Omnibus Law Cipta Kerja: Tiga Tahun Pasca Pengesahan, Apa yang Berubah?"
          snippet="Revisi UU Cipta Kerja yang disahkan pada 2020 dan diperbaiki lewat Perppu 2022 kini memasuki babak baru. Analisis kami menemukan beberapa pasal kontroversial masih dipertahankan."
          tags={['#OmnibusLaw', '#Ketenagakerjaan']}
          author="Rina Sari"
          time="Disimpan 2 hari lalu"
          imageUrl="https://picsum.photos/seed/kebijakan1/800/600"
          id="kebijakan-1"
        />

        <ArticleCard 
          rubrik="hukum"
          title="Hakim Tolak Pledoi Harvey Moeis: Vonis 20 Tahun dan Uang Pengganti Rp210 Miliar"
          snippet="Pengadilan Tipikor Jakarta memvonis Harvey Moeis bersalah atas tindak pidana korupsi timah. Majelis hakim menilai pembelaan terdakwa tidak berdasar hukum."
          tags={['#HarveyMoeis', '#Tipikor']}
          author="Tim Hukum"
          time="Disimpan 5 hari lalu"
          imageUrl="https://picsum.photos/seed/hukum1/800/600"
          id="hukum-1"
        />

        <ArticleCard 
          rubrik="anggaran"
          title="Proyek Kereta Cepat: Biaya Membengkak 2x Lipat, Siapa yang Bertanggung Jawab?"
          snippet="Investigasi kami menemukan cost overrun proyek KCJB mencapai Rp114 triliun, memaksa pemerintah menggunakan APBN sebagai penjaminan."
          tags={['#KeretaCepat', '#Infrastruktur']}
          author="Reza F."
          time="Disimpan 1 minggu lalu"
          imageUrl="https://picsum.photos/seed/anggaran4/800/600"
          id="anggaran-4"
        />
      </div>
    </div>
  );
}
