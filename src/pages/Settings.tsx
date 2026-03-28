import { useState } from 'react';
import { User, CreditCard, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import FullScreenLoader from '../components/FullScreenLoader';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isPremium] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {isLoggingOut && <FullScreenLoader message="Sedang keluar dari sesi..." />}
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-extrabold text-dark mb-2">Pengaturan Akun</h1>
          <p className="text-text-medium">Kelola profil, preferensi, dan langganan Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar Settings */}
          <div className="md:col-span-3 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-text-medium hover:bg-blue-gray/20'}`}
            >
              <User className="w-5 h-5" /> Profil
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'subscription' ? 'bg-primary text-white' : 'text-text-medium hover:bg-blue-gray/20'}`}
            >
              <CreditCard className="w-5 h-5" /> Langganan
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'notifications' ? 'bg-primary text-white' : 'text-text-medium hover:bg-blue-gray/20'}`}
            >
              <Bell className="w-5 h-5" /> Notifikasi
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'security' ? 'bg-primary text-white' : 'text-text-medium hover:bg-blue-gray/20'}`}
            >
              <Shield className="w-5 h-5" /> Keamanan
            </button>

            <div className="pt-8 mt-8 border-t border-blue-gray/30">
              <button
                onClick={async () => {
                  setIsLoggingOut(true);
                  // Delay for 5 seconds as requested by the user
                  await new Promise(resolve => setTimeout(resolve, 5000));
                  await signOut();
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-accent hover:bg-accent/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" /> Keluar
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-9">
            <div className="bg-white rounded-2xl border border-blue-gray/30 p-6 sm:p-8">

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-dark mb-6">Informasi Profil</h2>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-blue-gray/30 overflow-hidden shrink-0">
                      <img src="https://i.pravatar.cc/150?u=user" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <button className="px-4 py-2 border border-blue-gray/30 rounded-lg text-sm font-bold text-dark hover:bg-off-white transition-colors mb-2">
                        Ubah Foto
                      </button>
                      <p className="text-xs text-text-light">JPG, GIF atau PNG. Maksimal 2MB.</p>
                    </div>
                  </div>

                  <form className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-bold text-dark mb-2">Nama Lengkap</label>
                      <input type="text" defaultValue={user?.user_metadata?.registered_name || user?.user_metadata?.full_name || ''} className="w-full px-4 py-2 bg-off-white border border-blue-gray/30 rounded-lg focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-dark mb-2">Email / Nomor HP</label>
                      <input type="text" defaultValue={user?.email || user?.phone || ''} disabled className="w-full px-4 py-2 bg-blue-gray/10 border border-blue-gray/30 rounded-lg text-text-medium cursor-not-allowed" />
                      <p className="text-xs text-text-light mt-1">Email / Nomor HP tidak dapat diubah.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-dark mb-2">Pekerjaan / Instansi</label>
                      <input type="text" defaultValue={user?.user_metadata?.occupation || ''} placeholder="Contoh: Peneliti Hukum" className="w-full px-4 py-2 bg-off-white border border-blue-gray/30 rounded-lg focus:border-primary outline-none" />
                    </div>
                    <button type="button" className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors">
                      Simpan Perubahan
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-dark mb-6">Paket Langganan</h2>

                  <div className={`border-2 rounded-xl p-6 mb-8 ${isPremium ? 'border-primary bg-primary/5' : 'border-blue-gray/30 bg-off-white'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-dark">{isPremium ? 'Juncto Premium' : 'Juncto Free'}</h3>
                        <p className="text-sm text-text-medium">{isPremium ? 'Aktif hingga 24 April 2026' : 'Akses terbatas ke artikel reguler'}</p>
                      </div>
                      {isPremium && (
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Aktif
                        </span>
                      )}
                    </div>

                    {!isPremium && (
                      <div className="mt-6">
                        <button className="w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                          Upgrade ke Premium — Rp150.000/bln
                        </button>
                        <ul className="mt-4 space-y-2 text-sm text-text-medium">
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Akses penuh laporan investigasi</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> AI Legal Assistant (Unlimited)</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Download template dokumen hukum</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {isPremium && (
                    <div>
                      <h3 className="font-bold text-dark mb-4">Metode Pembayaran</h3>
                      <div className="flex items-center justify-between border border-blue-gray/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-blue-gray/20 rounded flex items-center justify-center font-bold text-xs">VISA</div>
                          <div>
                            <p className="font-bold text-sm text-dark">•••• •••• •••• 4242</p>
                            <p className="text-xs text-text-medium">Kedaluwarsa 12/28</p>
                          </div>
                        </div>
                        <button className="text-sm font-bold text-primary hover:text-secondary">Ubah</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-dark mb-6">Preferensi Notifikasi</h2>
                  <div className="space-y-6">
                    {[
                      { title: 'Investigasi Terbaru', desc: 'Pemberitahuan saat laporan investigasi baru diterbitkan.' },
                      { title: 'Juncto Briefing', desc: 'Newsletter harian berisi ringkasan berita dan analisis hukum.' },
                      { title: 'Pembaruan Fitur', desc: 'Info tentang fitur baru di platform Juncto.Media.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-dark text-sm">{item.title}</h4>
                          <p className="text-xs text-text-medium">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                          <div className="w-11 h-6 bg-blue-gray/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-dark mb-6">Keamanan Akun</h2>
                  <form className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-bold text-dark mb-2">Password Saat Ini</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-off-white border border-blue-gray/30 rounded-lg focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-dark mb-2">Password Baru</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-off-white border border-blue-gray/30 rounded-lg focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-dark mb-2">Konfirmasi Password Baru</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-off-white border border-blue-gray/30 rounded-lg focus:border-primary outline-none" />
                    </div>
                    <button type="button" className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors">
                      Perbarui Password
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
