import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ValidasiForm from '../components/workspace/ValidasiForm';
import { ArrowLeft } from 'lucide-react';

export default function ValidasiPublik() {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id');

  useEffect(() => {
    document.title = 'Validasi Kartu Jurnalis | Juncto.Media';
  }, []);

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-blue-gray/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-sm group-hover:bg-primary/90 transition-colors">
              JM
            </div>
            <span className="font-heading font-extrabold tracking-tight text-xl text-dark">
              Juncto.Media
            </span>
          </Link>
          
          <Link 
            to="/"
            className="flex items-center gap-2 text-sm font-bold text-text-medium hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-dark tracking-tight mb-4">
              Portal Validasi Jurnalis
            </h1>
            <p className="text-lg text-text-medium max-w-2xl mx-auto">
              Sistem verifikasi resmi untuk memastikan keaslian identitas dan status keanggotaan jurnalis Juncto.Media yang bertugas di lapangan.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-blue-gray/5 border border-blue-gray/10 p-6 md:p-8">
            <ValidasiForm initialId={idParam || ''} />
          </div>

          <div className="mt-12 text-center text-sm text-text-light">
            <p>
              Jika Anda menemukan penyalahgunaan kartu identitas Juncto.Media, 
              silakan laporkan ke <a href="mailto:redaksi@juncto.media" className="text-primary hover:underline font-medium">redaksi@juncto.media</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-blue-gray/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-text-medium">
          <p>&copy; {new Date().getFullYear()} Juncto.Media. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
