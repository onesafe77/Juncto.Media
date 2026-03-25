import { Clock } from 'lucide-react';
import ArticleCard from '../components/workspace/ArticleCard';

export default function History() {
  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">
            <Clock className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-dark relative inline-block">
            Riwayat Baca
            <div className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full bg-primary"></div>
          </h1>
        </div>
        <p className="text-text-medium text-lg mt-6">Daftar artikel yang baru saja Anda baca.</p>
      </div>

      <div className="space-y-10 max-w-4xl">
        <div>
          <h2 className="text-xl font-heading font-bold text-dark mb-4 border-b border-blue-gray/20 pb-2">Hari Ini</h2>
          <div className="space-y-6">
            <ArticleCard 
              rubrik="keadilan"
              title="Warga Desa Wadas: Dua Tahun Berjuang, Tambang Andesit Tetap Beroperasi"
              snippet="Meski Pengadilan Tata Usaha Negara memenangkan gugatan warga pada 2023, aktivitas pertambangan terus berjalan dengan dasar izin baru yang diterbitkan sepihak."
              tags={['#Wadas', '#SengketaTanah', '#HAM']}
              author="Tim Investigasi"
              time="Dibaca 2 jam lalu"
              imageUrl="https://picsum.photos/seed/keadilan1/800/600"
              id="keadilan-1"
            />
            
            <ArticleCard 
              rubrik="hukum"
              title="KPK OTT Kepala Dinas Pekerjaan Umum Kabupaten Bogor"
              snippet="Operasi tangkap tangan dilakukan Rabu malam, mengamankan 6 orang dan barang bukti uang tunai senilai Rp2,5 miliar terkait proyek jalan."
              tags={['#KPK', '#OTT', '#Korupsi']}
              author="Devi R."
              time="Dibaca 4 jam lalu"
              imageUrl="https://picsum.photos/seed/hukum3/800/600"
              id="hukum-3"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-heading font-bold text-dark mb-4 border-b border-blue-gray/20 pb-2">Kemarin</h2>
          <div className="space-y-6">
            <ArticleCard 
              rubrik="anggaran"
              title="Rp180 Triliun Dana IKN: Audit Menemukan Selisih Rp12 Triliun"
              snippet="Badan Pemeriksa Keuangan (BPK) merilis laporan audit semester I yang mengidentifikasi sejumlah temuan terkait pengadaan barang dan jasa di proyek Ibu Kota Nusantara."
              tags={['#IKN', '#BPK', '#Audit']}
              author="Tim Anggaran"
              time="Dibaca kemarin"
              imageUrl="https://picsum.photos/seed/anggaran1/800/600"
              id="anggaran-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
