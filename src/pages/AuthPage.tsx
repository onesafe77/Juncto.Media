import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import FullScreenLoader from '../components/FullScreenLoader';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Mempersiapkan Workspace Anda...');
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();

  // If user lands here already logged in, redirect immediately.
  // We use useEffect instead of direct conditional return so we can manage the post-login state manually without early unmounting.
  useEffect(() => {
    // 0. Parse potential OAuth database rejection errors from the URL Hash
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const urlParams = new URLSearchParams(window.location.search);
    const authError = hashParams.get('error_description') || urlParams.get('error_description');

    if (authError && authError.includes('Database error saving new user')) {
      setError('AKSES DITOLAK: Pendaftaran langsung dari Google ditutup. Silakan lengkapi Formulir Pendaftaran manual (tab Daftar) terlebih dahulu.');
      setIsLogin(false); // Move them to the register tab
      // Clean up the URL so it doesn't persist on reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 1. Recover any pending error saved before a forced logout
    const pendingError = localStorage.getItem('auth_reject_error');
    if (pendingError) {
      setError(pendingError);
      setIsLogin(false);
      localStorage.removeItem('auth_reject_error');
    }

    if (user && !loading) {
      // Check if they bypassed the manual register form by looking for 'occupation' metadata
      if (!user.user_metadata?.occupation) {
        // Strict Rule: Block them completely and log them out
        localStorage.setItem('auth_reject_error', 'AKSES DITOLAK: Anda belum terdaftar secara resmi. Silakan isi Formulir Pendaftaran di bawah ini terlebih dahulu sebelum menggunakan Google.');
        supabase.auth.signOut().catch(console.error);
      } else {
        navigate('/workspace', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage('Menyelesaikan Pendaftaran Anda...');

    // Update the user's metadata with the required field
    const { error } = await supabase.auth.updateUser({
      data: { occupation: occupation }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Success! They completed the mandatory fields.
      // Wait a short delay then navigate
      await new Promise(resolve => setTimeout(resolve, 3000));
      navigate('/workspace', { replace: true });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setLoadingMessage(isLogin ? 'Memverifikasi kredensial Anda...' : 'Membuat akun Anda...');

    if (!isLogin && password !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      setLoading(false);
      return;
    }

    if (!isLogin && password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(identifier, password);
        if (error) {
          setError(error.message === 'Invalid login credentials'
            ? 'Email/Nomor HP atau kata sandi salah. Jika belum memiliki akun, silakan klik tab "Daftar".'
            : error.message);
          setLoading(false);
        } else {
          setLoadingMessage('Akses diberikan. Mengarahkan ke Workspace...');
          // Delay for 5 seconds as requested by the user
          await new Promise(resolve => setTimeout(resolve, 5000));
          navigate('/workspace', { replace: true });
        }
      } else {
        const { error } = await signUp(identifier, password, fullName, occupation);
        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already exists')) {
            setError('Email/Nomor ini sudah terlanjur terdaftar (mungkin karena Anda sempat mengklik Google sebelumnya). Silakan tekan tombol Lanjutkan dengan Google di tab Masuk.');
          } else {
            setError(error.message);
          }
          setLoading(false);
        } else {
          // Prevent auto-login by immediately destroying the session it might have created
          await supabase.auth.signOut().catch(() => { });

          setSuccess('Pendaftaran Berhasil! Akun Anda sudah terbuat. Silakan masuk (Login) menggunakan Kata Sandi Anda, atau klik "Lanjutkan dengan Google".');
          setIsLogin(true); // Switch to Login tab
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    setLoadingMessage('Menghubungkan dengan Google...');
    try {
      // Small delay so the user sees the loader before Google OAuth redirects them
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader message={loadingMessage} />}
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
                <span>Dukung jurnalisme independen &amp; transparan</span>
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
                onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              >
                Masuk
              </button>
              <button
                className={`flex-1 pb-4 text-center font-heading font-bold text-lg transition-colors ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text-medium'}`}
                onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
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
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-dark mb-1.5">Nama Lengkap</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded border border-blue-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Masukkan nama lengkap"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-dark mb-1.5">Pekerjaan / Instansi</label>
                    <div className="relative">
                      <select
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full px-4 py-3 appearance-none bg-white rounded border border-blue-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-dark"
                        required={!isLogin}
                      >
                        <option value="" disabled>Pilih Pekerjaan Anda</option>
                        <option value="Pengacara / Firma Hukum">Pengacara / Firma Hukum</option>
                        <option value="Jurnalis / Media">Jurnalis / Media</option>
                        <option value="PNS / Aparatur Negara">PNS / Aparatur Negara</option>
                        <option value="Mahasiswa / Pelajar">Mahasiswa / Pelajar</option>
                        <option value="Peneliti / Akademisi">Peneliti / Akademisi</option>
                        <option value="Aktivis / NGO">Aktivis / NGO</option>
                        <option value="Karyawan Swasta">Karyawan Swasta</option>
                        <option value="Wiraswasta / Pemilik Usaha">Wiraswasta / Pemilik Usaha</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-gray">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-bold text-dark mb-1.5">Email / Nomor HP</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-blue-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="nama@email.com atau 081234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-dark mb-1.5">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-dark mb-1.5">Konfirmasi Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded border border-blue-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
                      placeholder="••••••••"
                      required={!isLogin}
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
                    Saya setuju dengan <a href="#" className="font-bold text-primary hover:underline">Syarat &amp; Ketentuan</a> serta <a href="#" className="font-bold text-primary hover:underline">Kebijakan Privasi</a> Juncto.Media
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded bg-primary hover:bg-secondary transition-colors font-bold text-white text-lg shadow-lg shadow-primary/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLogin ? 'Masuk' : 'Buat Akun'} &rarr;
              </button>
            </form>

            {/* Google Button */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-gray/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-text-light font-medium">ATAU</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 border border-blue-gray/30 rounded-lg text-dark font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Lanjutkan dengan Google
              </button>
            </div>

            <p className="mt-8 text-center text-text-medium">
              {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              <button
                className="font-bold text-primary hover:text-secondary transition-colors"
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
