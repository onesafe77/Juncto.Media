import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock auth
    navigate('/workspace');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-off-white font-sans text-text-dark">
      {/* Left Panel - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-dark text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/legal/1000/1000?blur=10')] opacity-10 mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <Logo className="w-12 h-12" />
            <span className="font-heading font-bold text-3xl tracking-tight">Juncto.Media</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-8 leading-tight">
            Bergabung bersama ribuan pembaca yang peduli keadilan
          </h1>

          <ul className="space-y-6 mb-16">
            <li className="flex items-center gap-4 text-lg">
              <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
              <span>Akses berita investigasi harian gratis</span>
            </li>
            <li className="flex items-center gap-4 text-lg">
              <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
              <span>Tanya jawab hukum dengan AI Legal Assistant</span>
            </li>
            <li className="flex items-center gap-4 text-lg">
              <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
              <span>Dukung jurnalisme independen & transparan</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
          <p className="italic text-blue-gray mb-4">
            "Juncto.Media adalah oase di tengah jurnalisme clickbait. Investigasinya mendalam, datanya valid, dan AI Legal-nya sangat membantu memahami konteks hukum."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-gray/30 overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=1" alt="User" />
            </div>
            <div>
              <p className="font-bold text-sm">Budi Santoso</p>
              <p className="text-xs text-blue-gray">Aktivis Anti-Korupsi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white relative">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-text-medium hover:text-primary transition-colors font-medium mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex mb-8 border-b border-blue-gray/30">
            <button
              className={`flex-1 pb-4 text-center font-heading font-bold text-lg transition-colors ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text-medium'}`}
              onClick={() => setIsLogin(true)}
            >
              Masuk
            </button>
            <button
              className={`flex-1 pb-4 text-center font-heading font-bold text-lg transition-colors ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text-medium'}`}
              onClick={() => setIsLogin(false)}
            >
              Daftar
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-dark mb-2">
              {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Gratis'}
            </h2>
            <p className="text-text-medium">
              {isLogin ? 'Masuk ke akun Juncto.Media Anda' : 'Mulai baca investigasi terbaik Indonesia'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-dark mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded border border-blue-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-dark mb-1.5">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded border border-blue-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded border border-blue-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-dark transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <div className="mt-2 h-1.5 w-full bg-blue-gray/30 rounded-full overflow-hidden flex">
                  <div className="h-full w-1/3 bg-accent"></div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-dark mb-1.5">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 rounded border border-blue-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            {isLogin ? (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-blue-gray/50 text-primary focus:ring-primary/20" />
                  <span className="text-sm font-medium text-text-medium">Ingat saya</span>
                </label>
                <a href="#" className="text-sm font-bold text-primary hover:text-secondary transition-colors">Lupa sandi?</a>
              </div>
            ) : (
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 mt-1 rounded border-blue-gray/50 text-primary focus:ring-primary/20" required />
                <span className="text-sm text-text-medium leading-relaxed">
                  Saya setuju dengan <a href="#" className="font-bold text-primary hover:underline">Syarat & Ketentuan</a> serta <a href="#" className="font-bold text-primary hover:underline">Kebijakan Privasi</a> Juncto.Media
                </span>
              </label>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded bg-primary hover:bg-secondary transition-colors font-bold text-white text-lg shadow-lg shadow-primary/20 mt-6"
            >
              {isLogin ? 'Masuk' : 'Buat Akun'} &rarr;
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-blue-gray/30"></div>
            <span className="text-sm font-medium text-text-light uppercase tracking-wider">atau {isLogin ? 'masuk' : 'daftar'} via</span>
            <div className="flex-1 h-px bg-blue-gray/30"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded border border-blue-gray/50 hover:bg-off-white transition-colors font-bold text-dark">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded border border-blue-gray/50 hover:bg-off-white transition-colors font-bold text-dark">
              LinkedIn
            </button>
          </div>

          <p className="mt-8 text-center text-text-medium">
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <button
              className="font-bold text-primary hover:text-secondary transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
