import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Lock, Bell, X } from 'lucide-react';
import Logo from '../Logo';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Kebijakan', path: '/kebijakan' },
    { name: 'Anggaran', path: '/anggaran' },
    { name: 'Hukum', path: '/hukum' },
    { name: 'Keadilan', path: '/keadilan' },
    { name: 'Investigasi', path: '/investigasi', locked: true },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#003087] text-white h-[56px] lg:h-[64px]">
        <div className="flex justify-between items-center h-full px-4 lg:px-12">
          {/* KIRI: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            <span className="font-heading font-extrabold text-[14px] lg:text-[18px] tracking-tight">Juncto.Media</span>
          </Link>
          
          {/* TENGAH: Menu Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className={`text-[14px] flex items-center gap-1 transition-colors ${isActive ? 'text-white font-bold' : 'text-white/75 hover:text-white font-medium'}`}
                >
                  {item.name}
                  {item.locked && <Lock className="w-3 h-3 text-white/50" />}
                </Link>
              );
            })}
          </div>

          {/* KANAN: Desktop Buttons / Mobile Icons */}
          <div className="flex items-center gap-3 lg:gap-3">
            {/* Mobile Icons */}
            <button className="lg:hidden text-white hover:text-white/80 p-1 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E31B23] border border-[#003087]"></span>
            </button>
            <button className="lg:hidden text-white hover:text-white/80 p-1" onClick={() => setDrawerOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/auth" className="text-[14px] font-bold px-[18px] py-[8px] rounded border border-white text-white hover:bg-white/10 transition-colors">
                Masuk
              </Link>
              <Link to="/auth" className="text-[14px] font-bold px-[18px] py-[8px] rounded bg-[#E31B23] text-white hover:bg-[#C8151D] transition-colors">
                Mulai Gratis &rarr;
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden flex">
          {/* Drawer Content */}
          <div className="w-[80%] max-w-[300px] h-full bg-[#003087] text-white flex flex-col animate-in slide-in-from-left duration-300">
            <div className="h-[56px] flex items-center justify-between px-4 shrink-0 border-b border-white/10">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
                <Logo className="w-6 h-6 text-white" />
                <span className="font-heading font-extrabold text-[14px] tracking-tight">Juncto.Media</span>
              </Link>
              <button className="text-white/70 hover:text-white p-2" onClick={() => setDrawerOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-lg mb-1 transition-colors ${
                      isActive ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'
                    }`}
                  >
                    <span className="text-sm">{item.name}</span>
                    {item.locked && <Lock className="w-4 h-4 text-white/50" />}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 shrink-0 flex flex-col gap-3 border-t border-white/10">
              <Link to="/auth" onClick={() => setDrawerOpen(false)} className="flex items-center justify-center w-full py-2.5 rounded border border-white text-white font-bold text-sm">
                Masuk
              </Link>
              <Link to="/auth" onClick={() => setDrawerOpen(false)} className="flex items-center justify-center w-full py-2.5 rounded bg-[#E31B23] text-white font-bold text-sm">
                Daftar Gratis
              </Link>
            </div>
          </div>

          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setDrawerOpen(false)}
          ></div>
        </div>
      )}
    </>
  );
}
