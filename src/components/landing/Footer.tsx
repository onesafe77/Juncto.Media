import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin, Mail, ChevronDown } from 'lucide-react';
import Logo from '../Logo';

export default function Footer() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <footer className="bg-[#003087] text-white pt-[32px] lg:pt-[60px] pb-[32px] lg:pb-[60px] px-[20px] lg:px-[80px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Logo & Tagline */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              <span className="font-heading font-extrabold text-xl lg:text-2xl tracking-tight">Juncto.Media</span>
            </div>
            <p className="text-white/70 text-[14px] leading-relaxed max-w-xs">
              Platform media investigasi berbasis AI yang mengawasi kebijakan negara, anggaran publik, penegakan hukum, dan keadilan masyarakat.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E31B23] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E31B23] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E31B23] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E31B23] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Rubrik Accordion/Column */}
          <div className="border-b border-white/10 lg:border-none pb-4 lg:pb-0">
            <button 
              className="flex justify-between items-center w-full lg:cursor-default lg:pointer-events-none"
              onClick={() => toggleAccordion('rubrik')}
            >
              <h4 className="font-heading font-bold text-[16px] lg:text-lg uppercase tracking-wider text-white/90">Rubrik</h4>
              <ChevronDown className={`w-5 h-5 lg:hidden transition-transform ${openAccordion === 'rubrik' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`mt-4 space-y-4 lg:block ${openAccordion === 'rubrik' ? 'block' : 'hidden'}`}>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Kebijakan</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Anggaran</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Hukum</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Keadilan</Link></li>
              <li><Link to="/workspace/investigasi" className="text-[14px] text-[#E31B23] font-bold hover:text-white transition-colors flex items-center gap-2">Investigasi Premium</Link></li>
            </ul>
          </div>

          {/* Platform Accordion/Column */}
          <div className="border-b border-white/10 lg:border-none pb-4 lg:pb-0">
            <button 
              className="flex justify-between items-center w-full lg:cursor-default lg:pointer-events-none"
              onClick={() => toggleAccordion('platform')}
            >
              <h4 className="font-heading font-bold text-[16px] lg:text-lg uppercase tracking-wider text-white/90">Platform</h4>
              <ChevronDown className={`w-5 h-5 lg:hidden transition-transform ${openAccordion === 'platform' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`mt-4 space-y-4 lg:block ${openAccordion === 'platform' ? 'block' : 'hidden'}`}>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Tim Redaksi</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Karir</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Kontak</Link></li>
              <li><Link to="/workspace/ai-legal" className="text-[14px] text-white/70 hover:text-white transition-colors">AI Legal Assistant</Link></li>
            </ul>
          </div>

          {/* Legal Accordion/Column */}
          <div className="border-b border-white/10 lg:border-none pb-4 lg:pb-0">
            <button 
              className="flex justify-between items-center w-full lg:cursor-default lg:pointer-events-none"
              onClick={() => toggleAccordion('legal')}
            >
              <h4 className="font-heading font-bold text-[16px] lg:text-lg uppercase tracking-wider text-white/90">Legal</h4>
              <ChevronDown className={`w-5 h-5 lg:hidden transition-transform ${openAccordion === 'legal' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`mt-4 space-y-4 lg:block ${openAccordion === 'legal' ? 'block' : 'hidden'}`}>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Kebijakan Cookie</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Pedoman Etika Jurnalistik</Link></li>
              <li><Link to="/" className="text-[14px] text-white/70 hover:text-white transition-colors">Laporan Transparansi</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-[14px] text-center lg:text-left">
            &copy; {new Date().getFullYear()} Juncto.Media | All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[14px] text-white/70">
            <Mail className="w-4 h-4" /> redaksi@juncto.media
          </div>
        </div>
      </div>
    </footer>
  );
}
