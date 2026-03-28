import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Home, FileText, BarChart2, Scale, Users,
  Search, Bell, Menu, X, Lock, FileCheck,
  Bookmark, Clock, Settings as SettingsIcon, CreditCard, Bot, User, Megaphone, IdCard
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../hooks/useNotifications';
import NotificationToast from '../components/common/NotificationToast';

export default function WorkspaceLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestNotif, setLatestNotif] = useState({ title: '', message: '', link: '' });
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount, notifications } = useNotifications();

  // Show toast for the most recent notification if it's new
  useEffect(() => {
    if (notifications.length > 0) {
      const mostRecent = notifications[0];
      const isVeryRecent = (new Date().getTime() - new Date(mostRecent.created_at).getTime()) < 10000;

      if (isVeryRecent && !mostRecent.is_read) {
        setLatestNotif({
          title: mostRecent.title,
          message: mostRecent.message,
          link: mostRecent.link || ''
        });
        setShowToast(true);
        const timer = setTimeout(() => setShowToast(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  const displayName = user?.user_metadata?.registered_name || user?.user_metadata?.full_name || 'Pengguna';

  const isPremium = false; // Mock state
  const isJournalist = true; // Mock state
  const membershipStatus: string = 'active'; // 'active' | 'pending' | 'expired' | 'revoked'

  const navItems = [
    { name: 'Beranda', path: '/workspace', icon: <Home className="w-5 h-5" /> },
    { type: 'divider', label: 'RUBRIK BERITA' },
    { name: 'Kebijakan', path: '/workspace/kebijakan', icon: <FileText className="w-5 h-5" /> },
    { name: 'Anggaran', path: '/workspace/anggaran', icon: <BarChart2 className="w-5 h-5" /> },
    { name: 'Hukum', path: '/workspace/hukum', icon: <Scale className="w-5 h-5" /> },
    { name: 'Keadilan', path: '/workspace/keadilan', icon: <Users className="w-5 h-5" /> },
    { type: 'divider', label: 'PREMIUM' },
    { name: 'Investigasi', path: '/workspace/investigasi', icon: <Search className="w-5 h-5" />, premium: true, badge: 'NEW' },
    { name: 'AI Legal Assistant', path: '/workspace/ai-legal', icon: <Bot className="w-5 h-5" />, premium: true },
    { name: 'Dokumen Hukum', path: '/workspace/dokumen', icon: <FileCheck className="w-5 h-5" />, premium: true },
    { type: 'divider', label: 'AKUN' },
    { name: 'Bookmark Saya', path: '/workspace/bookmarks', icon: <Bookmark className="w-5 h-5" /> },
    { name: 'Riwayat Baca', path: '/workspace/history', icon: <Clock className="w-5 h-5" /> },
    { name: 'Pengaturan', path: '/workspace/settings', icon: <SettingsIcon className="w-5 h-5" /> },
    { type: 'divider', label: 'LAPORKAN' },
    { name: 'Pengaduan Publik', path: '/workspace/pengaduan', icon: <Megaphone className="w-5 h-5" />, badge: 'HOT' },
    { type: 'divider', label: 'JURNALIS' },
    {
      name: 'Kartu Anggota',
      path: '/workspace/kartu-anggota',
      icon: <IdCard className="w-5 h-5" />,
      badge: isJournalist && membershipStatus === 'active' ? 'AKTIF' : (isJournalist && membershipStatus === 'expired' ? 'EXPIRED' : undefined),
      badgeColor: isJournalist && membershipStatus === 'active' ? '#10B981' : (isJournalist && membershipStatus === 'expired' ? '#F59E0B' : undefined)
    },
    { type: 'divider', label: 'ADMIN' },
    { name: 'Admin Panel', path: '/admin', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const bottomNavItems = [
    { name: 'Beranda', path: '/workspace', icon: <Home className="w-[22px] h-[22px]" /> },
    { name: 'Berita', path: '/workspace/kebijakan', icon: <FileText className="w-[22px] h-[22px]" /> },
    { name: 'Cari', path: '/workspace/search', icon: <Search className="w-[22px] h-[22px]" /> },
    { name: 'AI', path: '/workspace/ai-legal', icon: <Bot className="w-[22px] h-[22px]" /> },
    { name: 'Profil', path: '/workspace/settings', icon: <User className="w-[22px] h-[22px]" /> },
  ];

  return (
    <div className="flex h-screen bg-[#F4F6FA] font-sans text-slate-900 overflow-hidden lg:pl-[240px]">
      <NotificationToast
        show={showToast}
        title={latestNotif.title}
        message={latestNotif.message}
        link={latestNotif.link}
        onClose={() => setShowToast(false)}
      />
      {/* Mobile Sidebar Overlay (Drawer) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[80%] max-w-[300px] lg:w-[240px] bg-[#003087] text-white flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 lg:px-5 shrink-0">
          <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-white" />
            <span className="font-heading font-extrabold text-lg tracking-tight text-white">Juncto.Media</span>
          </Link>
          <button className="lg:hidden text-white/70 hover:text-white p-2" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 lg:px-5 py-4 shrink-0">
          <p className="text-sm text-white/70 mb-1">Halo,</p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg text-white truncate pr-2" title={displayName}>{displayName}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${isPremium ? 'bg-amber-400 text-slate-900' : 'bg-white/20 text-white'}`}>
              {isPremium ? 'Premium' : 'Free'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-3 custom-scrollbar">
          {navItems.map((item, idx) => {
            if (item.type === 'divider') {
              return (
                <div key={idx} className="px-3 mt-6 mb-2 text-xs font-bold text-white/50 uppercase tracking-wider">
                  {item.label}
                </div>
              );
            }

            const isActive = location.pathname === item.path;

            return (
              <Link
                key={idx}
                to={item.path || '#'}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-colors ${isActive ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={isActive ? 'text-white' : 'text-white/70'}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                      style={{ backgroundColor: item.badgeColor || '#E31B23' }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.premium && !isPremium && (
                    <Lock className="w-3 h-3 text-white/50" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {!isPremium && (
          <div className="p-4 shrink-0">
            <Link to="/workspace/settings" onClick={() => setSidebarOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 rounded bg-[#E31B23] hover:bg-[#C8151D] transition-colors font-bold text-white text-sm">
              <CreditCard className="w-4 h-4" />
              Upgrade Premium
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pb-[76px] lg:pb-0">
        {/* Topbar (Desktop & Mobile) */}
        <header className="h-14 lg:h-16 bg-[#003087] lg:bg-white border-b border-white/10 lg:border-[#E8EFF9] flex items-center justify-between px-4 lg:px-8 shrink-0 z-30 sticky top-0">

          {/* Mobile Left: Logo */}
          <div className="flex lg:hidden items-center gap-2">
            <Logo className="w-6 h-6 text-white" />
            <span className="font-heading font-extrabold text-[14px] tracking-tight text-white">Juncto.Media</span>
          </div>

          {/* Desktop Left: Empty (Sidebar is there) */}
          <div className="hidden lg:block w-0"></div>

          {/* Desktop Middle: Search */}
          <div className="hidden lg:flex items-center max-w-[480px] w-full relative flex-1 mx-8">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Cari berita, kasus, pasal..."
              className="w-full bg-[#F4F6FA] border border-transparent focus:border-slate-300 focus:bg-white rounded-full py-2 pl-10 pr-16 text-sm outline-none transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1">
              <kbd className="text-[10px] font-mono bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">Ctrl+K</kbd>
            </div>
          </div>

          {/* Right: Notifications & Avatar (Desktop) / Hamburger & Bell (Mobile) */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              to="/workspace/notifications"
              className="relative text-white lg:text-slate-500 hover:text-white/80 lg:hover:text-slate-900 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E31B23] border-2 border-[#003087] lg:border-white text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button className="lg:hidden text-white hover:text-white/80 p-1" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Avatar */}
            <div className="hidden lg:flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`} alt="User" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none max-w-[150px] truncate">{displayName.split(' ')[0]}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F4F6FA] flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-[#E8EFF9] z-40 pb-safe">
        {bottomNavItems.map((item, idx) => {
          const isActive = location.pathname === item.path || (item.path !== '/workspace' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={idx}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px]"
            >
              <div className={isActive ? 'text-[#003087]' : 'text-[#8899AA]'}>
                {item.icon}
              </div>
              <span className={`text-[10px] ${isActive ? 'text-[#003087] font-bold' : 'text-[#8899AA] font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
