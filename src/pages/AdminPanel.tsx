import React, { useState } from 'react';
import { 
  BarChart3, FileText, Search, BookOpen, Bot, FileCheck, 
  Users, CreditCard, Megaphone, IdCard, Settings, LogOut, 
  Bell, ChevronLeft, ChevronRight, Edit, Eye, Trash2, Check, X,
  ArrowUpRight, ArrowDownRight, Pin, Upload, Ban, Menu,
  Plus, Filter, Calendar, User, Tag, Clock, Paperclip, MessageSquare,
  Database, UploadCloud, Link as LinkIcon, Play, RefreshCw, File, Globe, AlertCircle, CheckCircle2, Loader2, Server, Activity,
  EyeOff, Save, RotateCcw, Code, Sliders, History, Cpu, ToggleLeft, ToggleRight,
  FileDown, ExternalLink, MoreVertical, Trash, FilePlus, Layers, Download, Share2,
  TrendingUp, TrendingDown, DollarSign, Package, History as HistoryIcon, ArrowRight, Wallet, CreditCard as CardIcon,
  Map, MousePointer2, Share, MessageCircle, Timer, Globe2, Zap,
  Mail, Shield, HardDrive, Terminal, Key, Smartphone, Languages, Lock, ShieldCheck, ShieldAlert,
  FileJson, HardDriveDownload
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Link } from 'react-router-dom';

// --- DATA DUMMY ---
const articles = [
  { id:1, title:"KPK OTT Kadis PU Bogor", rubrik:"Hukum", penulis:"Devi R.", status:"Published", views:4821, date:"25 Mar 2025", premium:false },
  { id:2, title:"Omnibus Law 3 Tahun Pasca Pengesahan", rubrik:"Kebijakan", penulis:"Rina S.", status:"Draft", views:0, date:"25 Mar 2025", premium:false },
  { id:3, title:"Gurita Bisnis Pejabat Daerah", rubrik:"Investigasi", penulis:"Tim Investigasi", status:"Published", views:12093, date:"23 Mar 2025", premium:true },
  { id:4, title:"Dana IKN: Audit BPK Temukan Selisih", rubrik:"Anggaran", penulis:"Ahmad D.", status:"Review", views:0, date:"25 Mar 2025", premium:false },
];

const usersData = [
  { id:1, name:"Budi Santoso", email:"budi@email.com", role:"Free", status:"Aktif", joined:"01 Jan 2025" },
  { id:2, name:"Maya Putri", email:"maya@email.com", role:"Premium", status:"Aktif", joined:"15 Feb 2025" },
  { id:3, name:"Ahmad Dhani", email:"ahmad@email.com", role:"Jurnalis", status:"Aktif", joined:"01 Mar 2025" },
  { id:4, name:"Santi Wulan", email:"santi@email.com", role:"Editor", status:"Aktif", joined:"10 Jan 2025" },
];

const reports = [
  { id:"JM-2025-04783", title:"Dugaan Mark-up Proyek Jalan Desa X", kategori:"Anggaran", pelapor:"Anonim", status:"Baru", date:"25 Mar 2025" },
  { id:"JM-2025-04782", title:"Sidang Tipikor: Hakim Tidak Independen", kategori:"Hukum", pelapor:"Anonim", status:"Ditinjau", date:"24 Mar 2025" },
  { id:"JM-2025-04780", title:"Dana BOS SDN Cipanas Diduga Diselewengkan", kategori:"Anggaran", pelapor:"Anonim", status:"Ditindaklanjuti", date:"22 Mar 2025" },
];

const journalists = [
  { id:"JM-2025-00142", name:"Budi Santoso", jabatan:"Reporter Investigasi", desk:"Hukum", status:"Aktif", validUntil:"31 Des 2025" },
  { id:"JM-2025-00143", name:"Devi Rahayu", jabatan:"Reporter", desk:"Anggaran", status:"Aktif", validUntil:"31 Des 2025" },
  { id:"JM-2025-00144", name:"Reza Firmansyah", jabatan:"Fotografer", desk:"Keadilan", status:"Pending", validUntil:"-" },
];

// --- REUSABLE COMPONENTS ---
const StatCard = ({ icon, label, value, color = '#003087', trend }: any) => (
  <div className="bg-white border border-[#E8EFF9] rounded-[10px] p-4 flex items-center gap-4 shadow-sm">
    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div>
      <div className="text-[10px] text-[#8899AA] font-medium uppercase tracking-wider">{label}</div>
      <div className="text-[22px] font-black text-[#003087] leading-tight flex items-center gap-2">
        {value}
        {trend && (
          <span className={`text-[10px] flex items-center ${trend > 0 ? 'text-[#10B981]' : 'text-[#E31B23]'}`}>
            {trend > 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  let bg = '#F3F4F6', text = '#6B7280';
  const s = status.toLowerCase();
  
  if (['published', 'aktif', 'ditindaklanjuti', 'jadi berita', 'premium'].includes(s)) { bg = '#E8F5EE'; text = '#1A8C5B'; }
  else if (['draft', 'pending', 'ditinjau', 'expired'].includes(s)) { bg = '#FFF6E0'; text = '#C47A00'; }
  else if (['review', 'diverifikasi', 'editor', 'jurnalis'].includes(s)) { bg = '#EEF0FF'; text = '#4A5FD4'; }
  else if (['baru', 'banned', 'dicabut'].includes(s)) { bg = '#FFEBEB'; text = '#C41A1A'; }
  else if (['admin'].includes(s)) { bg = '#0D1B3E'; text = '#FFFFFF'; }
  
  return (
    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: bg, color: text }}>
      {status}
    </span>
  );
};

const DataTable = ({ columns, data, onAction }: any) => (
  <div className="bg-white border border-[#E8EFF9] rounded-[10px] overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[12px]">
        <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
          <tr>
            <th className="p-3 w-10 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
            {columns.map((col: any, i: number) => <th key={i} className="p-3">{col.label}</th>)}
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8EFF9]">
          {data.map((row: any, i: number) => (
            <tr key={i} className="hover:bg-[#F4F6FA]/50 transition-colors">
              <td className="p-3 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
              {columns.map((col: any, j: number) => (
                <td key={j} className="p-3 text-[#0D1B3E]">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td className="p-3 text-center">
                <button className="text-[#8899AA] hover:text-[#0D1B3E] px-2">···</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="p-3 border-t border-[#E8EFF9] flex items-center justify-between text-[11px] text-[#8899AA]">
      <div>Menampilkan 1-{data.length} dari {data.length} data</div>
      <div className="flex items-center gap-1">
        <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14}/></button>
        <button className="w-6 h-6 bg-[#003087] text-white rounded font-bold">1</button>
        <button className="w-6 h-6 hover:bg-gray-100 rounded">2</button>
        <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={14}/></button>
      </div>
    </div>
  </div>
);

// --- PAGES ---

const DashboardPage = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<FileText size={18}/>} label="Total Artikel" value="1,247" trend={12} />
      <StatCard icon={<Search size={18}/>} label="Investigasi" value="89" color="#4A148C" />
      <StatCard icon={<Users size={18}/>} label="Total User" value="10,482" trend={5} color="#10B981" />
      <StatCard icon={<CreditCard size={18}/>} label="Premium" value="892" trend={8} color="#F59E0B" />
      
      <StatCard icon={<BarChart3 size={18}/>} label="Revenue Bulan Ini" value="Rp133,8Jt" trend={15} color="#10B981" />
      <StatCard icon={<Megaphone size={18}/>} label="Pengaduan Baru" value={<>47 <span className="w-2 h-2 rounded-full bg-[#E31B23] inline-block ml-1"></span></>} color="#E31B23" />
      <StatCard icon={<IdCard size={18}/>} label="Jurnalis Pending" value={<>3 <span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block ml-1"></span></>} color="#F59E0B" />
      <StatCard icon={<Bot size={18}/>} label="RAG Chunks" value="48,392" color="#003087" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-[#E8EFF9] rounded-[10px] p-5 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#0D1B3E] mb-4">Artikel per hari (7 hari terakhir)</h3>
        <div className="h-[200px] w-full flex items-end gap-2">
          {[12,8,15,20,11,18,24].map((val, i) => (
            <div key={i} className="flex-1 bg-[#003087]/10 rounded-t-sm relative group">
              <div className="absolute bottom-0 w-full bg-[#003087] rounded-t-sm transition-all" style={{ height: `${(val/24)*100}%` }}></div>
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0D1B3E] text-white text-[10px] py-1 px-2 rounded">{val}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-[#E8EFF9] rounded-[10px] p-5 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#0D1B3E] mb-4">Distribusi Rubrik</h3>
        <div className="flex items-center justify-center h-[150px]">
          <div className="w-[120px] h-[120px] rounded-full border-[16px] border-[#003087] relative" style={{ borderRightColor: '#10B981', borderBottomColor: '#E31B23', borderLeftColor: '#4A148C' }}>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-[20px] font-black text-[#0D1B3E]">1.2K</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-medium text-[#8899AA]">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#003087]"></div> Kebijakan (30%)</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Anggaran (25%)</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#E31B23]"></div> Hukum (28%)</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#4A148C]"></div> Keadilan (17%)</div>
        </div>
      </div>
    </div>

    <div className="bg-[#FFF5F5] border border-[#FFCDD2] rounded-[10px] p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between text-[12px] font-medium text-[#C41A1A]">
        <div className="flex items-center gap-2"><span className="text-lg">⚠</span> 47 pengaduan belum ditindaklanjuti</div>
        <button className="px-3 py-1 bg-white rounded border border-[#FFCDD2] hover:bg-red-50">Lihat</button>
      </div>
      <div className="flex items-center justify-between text-[12px] font-medium text-[#C47A00] bg-[#FFF6E0] border border-[#FDE68A] p-2 rounded">
        <div className="flex items-center gap-2"><span className="text-lg">⚠</span> 3 permohonan jurnalis menunggu verifikasi</div>
        <button className="px-3 py-1 bg-white rounded border border-[#FDE68A] hover:bg-amber-50">Proses</button>
      </div>
    </div>
  </div>
);

const CMSBeritaPage = () => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [articleList, setArticleList] = useState(articles);
  const [newArticle, setNewArticle] = useState({
    title: '',
    rubrik: 'Hukum',
    penulis: 'Admin Utama',
    status: 'Draft',
    premium: false,
    content: ''
  });

  const handleSave = () => {
    const article = {
      id: articleList.length + 1,
      ...newArticle,
      views: 0,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setArticleList([article, ...articleList]);
    setIsWriteModalOpen(false);
    setNewArticle({
      title: '',
      rubrik: 'Hukum',
      penulis: 'Admin Utama',
      status: 'Draft',
      premium: false,
      content: ''
    });
  };

  const columns = [
    { key: 'title', label: 'Judul & Rubrik', render: (val: string, row: any) => (
      <div>
        <div className="font-bold text-[#0D1B3E]">{val} {row.premium && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded ml-1">PREMIUM</span>}</div>
        <div className="text-[10px] text-[#8899AA]">{row.rubrik}</div>
      </div>
    )},
    { key: 'penulis', label: 'Penulis' },
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'views', label: 'Views', render: (val: number) => val.toLocaleString() },
    { key: 'date', label: 'Tanggal' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setIsWriteModalOpen(true)}
            className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2"
          >
            <Plus size={14} /> Tulis Artikel
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
            <input type="text" placeholder="Cari..." className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087]" />
          </div>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white">
            <option>Semua Rubrik</option>
            <option>Hukum</option>
            <option>Kebijakan</option>
            <option>Investigasi</option>
            <option>Anggaran</option>
          </select>
          <select className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white">
            <option>Semua Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Review</option>
          </select>
        </div>
      </div>
      <DataTable columns={columns} data={articleList} />

      {/* Write Article Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[16px] text-[#0D1B3E] flex items-center gap-2"><Plus size={18}/> Tulis Artikel Baru</h2>
              <button onClick={() => setIsWriteModalOpen(false)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Judul Artikel <span className="text-[#E31B23]">*</span></label>
                <input 
                  type="text" 
                  value={newArticle.title}
                  onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                  placeholder="Masukkan judul artikel..." 
                  className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Rubrik <span className="text-[#E31B23]">*</span></label>
                  <select 
                    value={newArticle.rubrik}
                    onChange={e => setNewArticle({...newArticle, rubrik: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white"
                  >
                    <option value="Hukum">Hukum</option>
                    <option value="Kebijakan">Kebijakan</option>
                    <option value="Investigasi">Investigasi</option>
                    <option value="Anggaran">Anggaran</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Status <span className="text-[#E31B23]">*</span></label>
                  <select 
                    value={newArticle.status}
                    onChange={e => setNewArticle({...newArticle, status: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Review">Review</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5 flex items-center justify-between">
                  <span>Konten Artikel <span className="text-[#E31B23]">*</span></span>
                  <span className="text-[10px] font-medium text-[#8899AA]">Mendukung format Markdown</span>
                </label>
                <textarea 
                  value={newArticle.content}
                  onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                  rows={10} 
                  placeholder="Tulis isi artikel di sini..." 
                  className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-[8px]">
                <input 
                  type="checkbox" 
                  id="premium-check"
                  checked={newArticle.premium}
                  onChange={e => setNewArticle({...newArticle, premium: e.target.checked})}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500" 
                />
                <label htmlFor="premium-check" className="text-[12px] font-medium text-amber-800 cursor-pointer">Tandai sebagai Artikel Premium (Hanya untuk pelanggan Pro/Enterprise)</label>
              </div>
            </div>
            <div className="p-4 border-t border-[#E8EFF9] flex justify-end gap-3 bg-[#F4F6FA] shrink-0">
              <button onClick={() => setIsWriteModalOpen(false)} className="px-4 py-2 rounded-[8px] text-[12px] font-bold text-[#8899AA] hover:bg-gray-200 transition-colors">Batal</button>
              <button 
                onClick={handleSave}
                disabled={!newArticle.title || !newArticle.content}
                className="bg-[#003087] text-white px-6 py-2 rounded-[8px] text-[12px] font-bold hover:bg-[#002566] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ManajemenUserPage = () => {
  const columns = [
    { key: 'name', label: 'User', render: (val: string, row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">{val.charAt(0)}</div>
        <div>
          <div className="font-bold text-[#0D1B3E]">{val}</div>
          <div className="text-[10px] text-[#8899AA]">{row.email}</div>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'joined', label: 'Bergabung' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
          <input type="text" placeholder="Cari nama/email..." className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[250px]" />
        </div>
        <button className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold">+ Tambah User</button>
      </div>
      <DataTable columns={columns} data={usersData} />
    </div>
  );
};

const PengaduanPage = () => {
  const columns = [
    { key: 'id', label: 'ID', render: (val: string) => <span className="font-mono text-[11px] text-[#8899AA]">{val}</span> },
    { key: 'title', label: 'Laporan', render: (val: string, row: any) => (
      <div>
        <div className="font-bold text-[#0D1B3E]">{val}</div>
        <div className="text-[10px] text-[#8899AA]">Kategori: {row.kategori} | Pelapor: {row.pelapor}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'date', label: 'Tanggal' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Megaphone size={18}/>} label="Total Laporan" value="1,247" />
        <StatCard icon={<Megaphone size={18}/>} label="Baru" value="47" color="#E31B23" />
        <StatCard icon={<Check size={18}/>} label="Ditindaklanjuti" value="892" color="#10B981" />
        <StatCard icon={<FileText size={18}/>} label="Jadi Berita" value="156" color="#003087" />
      </div>
      <DataTable columns={columns} data={reports} />
    </div>
  );
};

const VerifJurnalisPage = () => {
  const columns = [
    { key: 'name', label: 'Jurnalis', render: (val: string, row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gray-200"></div>
        <div>
          <div className="font-bold text-[#0D1B3E]">{val}</div>
          <div className="font-mono text-[10px] text-[#8899AA]">{row.id}</div>
        </div>
      </div>
    )},
    { key: 'jabatan', label: 'Posisi', render: (val: string, row: any) => (
      <div>
        <div className="text-[12px] text-[#0D1B3E]">{val}</div>
        <div className="text-[10px] text-[#8899AA]">Desk: {row.desk}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'validUntil', label: 'Berlaku s.d.' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-[#E8EFF9] mb-4">
        <button className="px-4 py-2 border-b-2 border-[#003087] text-[#003087] font-bold text-[12px]">Semua Anggota</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-[#8899AA] font-medium text-[12px]">Pending Verifikasi (3)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-[#8899AA] font-medium text-[12px]">Expired</button>
      </div>
      <div className="flex justify-end mb-4">
        <button className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold">+ Tambah Anggota</button>
      </div>
      <DataTable columns={columns} data={journalists} />
    </div>
  );
};

const dummyInvestigasi = [
  {
    id: 'INV-2025-001',
    title: 'Dugaan Korupsi Proyek Jalan Tol Trans-Sumatera',
    journalist: 'Budi Santoso',
    status: 'Aktif',
    priority: 'Tinggi',
    startDate: '10 Jan 2025',
    targetDate: '15 Apr 2025',
    description: 'Investigasi mendalam terkait aliran dana fiktif pada sub-kontraktor proyek jalan tol.',
    tags: ['Korupsi', 'Infrastruktur', 'BUMN'],
    timeline: [
      { date: '10 Jan 2025', event: 'Kasus dibuka dan tim dibentuk.' },
      { date: '25 Jan 2025', event: 'Wawancara dengan narasumber anonim (whistleblower).' },
      { date: '15 Feb 2025', event: 'Pengumpulan dokumen RAB dan laporan keuangan.' }
    ],
    notes: [
      { author: 'Admin', date: '12 Jan 2025', text: 'Pastikan keamanan narasumber utama.' },
      { author: 'Budi Santoso', date: '20 Feb 2025', text: 'Menunggu konfirmasi dari pihak kementerian.' }
    ],
    docs: [
      { name: 'Laporan_Keuangan_Q3.pdf', size: '2.4 MB' },
      { name: 'Transkrip_Wawancara_01.docx', size: '156 KB' }
    ]
  },
  {
    id: 'INV-2025-002',
    title: 'Mafia Tanah di Kawasan Pesisir Utara',
    journalist: 'Devi Rahayu',
    status: 'Selesai',
    priority: 'Sedang',
    startDate: '05 Nov 2024',
    targetDate: '20 Jan 2025',
    description: 'Penelusuran sindikat pemalsuan sertifikat tanah yang merugikan nelayan lokal.',
    tags: ['Mafia Tanah', 'Agraria'],
    timeline: [
      { date: '05 Nov 2024', event: 'Investigasi dimulai.' },
      { date: '18 Jan 2025', event: 'Penyusunan laporan akhir.' },
      { date: '20 Jan 2025', event: 'Artikel dipublikasikan (3 Part).' }
    ],
    notes: [],
    docs: [{ name: 'Salinan_Sertifikat_Palsu.pdf', size: '5.1 MB' }]
  },
  {
    id: 'INV-2025-003',
    title: 'Kartel Harga Obat-obatan Esensial',
    journalist: 'Tim Investigasi',
    status: 'Draft',
    priority: 'Tinggi',
    startDate: '20 Mar 2025',
    targetDate: '30 Jun 2025',
    description: 'Menyelidiki lonjakan harga obat esensial di apotek jaringan.',
    tags: ['Kesehatan', 'Kartel', 'Bisnis'],
    timeline: [{ date: '20 Mar 2025', event: 'Pengumpulan data awal harga pasar.' }],
    notes: [],
    docs: []
  },
  {
    id: 'INV-2025-004',
    title: 'Eksploitasi Pekerja Tambang Ilegal',
    journalist: 'Ahmad Dhani',
    status: 'Aktif',
    priority: 'Sedang',
    startDate: '01 Feb 2025',
    targetDate: '10 Mei 2025',
    description: 'Kondisi kerja dan pelanggaran HAM di tambang nikel ilegal.',
    tags: ['HAM', 'Tambang', 'Lingkungan'],
    timeline: [{ date: '01 Feb 2025', event: 'Keberangkatan tim ke lokasi.' }],
    notes: [],
    docs: []
  },
  {
    id: 'INV-2025-005',
    title: 'Skandal Impor Beras',
    journalist: 'Santi Wulan',
    status: 'Arsip',
    priority: 'Rendah',
    startDate: '15 Ags 2024',
    targetDate: '30 Okt 2024',
    description: 'Dugaan suap kuota impor beras.',
    tags: ['Korupsi', 'Pangan'],
    timeline: [],
    notes: [],
    docs: []
  }
];

const InvestigasiPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [priorityFilter, setPriorityFilter] = useState('Semua');
  const [journalistFilter, setJournalistFilter] = useState('Semua');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = dummyInvestigasi.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
    const matchPriority = priorityFilter === 'Semua' || item.priority === priorityFilter;
    const matchJournalist = journalistFilter === 'Semua' || item.journalist === journalistFilter;
    return matchSearch && matchStatus && matchPriority && matchJournalist;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const PriorityBadge = ({ priority }: { priority: string }) => {
    let bg = '#F3F4F6', text = '#6B7280';
    if (priority === 'Tinggi') { bg = '#FFEBEB'; text = '#C41A1A'; }
    else if (priority === 'Sedang') { bg = '#FFF6E0'; text = '#C47A00'; }
    else if (priority === 'Rendah') { bg = '#E8F5EE'; text = '#1A8C5B'; }
    return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: bg, color: text }}>{priority}</span>;
  };

  return (
    <div className="space-y-4 relative">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2">
            <Plus size={14} /> Buat Kasus Baru
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
            <input type="text" placeholder="Cari ID/Judul..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[200px]" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-[#E8EFF9] rounded-[8px] px-3 py-2">
            <Filter size={14} className="text-[#8899AA]" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-[12px] outline-none bg-transparent text-[#0D1B3E] font-medium">
              <option value="Semua">Semua Status</option>
              <option value="Draft">Draft</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
              <option value="Arsip">Arsip</option>
            </select>
          </div>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
            <option value="Semua">Semua Prioritas</option>
            <option value="Tinggi">Tinggi</option>
            <option value="Sedang">Sedang</option>
            <option value="Rendah">Rendah</option>
          </select>
          <select value={journalistFilter} onChange={e => setJournalistFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
            <option value="Semua">Semua Jurnalis</option>
            <option value="Budi Santoso">Budi Santoso</option>
            <option value="Devi Rahayu">Devi Rahayu</option>
            <option value="Ahmad Dhani">Ahmad Dhani</option>
            <option value="Santi Wulan">Santi Wulan</option>
            <option value="Tim Investigasi">Tim Investigasi</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8EFF9] rounded-[10px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">ID Kasus</th>
                <th className="p-3">Judul Kasus</th>
                <th className="p-3">Jurnalis</th>
                <th className="p-3">Status</th>
                <th className="p-3">Prioritas</th>
                <th className="p-3">Tgl Mulai</th>
                <th className="p-3">Tgl Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EFF9]">
              {paginatedData.length > 0 ? paginatedData.map((row, i) => (
                <tr key={i} onClick={() => setSelectedCase(row)} className="hover:bg-[#F4F6FA]/50 transition-colors cursor-pointer">
                  <td className="p-3 font-mono text-[11px] text-[#8899AA]">{row.id}</td>
                  <td className="p-3 font-bold text-[#0D1B3E] max-w-[250px] truncate">{row.title}</td>
                  <td className="p-3 text-[#0D1B3E]">{row.journalist}</td>
                  <td className="p-3"><StatusBadge status={row.status} /></td>
                  <td className="p-3"><PriorityBadge priority={row.priority} /></td>
                  <td className="p-3 text-[#8899AA]">{row.startDate}</td>
                  <td className="p-3 text-[#8899AA]">{row.targetDate}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-[#8899AA]">Tidak ada data yang ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-3 border-t border-[#E8EFF9] flex items-center justify-between text-[11px] text-[#8899AA]">
          <div>Menampilkan {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"><ChevronLeft size={14}/></button>
            <button className="w-6 h-6 bg-[#003087] text-white rounded font-bold">{currentPage}</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[14px] text-[#0D1B3E]">Detail Investigasi</h2>
              <button onClick={() => setSelectedCase(null)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[11px] text-[#8899AA]">{selectedCase.id}</span>
                  <StatusBadge status={selectedCase.status} />
                  <PriorityBadge priority={selectedCase.priority} />
                </div>
                <h3 className="text-[18px] font-black text-[#0D1B3E] leading-tight mb-3">{selectedCase.title}</h3>
                <p className="text-[13px] text-[#4A5568] leading-relaxed">{selectedCase.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-[#F4F6FA] p-4 rounded-[8px] border border-[#E8EFF9]">
                <div>
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Jurnalis</div>
                  <div className="text-[12px] font-semibold text-[#0D1B3E] flex items-center gap-1.5"><User size={12}/> {selectedCase.journalist}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCase.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] bg-white border border-[#E8EFF9] px-1.5 py-0.5 rounded text-[#0D1B3E]">{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Mulai</div>
                  <div className="text-[12px] font-semibold text-[#0D1B3E] flex items-center gap-1.5"><Calendar size={12}/> {selectedCase.startDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Target</div>
                  <div className="text-[12px] font-semibold text-[#0D1B3E] flex items-center gap-1.5"><Calendar size={12}/> {selectedCase.targetDate}</div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-[13px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><Clock size={14}/> Timeline Investigasi</h4>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {selectedCase.timeline.length > 0 ? selectedCase.timeline.map((item: any, i: number) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-[#003087] text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded-[8px] border border-[#E8EFF9] shadow-sm">
                        <div className="text-[10px] font-bold text-[#003087] mb-1">{item.date}</div>
                        <div className="text-[12px] text-[#0D1B3E]">{item.event}</div>
                      </div>
                    </div>
                  )) : <div className="text-[12px] text-[#8899AA] italic">Belum ada timeline.</div>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-[13px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><MessageSquare size={14}/> Catatan Internal</h4>
                <div className="space-y-3">
                  {selectedCase.notes.length > 0 ? selectedCase.notes.map((note: any, i: number) => (
                    <div key={i} className="bg-[#FFF6E0] p-3 rounded-[8px] border border-[#FDE68A]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-[#C47A00]">{note.author}</span>
                        <span className="text-[9px] text-[#C47A00]/70">{note.date}</span>
                      </div>
                      <p className="text-[12px] text-[#0D1B3E]">{note.text}</p>
                    </div>
                  )) : <div className="text-[12px] text-[#8899AA] italic">Belum ada catatan.</div>}
                </div>
              </div>

              {/* Docs */}
              <div>
                <h4 className="text-[13px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><Paperclip size={14}/> Dokumen Terkait</h4>
                <div className="space-y-2">
                  {selectedCase.docs.length > 0 ? selectedCase.docs.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-white border border-[#E8EFF9] rounded-[8px] hover:border-[#003087] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-[#8899AA] group-hover:text-[#003087]" />
                        <span className="text-[12px] font-medium text-[#0D1B3E]">{doc.name}</span>
                      </div>
                      <span className="text-[10px] text-[#8899AA]">{doc.size}</span>
                    </div>
                  )) : <div className="text-[12px] text-[#8899AA] italic">Belum ada dokumen.</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[16px] text-[#0D1B3E]">Buat Kasus Investigasi Baru</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Judul Kasus <span className="text-[#E31B23]">*</span></label>
                <input type="text" placeholder="Masukkan judul investigasi..." className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Deskripsi Singkat</label>
                <textarea rows={3} placeholder="Jelaskan fokus investigasi ini..." className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Jurnalis Ditugaskan <span className="text-[#E31B23]">*</span></label>
                  <select className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                    <option value="">Pilih Jurnalis...</option>
                    <option value="Budi Santoso">Budi Santoso</option>
                    <option value="Devi Rahayu">Devi Rahayu</option>
                    <option value="Tim Investigasi">Tim Investigasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Prioritas <span className="text-[#E31B23]">*</span></label>
                  <select className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Tanggal Mulai <span className="text-[#E31B23]">*</span></label>
                  <input type="date" className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Tanggal Target Selesai</label>
                  <input type="date" className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Tag / Kategori</label>
                <input type="text" placeholder="Ketik tag dan tekan Enter..." className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
              </div>
            </div>
            <div className="p-4 border-t border-[#E8EFF9] flex justify-end gap-3 bg-[#F4F6FA] shrink-0">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-[#E8EFF9] bg-white text-[#0D1B3E] rounded-[6px] text-[12px] font-bold hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-[#003087] text-white rounded-[6px] text-[12px] font-bold hover:bg-[#002266] transition-colors">Simpan Kasus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const dummyRAGDocs = [
  { id: 'DOC-001', name: 'KUHP_Baru_UU_1_2023.pdf', type: 'PDF', size: '4.2 MB', status: 'Indexed', date: '20 Mar 2025', chunks: 1240 },
  { id: 'DOC-002', name: 'Putusan_MK_No_90_PUU_XXI_2023.pdf', type: 'PDF', size: '1.8 MB', status: 'Indexed', date: '21 Mar 2025', chunks: 450 },
  { id: 'DOC-003', name: 'UU_ITE_Revisi_Kedua.txt', type: 'TXT', size: '120 KB', status: 'Processing', date: '25 Mar 2025', progress: 45, chunks: 0 },
  { id: 'DOC-004', name: 'https://jdih.kemenkeu.go.id/aturan/123', type: 'URL', size: '-', status: 'Pending', date: '25 Mar 2025', chunks: 0 },
  { id: 'DOC-005', name: 'Draft_RUU_Perampasan_Aset.pdf', type: 'PDF', size: '3.5 MB', status: 'Error', date: '24 Mar 2025', chunks: 0 },
];

const KnowledgeRAGPage = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [testQuery, setTestQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);

  const filteredDocs = dummyRAGDocs.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'Semua' || doc.type === typeFilter;
    const matchStatus = statusFilter === 'Semua' || doc.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleTestQuery = () => {
    if (!testQuery.trim()) return;
    setIsQuerying(true);
    setTimeout(() => {
      setQueryResults([
        { doc: 'KUHP_Baru_UU_1_2023.pdf', score: 0.92, text: 'Pasal 12: Tindak pidana korupsi sebagaimana dimaksud dalam ayat (1) dipidana dengan pidana penjara paling singkat 4 tahun...' },
        { doc: 'Putusan_MK_No_90_PUU_XXI_2023.pdf', score: 0.85, text: 'Menimbang bahwa berdasarkan pertimbangan hukum di atas, Mahkamah berpendapat bahwa permohonan pemohon beralasan menurut hukum...' }
      ]);
      setIsQuerying(false);
    }, 1500);
  };

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === 'PDF') return <FileText size={14} className="text-[#E31B23]" />;
    if (type === 'TXT') return <File size={14} className="text-[#8899AA]" />;
    if (type === 'URL') return <Globe size={14} className="text-[#003087]" />;
    return <File size={14} />;
  };

  const RAGStatusBadge = ({ status, progress }: { status: string, progress?: number }) => {
    if (status === 'Indexed') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#1A8C5B] bg-[#E8F5EE] px-2 py-0.5 rounded w-fit"><CheckCircle2 size={10}/> INDEXED</span>;
    if (status === 'Processing') return (
      <div className="flex flex-col gap-1 w-24">
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#4A5FD4] bg-[#EEF0FF] px-2 py-0.5 rounded w-fit"><Loader2 size={10} className="animate-spin"/> PROCESSING</span>
        <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-[#4A5FD4] h-1.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
      </div>
    );
    if (status === 'Pending') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#C47A00] bg-[#FFF6E0] px-2 py-0.5 rounded w-fit"><Clock size={10}/> PENDING</span>;
    if (status === 'Error') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#C41A1A] bg-[#FFEBEB] px-2 py-0.5 rounded w-fit"><AlertCircle size={10}/> ERROR</span>;
    return null;
  };

  return (
    <div className="flex h-full gap-4 relative">
      {/* Main Content */}
      <div className={`flex-1 space-y-4 transition-all duration-300 ${isTestPanelOpen ? 'lg:pr-[350px]' : ''}`}>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Database size={18}/>} label="Total Dokumen" value="1,248" color="#003087" />
          <StatCard icon={<Server size={18}/>} label="Ukuran Knowledge Base" value="4.2 GB" color="#4A148C" />
          <StatCard icon={<Activity size={18}/>} label="Query per Hari" value="8,492" trend={12} color="#10B981" />
          <StatCard icon={<CheckCircle2 size={18}/>} label="Akurasi Retrieval" value="94.2%" trend={2} color="#10B981" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2">
              <UploadCloud size={14} /> Upload Dokumen
            </button>
            <button className="bg-white border border-[#E8EFF9] text-[#0D1B3E] px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-gray-50">
              <LinkIcon size={14} /> Tambah URL
            </button>
            <button onClick={() => setIsTestPanelOpen(!isTestPanelOpen)} className={`px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 transition-colors ${isTestPanelOpen ? 'bg-[#4A148C] text-white' : 'bg-white border border-[#E8EFF9] text-[#0D1B3E] hover:bg-gray-50'}`}>
              <Play size={14} /> Test Query
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
              <input type="text" placeholder="Cari dokumen..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[200px]" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
              <option value="Semua">Semua Tipe</option>
              <option value="PDF">PDF</option>
              <option value="TXT">TXT</option>
              <option value="URL">URL</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
              <option value="Semua">Semua Status</option>
              <option value="Indexed">Indexed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Error">Error</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E8EFF9] rounded-[10px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Nama Dokumen</th>
                  <th className="p-3">Tipe</th>
                  <th className="p-3">Ukuran</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Chunks</th>
                  <th className="p-3">Tgl Upload</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EFF9]">
                {filteredDocs.length > 0 ? filteredDocs.map((row, i) => (
                  <tr key={i} className="hover:bg-[#F4F6FA]/50 transition-colors">
                    <td className="p-3 font-medium text-[#0D1B3E] max-w-[250px] truncate" title={row.name}>{row.name}</td>
                    <td className="p-3"><div className="flex items-center gap-1"><TypeIcon type={row.type}/> {row.type}</div></td>
                    <td className="p-3 text-[#8899AA]">{row.size}</td>
                    <td className="p-3"><RAGStatusBadge status={row.status} progress={row.progress} /></td>
                    <td className="p-3 text-[#8899AA]">{row.chunks > 0 ? row.chunks.toLocaleString() : '-'}</td>
                    <td className="p-3 text-[#8899AA]">{row.date}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-[#8899AA] hover:text-[#003087]" title="Re-index"><RefreshCw size={14}/></button>
                        <button className="text-[#8899AA] hover:text-[#003087]" title="Lihat Chunks"><Eye size={14}/></button>
                        <button className="text-[#8899AA] hover:text-[#E31B23]" title="Hapus"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-[#8899AA]">Tidak ada dokumen yang ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Test Query Panel */}
      {isTestPanelOpen && (
        <div className="fixed inset-y-0 right-0 w-[350px] bg-white border-l border-[#E8EFF9] shadow-2xl z-40 flex flex-col lg:absolute lg:h-auto lg:inset-y-0 lg:shadow-none animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
            <h2 className="font-bold text-[14px] text-[#0D1B3E] flex items-center gap-2"><Bot size={16}/> Test RAG Retrieval</h2>
            <button onClick={() => setIsTestPanelOpen(false)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors lg:hidden"><X size={18} /></button>
          </div>
          
          <div className="p-4 border-b border-[#E8EFF9] shrink-0 bg-white">
            <label className="block text-[11px] font-bold text-[#8899AA] uppercase mb-2">Query Pertanyaan</label>
            <textarea 
              value={testQuery}
              onChange={e => setTestQuery(e.target.value)}
              placeholder="Contoh: Apa hukuman bagi tindak pidana korupsi menurut KUHP baru?" 
              className="w-full px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] resize-none h-[80px] mb-2"
            ></textarea>
            <button 
              onClick={handleTestQuery}
              disabled={isQuerying || !testQuery.trim()}
              className="w-full bg-[#4A148C] text-white py-2 rounded-[8px] text-[12px] font-bold hover:bg-[#380b6e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isQuerying ? <><Loader2 size={14} className="animate-spin"/> Mencari...</> : <><Search size={14}/> Jalankan Query</>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-[#F4F6FA] custom-scrollbar">
            <div className="text-[11px] font-bold text-[#8899AA] uppercase mb-3">Hasil Retrieval ({queryResults.length} Chunks)</div>
            
            {queryResults.length > 0 ? (
              <div className="space-y-3">
                {queryResults.map((res, i) => (
                  <div key={i} className="bg-white p-3 rounded-[8px] border border-[#E8EFF9] shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#003087] truncate max-w-[200px]">
                        <FileText size={12} className="shrink-0"/> <span className="truncate">{res.doc}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#10B981] bg-[#E8F5EE] px-1.5 py-0.5 rounded shrink-0">
                        Score: {res.score}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4A5568] leading-relaxed border-l-2 border-[#E8EFF9] pl-2">
                      "...{res.text}..."
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              !isQuerying && <div className="text-center text-[#8899AA] text-[12px] mt-10">Belum ada hasil. Masukkan query untuk menguji retrieval.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const dummyPromptTemplates = [
  {
    id: 'system',
    name: 'System Prompt (Utama)',
    content: `Anda adalah asisten AI hukum (Legal AI Assistant) khusus untuk hukum Indonesia.
Tugas Anda adalah memberikan analisis hukum yang akurat, objektif, dan berdasarkan peraturan perundang-undangan yang berlaku di Indonesia.
Gunakan bahasa Indonesia yang formal dan mudah dipahami.
Selalu sertakan dasar hukum (pasal dan undang-undang) dalam setiap argumen Anda.
Jika Anda tidak yakin atau informasinya tidak tersedia dalam knowledge base, katakan bahwa Anda tidak memiliki informasi tersebut.`
  },
  {
    id: 'user',
    name: 'User Prompt (Default)',
    content: `Berdasarkan konteks berikut:\n{{konteks}}\n\nJawab pertanyaan hukum berikut:\n{{pertanyaan}}\n\nBerikan analisis yang komprehensif.`
  },
  {
    id: 'analysis',
    name: 'Legal Analysis Prompt',
    content: `Lakukan analisis hukum mendalam terhadap dokumen berikut:\n{{dokumen}}\n\nFokus pada:\n1. Identifikasi isu hukum utama.\n2. Pasal-pasal yang relevan.\n3. Potensi risiko hukum.\n4. Rekomendasi tindakan.`
  },
  {
    id: 'summary',
    name: 'Document Summary Prompt',
    content: `Buat ringkasan eksekutif dari dokumen hukum berikut:\n{{dokumen}}\n\nRingkasan harus mencakup:\n- Pihak yang terlibat\n- Objek perjanjian/perkara\n- Hak dan kewajiban utama\n- Jangka waktu`
  }
];

const dummyHistoryLogs = [
  { id: 1, date: '25 Mar 2025 10:30', admin: 'Budi Santoso', action: 'Mengubah Temperature', changes: '0.7 → 0.5' },
  { id: 2, date: '24 Mar 2025 15:45', admin: 'Admin Utama', action: 'Mengubah Model AI', changes: 'GPT-3.5-Turbo → GPT-4o' },
  { id: 3, date: '22 Mar 2025 09:15', admin: 'Santi Wulan', action: 'Update System Prompt', changes: 'Penambahan instruksi sitasi UU' },
  { id: 4, date: '20 Mar 2025 11:20', admin: 'Admin Utama', action: 'Mengubah Max Tokens', changes: '2048 → 4096' },
];

const AILegalConfigPage = () => {
  const [activeTab, setActiveTab] = useState('model');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isStreaming, setIsStreaming] = useState(true);
  
  // Model Config State
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  const [endpoint, setEndpoint] = useState('https://api.openai.com/v1/chat/completions');
  
  // Prompt State
  const [activeTemplateId, setActiveTemplateId] = useState('system');
  const [templateContent, setTemplateContent] = useState(dummyPromptTemplates[0].content);
  
  // Parameter State
  const [temperature, setTemperature] = useState(0.5);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [topP, setTopP] = useState(0.9);
  const [stopSequences, setStopSequences] = useState('["Human:", "AI:"]');

  const handleTemplateChange = (id: string) => {
    setActiveTemplateId(id);
    const template = dummyPromptTemplates.find(t => t.id === id);
    if (template) setTemplateContent(template.content);
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[10px] border border-[#E8EFF9] shadow-sm">
        <div>
          <h2 className="text-[16px] font-bold text-[#0D1B3E]">Konfigurasi AI Legal Assistant</h2>
          <p className="text-[12px] text-[#8899AA]">Kelola model AI, prompt, dan parameter untuk fitur asisten hukum.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-[#E8EFF9] bg-white text-[#0D1B3E] rounded-[8px] text-[12px] font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <RotateCcw size={14} /> Reset ke Default
          </button>
          <button className="px-4 py-2 bg-[#003087] text-white rounded-[8px] text-[12px] font-bold hover:bg-[#002266] transition-colors flex items-center gap-2">
            <Save size={14} /> Simpan Konfigurasi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8EFF9] bg-white px-4 pt-2 rounded-t-[10px]">
        {[
          { id: 'model', label: 'Konfigurasi Model', icon: <Cpu size={14} /> },
          { id: 'prompt', label: 'Prompt Template', icon: <Code size={14} /> },
          { id: 'parameter', label: 'Parameter', icon: <Sliders size={14} /> },
          { id: 'history', label: 'Riwayat Perubahan', icon: <History size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[12px] font-bold border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-[#003087] text-[#003087]' 
                : 'border-transparent text-[#8899AA] hover:text-[#0D1B3E]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-[#E8EFF9] border-t-0 rounded-b-[10px] p-6 shadow-sm min-h-[400px]">
        
        {/* TAB: MODEL */}
        {activeTab === 'model' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-4 bg-[#F4F6FA] rounded-[8px] border border-[#E8EFF9]">
              <div>
                <div className="font-bold text-[#0D1B3E] text-[13px]">Status AI Assistant</div>
                <div className="text-[11px] text-[#8899AA]">Aktifkan atau nonaktifkan fitur AI Legal Assistant di seluruh aplikasi.</div>
              </div>
              <button onClick={() => setIsActive(!isActive)} className={`transition-colors ${isActive ? 'text-[#10B981]' : 'text-[#8899AA]'}`}>
                {isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Pilih Model AI</label>
              <select 
                value={selectedModel} 
                onChange={e => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white"
              >
                <option value="gpt-4o">OpenAI GPT-4o (Default)</option>
                <option value="gpt-4-turbo">OpenAI GPT-4 Turbo</option>
                <option value="claude-3-opus">Anthropic Claude 3 Opus</option>
                <option value="claude-3-sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">API Key</label>
              <div className="relative">
                <input 
                  type={showApiKey ? "text" : "password"} 
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] font-mono" 
                />
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8899AA] hover:text-[#0D1B3E]"
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-[#8899AA] mt-1">Simpan API Key dengan aman. Jangan bagikan ke pihak luar.</p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Endpoint URL</label>
              <input 
                type="text" 
                value={endpoint}
                onChange={e => setEndpoint(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] font-mono text-[#8899AA]" 
              />
            </div>
          </div>
        )}

        {/* TAB: PROMPT */}
        {activeTab === 'prompt' && (
          <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in duration-300">
            {/* Sidebar Templates */}
            <div className="w-full lg:w-[250px] shrink-0 space-y-2">
              <div className="text-[11px] font-bold text-[#8899AA] uppercase mb-3">Daftar Template</div>
              {dummyPromptTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-[8px] text-[12px] font-medium transition-colors ${
                    activeTemplateId === template.id 
                      ? 'bg-[#003087] text-white' 
                      : 'bg-[#F4F6FA] text-[#0D1B3E] hover:bg-[#E8EFF9]'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-bold text-[#0D1B3E]">Editor Prompt</label>
                <button className="text-[11px] font-bold text-[#003087] hover:underline flex items-center gap-1">
                  <Play size={12} /> Preview Prompt
                </button>
              </div>
              <textarea 
                value={templateContent}
                onChange={e => setTemplateContent(e.target.value)}
                className="flex-1 w-full p-4 rounded-[8px] border border-[#E8EFF9] bg-[#0D1B3E] text-[#10B981] font-mono text-[13px] outline-none focus:border-[#003087] resize-none leading-relaxed"
              ></textarea>
              
              {/* Variables Helper */}
              <div className="mt-4 p-3 bg-[#F4F6FA] rounded-[8px] border border-[#E8EFF9]">
                <div className="text-[11px] font-bold text-[#0D1B3E] mb-2">Variabel Dinamis Tersedia:</div>
                <div className="flex flex-wrap gap-2">
                  {['{{konteks}}', '{{pertanyaan}}', '{{dokumen}}', '{{user_profile}}', '{{tanggal_hari_ini}}'].map((v, i) => (
                    <span key={i} className="px-2 py-1 bg-white border border-[#E8EFF9] rounded text-[10px] font-mono text-[#4A148C] cursor-pointer hover:border-[#4A148C]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PARAMETER */}
        {activeTab === 'parameter' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[12px] font-bold text-[#0D1B3E]">Temperature</label>
                <span className="text-[12px] font-mono font-bold text-[#003087] bg-[#EEF0FF] px-2 py-0.5 rounded">{temperature}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#003087]" 
              />
              <div className="flex justify-between text-[10px] text-[#8899AA] mt-1">
                <span>Lebih Konsisten (0)</span>
                <span>Lebih Kreatif (1)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[12px] font-bold text-[#0D1B3E]">Max Tokens</label>
                <span className="text-[12px] font-mono font-bold text-[#003087] bg-[#EEF0FF] px-2 py-0.5 rounded">{maxTokens}</span>
              </div>
              <input 
                type="range" min="256" max="8192" step="256" 
                value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-[#003087]" 
              />
              <div className="flex justify-between text-[10px] text-[#8899AA] mt-1">
                <span>Pendek (256)</span>
                <span>Panjang (8192)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[12px] font-bold text-[#0D1B3E]">Top-P</label>
                <span className="text-[12px] font-mono font-bold text-[#003087] bg-[#EEF0FF] px-2 py-0.5 rounded">{topP}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={topP} onChange={e => setTopP(parseFloat(e.target.value))}
                className="w-full accent-[#003087]" 
              />
            </div>

            <div className="pt-4 border-t border-[#E8EFF9]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-[#0D1B3E] text-[12px]">Streaming Response</div>
                  <div className="text-[11px] text-[#8899AA]">Tampilkan jawaban secara bertahap (seperti mengetik).</div>
                </div>
                <button onClick={() => setIsStreaming(!isStreaming)} className={`transition-colors ${isStreaming ? 'text-[#10B981]' : 'text-[#8899AA]'}`}>
                  {isStreaming ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Stop Sequences (JSON Array)</label>
                <input 
                  type="text" 
                  value={stopSequences}
                  onChange={e => setStopSequences(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] font-mono text-[#0D1B3E]" 
                />
                <p className="text-[10px] text-[#8899AA] mt-1">Karakter atau kata yang akan menghentikan generasi teks AI.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Admin</th>
                    <th className="p-3">Aksi</th>
                    <th className="p-3">Perubahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFF9]">
                  {dummyHistoryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F4F6FA]/50 transition-colors">
                      <td className="p-3 text-[#8899AA] whitespace-nowrap">{log.date}</td>
                      <td className="p-3 font-medium text-[#0D1B3E]">{log.admin}</td>
                      <td className="p-3 text-[#0D1B3E]">{log.action}</td>
                      <td className="p-3 font-mono text-[11px] text-[#4A5FD4] bg-[#EEF0FF] rounded px-2 py-1 my-2 inline-block">{log.changes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const dummyLegalDocs = [
  { 
    id: 1, 
    title: 'Kitab Undang-Undang Hukum Pidana (KUHP)', 
    category: 'UU', 
    number: '1', 
    year: '2023', 
    status: 'Aktif', 
    agency: 'DPR RI & Pemerintah',
    tags: ['Pidana', 'Reformasi Hukum'],
    file: 'kuhp_2023.pdf',
    replaces: null,
    replacedBy: null
  },
  { 
    id: 2, 
    title: 'Undang-Undang tentang Cipta Kerja', 
    category: 'UU', 
    number: '11', 
    year: '2020', 
    status: 'Direvisi', 
    agency: 'DPR RI',
    tags: ['Ekonomi', 'Investigasi', 'Ketenagakerjaan'],
    file: 'uu_11_2020.pdf',
    replaces: null,
    replacedBy: 'UU No. 6 Tahun 2023'
  },
  { 
    id: 3, 
    title: 'Undang-Undang tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 tentang Cipta Kerja menjadi Undang-Undang', 
    category: 'UU', 
    number: '6', 
    year: '2023', 
    status: 'Aktif', 
    agency: 'DPR RI',
    tags: ['Ekonomi', 'Cipta Kerja'],
    file: 'uu_6_2023.pdf',
    replaces: 'UU No. 11 Tahun 2020',
    replacedBy: null
  },
  { 
    id: 4, 
    title: 'Peraturan Pemerintah tentang Penyelenggaraan Bidang Perumahan', 
    category: 'PP', 
    number: '12', 
    year: '2021', 
    status: 'Aktif', 
    agency: 'Kementerian PUPR',
    tags: ['Properti', 'Perumahan'],
    file: 'pp_12_2021.pdf',
    replaces: null,
    replacedBy: null
  },
  { 
    id: 5, 
    title: 'Peraturan Daerah Provinsi DKI Jakarta tentang Penanggulangan Corona Virus Disease 2019', 
    category: 'Perda', 
    number: '2', 
    year: '2020', 
    status: 'Dicabut', 
    agency: 'DPRD DKI Jakarta',
    tags: ['Kesehatan', 'Pandemi'],
    file: 'perda_2_2020.pdf',
    replaces: null,
    replacedBy: 'Perda No. 5 Tahun 2022'
  },
  { 
    id: 6, 
    title: 'Putusan Mahkamah Konstitusi terkait Syarat Usia Capres-Cawapres', 
    category: 'Putusan', 
    number: '90/PUU-XXI/2023', 
    year: '2023', 
    status: 'Aktif', 
    agency: 'Mahkamah Konstitusi',
    tags: ['Pemilu', 'Konstitusi'],
    file: 'putusan_mk_90_2023.pdf',
    replaces: null,
    replacedBy: null
  }
];

const DokumenHukumPage = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [yearFilter, setYearFilter] = useState('Semua');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'desc' });

  const filteredDocs = dummyLegalDocs.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || doc.number.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'Semua' || doc.category === categoryFilter;
    const matchStatus = statusFilter === 'Semua' || doc.status === statusFilter;
    const matchYear = yearFilter === 'Semua' || doc.year === yearFilter;
    return matchSearch && matchCategory && matchStatus && matchYear;
  });

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDocs = [...filteredDocs].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedDocs.length === sortedDocs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(sortedDocs.map(d => d.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter(item => item !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  const LegalStatusBadge = ({ status }: { status: string }) => {
    let bg = '#F3F4F6', text = '#6B7280';
    if (status === 'Aktif') { bg = '#E8F5EE'; text = '#1A8C5B'; }
    else if (status === 'Dicabut') { bg = '#FFEBEB'; text = '#C41A1A'; }
    else if (status === 'Direvisi') { bg = '#FFF6E0'; text = '#C47A00'; }
    return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: bg, color: text }}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FileCheck size={18}/>} label="Total Dokumen" value="4,821" color="#003087" />
        <StatCard icon={<Layers size={18}/>} label="Undang-Undang (UU)" value="1,240" color="#4A148C" />
        <StatCard icon={<FilePlus size={18}/>} label="Dokumen Bulan Ini" value="42" trend={15} color="#10B981" />
        <StatCard icon={<Ban size={18}/>} label="Dicabut/Direvisi" value="382" color="#E31B23" />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[10px] border border-[#E8EFF9] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setIsUploadModalOpen(true)} className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2">
              <FilePlus size={14} /> Upload Dokumen Baru
            </button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
              <input 
                type="text" 
                placeholder="Cari judul atau nomor..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[250px]" 
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
              <option value="Semua">Semua Kategori</option>
              <option value="UU">UU</option>
              <option value="PP">PP</option>
              <option value="Perda">Perda</option>
              <option value="Putusan">Putusan</option>
              <option value="Regulasi">Regulasi</option>
            </select>
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
              <option value="Semua">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Dicabut">Dicabut</option>
              <option value="Direvisi">Direvisi</option>
            </select>
          </div>
        </div>

        {selectedDocs.length > 0 && (
          <div className="flex items-center justify-between bg-[#EEF0FF] p-2 rounded-[8px] border border-[#D1D5DB] animate-in fade-in slide-in-from-top-2">
            <div className="text-[11px] font-bold text-[#003087] ml-2">{selectedDocs.length} dokumen terpilih</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-[#D1D5DB] text-[#0D1B3E] rounded-[6px] text-[11px] font-bold flex items-center gap-1.5 hover:bg-gray-50">
                <FileDown size={14} /> Export CSV
              </button>
              <button className="px-3 py-1.5 bg-[#FFEBEB] border border-[#FFCDD2] text-[#C41A1A] rounded-[6px] text-[11px] font-bold flex items-center gap-1.5 hover:bg-red-50">
                <Trash size={14} /> Hapus Permanen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#E8EFF9] rounded-[10px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300" 
                    checked={selectedDocs.length === sortedDocs.length && sortedDocs.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 cursor-pointer hover:text-[#0D1B3E]" onClick={() => handleSort('title')}>Judul Dokumen</th>
                <th className="p-3 cursor-pointer hover:text-[#0D1B3E]" onClick={() => handleSort('category')}>Kategori</th>
                <th className="p-3">Nomor & Tahun</th>
                <th className="p-3">Status</th>
                <th className="p-3">Penerbit</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EFF9]">
              {sortedDocs.map((doc) => (
                <tr key={doc.id} className={`hover:bg-[#F4F6FA]/50 transition-colors ${selectedDocs.includes(doc.id) ? 'bg-[#EEF0FF]/30' : ''}`}>
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300" 
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                    />
                  </td>
                  <td className="p-3 max-w-[300px]">
                    <div className="font-bold text-[#0D1B3E] leading-tight mb-1">{doc.title}</div>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-1"><Tag size={8}/> {tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#003087]">{doc.category}</span>
                  </td>
                  <td className="p-3">
                    <div className="text-[#0D1B3E] font-medium">No. {doc.number}</div>
                    <div className="text-[10px] text-[#8899AA]">Tahun {doc.year}</div>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <LegalStatusBadge status={doc.status} />
                      {doc.replaces && <div className="text-[9px] text-[#8899AA] italic">Mengganti: {doc.replaces}</div>}
                      {doc.replacedBy && <div className="text-[9px] text-[#C47A00] italic">Diganti: {doc.replacedBy}</div>}
                    </div>
                  </td>
                  <td className="p-3 text-[#0D1B3E] text-[11px]">{doc.agency}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-[#8899AA] hover:text-[#003087] hover:bg-[#EEF0FF] rounded transition-colors" title="Preview/Buka"><Eye size={14}/></button>
                      <button className="p-1.5 text-[#8899AA] hover:text-[#003087] hover:bg-[#EEF0FF] rounded transition-colors" title="Download PDF"><Download size={14}/></button>
                      <button className="p-1.5 text-[#8899AA] hover:text-[#003087] hover:bg-[#EEF0FF] rounded transition-colors" title="Tandai Dicabut/Direvisi"><History size={14}/></button>
                      <button className="p-1.5 text-[#8899AA] hover:text-[#0D1B3E] hover:bg-gray-100 rounded transition-colors"><MoreVertical size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-[#E8EFF9] flex items-center justify-between text-[11px] text-[#8899AA]">
          <div>Menampilkan 1-{sortedDocs.length} dari 4,821 data</div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14}/></button>
            <button className="w-6 h-6 bg-[#003087] text-white rounded font-bold">1</button>
            <button className="w-6 h-6 hover:bg-gray-100 rounded">2</button>
            <button className="w-6 h-6 hover:bg-gray-100 rounded">3</button>
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[16px] text-[#0D1B3E] flex items-center gap-2"><FilePlus size={18}/> Upload Dokumen Hukum Baru</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Judul Dokumen <span className="text-[#E31B23]">*</span></label>
                <input type="text" placeholder="Masukkan judul lengkap dokumen..." className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Kategori <span className="text-[#E31B23]">*</span></label>
                  <select className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                    <option value="UU">Undang-Undang (UU)</option>
                    <option value="PP">Peraturan Pemerintah (PP)</option>
                    <option value="Perda">Peraturan Daerah (Perda)</option>
                    <option value="Putusan">Putusan MK/MA</option>
                    <option value="Regulasi">Regulasi Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Nomor Dokumen <span className="text-[#E31B23]">*</span></label>
                  <input type="text" placeholder="Contoh: 1" className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Tahun <span className="text-[#E31B23]">*</span></label>
                  <input type="number" placeholder="2025" className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Instansi Penerbit <span className="text-[#E31B23]">*</span></label>
                <input type="text" placeholder="Contoh: DPR RI, Kementerian Hukum & HAM..." className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">File Dokumen (PDF) <span className="text-[#E31B23]">*</span></label>
                <div className="border-2 border-dashed border-[#E8EFF9] rounded-[10px] p-8 flex flex-col items-center justify-center bg-[#F4F6FA] hover:border-[#003087] transition-colors cursor-pointer group">
                  <UploadCloud size={32} className="text-[#8899AA] group-hover:text-[#003087] mb-2" />
                  <p className="text-[13px] font-bold text-[#0D1B3E]">Klik atau seret file PDF ke sini</p>
                  <p className="text-[11px] text-[#8899AA]">Maksimal ukuran file 20MB</p>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Tags / Kata Kunci</label>
                <input type="text" placeholder="Pisahkan dengan koma (contoh: Pidana, Korupsi, Ekonomi)" className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
              </div>
            </div>
            <div className="p-4 border-t border-[#E8EFF9] flex justify-end gap-3 bg-[#F4F6FA] shrink-0">
              <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 border border-[#E8EFF9] bg-white text-[#0D1B3E] rounded-[8px] text-[12px] font-bold hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={() => setIsUploadModalOpen(false)} className="px-6 py-2 bg-[#003087] text-white rounded-[8px] text-[12px] font-bold hover:bg-[#002266] transition-colors flex items-center gap-2">
                <Save size={14} /> Simpan & Publikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const dummySubscribers = [
  { id: 1, name: 'Maya Putri', email: 'maya@email.com', plan: 'Pro', status: 'Aktif', start: '15 Feb 2025', end: '15 Feb 2026', totalPaid: 'Rp1.200.000', avatar: 'M' },
  { id: 2, name: 'Budi Santoso', email: 'budi@email.com', plan: 'Free', status: 'Aktif', start: '01 Jan 2025', end: '-', totalPaid: 'Rp0', avatar: 'B' },
  { id: 3, name: 'Reza Firmansyah', email: 'reza@lawfirm.id', plan: 'Enterprise', status: 'Aktif', start: '10 Mar 2025', end: '10 Mar 2026', totalPaid: 'Rp15.000.000', avatar: 'R' },
  { id: 4, name: 'Santi Wulan', email: 'santi@email.com', plan: 'Pro', status: 'Expired', start: '01 Jan 2024', end: '01 Jan 2025', totalPaid: 'Rp1.200.000', avatar: 'S' },
  { id: 5, name: 'Andi Wijaya', email: 'andi@email.com', plan: 'Pro', status: 'Cancelled', start: '20 Feb 2025', end: '20 Mar 2025', totalPaid: 'Rp150.000', avatar: 'A' },
];

const dummyPlans = [
  { id: 'free', name: 'Free Plan', price: 'Rp0', duration: 'Selamanya', features: ['Akses Berita Dasar', 'Bookmark Terbatas', 'Newsletter Mingguan'] },
  { id: 'pro', name: 'Pro Plan', price: 'Rp150.000', duration: 'Bulan', features: ['Akses Investigasi', 'AI Legal Assistant (100/bln)', 'Dokumen Hukum PDF', 'Tanpa Iklan'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Rp1.500.000', duration: 'Bulan', features: ['Akses Tim (5 User)', 'AI Legal Assistant Unlimited', 'API Access', 'Prioritas Support'] },
];

const dummyTransactions = [
  { id: 'TRX-99281', user: 'Maya Putri', date: '15 Feb 2025', amount: 'Rp1.200.000', method: 'Virtual Account', status: 'Berhasil' },
  { id: 'TRX-99280', user: 'Reza Firmansyah', date: '10 Mar 2025', amount: 'Rp15.000.000', method: 'Bank Transfer', status: 'Berhasil' },
  { id: 'TRX-99279', user: 'Andi Wijaya', date: '20 Feb 2025', amount: 'Rp150.000', method: 'E-Wallet', status: 'Berhasil' },
  { id: 'TRX-99278', user: 'Unknown', date: '25 Mar 2025', amount: 'Rp150.000', method: 'Credit Card', status: 'Pending' },
  { id: 'TRX-99277', user: 'Santi Wulan', date: '01 Jan 2025', amount: 'Rp150.000', method: 'Virtual Account', status: 'Gagal' },
];

const SubscriptionPage = () => {
  const [activeTab, setActiveTab] = useState('subscribers');
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedSub, setSelectedSub] = useState<any>(null);

  const filteredSubs = dummySubscribers.filter(sub => {
    const matchSearch = sub.name.toLowerCase().includes(search.toLowerCase()) || sub.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'Semua' || sub.plan === planFilter;
    const matchStatus = statusFilter === 'Semua' || sub.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={18}/>} label="Total Subscriber Aktif" value="8,492" trend={5} color="#003087" />
        <StatCard icon={<DollarSign size={18}/>} label="Revenue Bulan Ini" value="Rp133,8Jt" trend={15} color="#10B981" />
        <StatCard icon={<TrendingDown size={18}/>} label="Churn Rate" value="2.4%" trend={-1} color="#E31B23" />
        <StatCard icon={<TrendingUp size={18}/>} label="Subscriber Baru" value="142" trend={8} color="#10B981" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8EFF9] bg-white px-4 pt-2 rounded-t-[10px] shadow-sm">
        {[
          { id: 'subscribers', label: 'Daftar Subscriber', icon: <Users size={14} /> },
          { id: 'plans', label: 'Paket Langganan', icon: <Package size={14} /> },
          { id: 'transactions', label: 'Riwayat Transaksi', icon: <HistoryIcon size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[12px] font-bold border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-[#003087] text-[#003087]' 
                : 'border-transparent text-[#8899AA] hover:text-[#0D1B3E]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-[#E8EFF9] border-t-0 rounded-b-[10px] p-6 shadow-sm min-h-[400px]">
        
        {/* TAB: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
                  <input 
                    type="text" 
                    placeholder="Cari nama/email..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[250px]" 
                  />
                </div>
                <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
                  <option value="Semua">Semua Paket</option>
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
                  <option value="Semua">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Expired">Expired</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button className="px-4 py-2 border border-[#E8EFF9] bg-white text-[#0D1B3E] rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <FileDown size={14} /> Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Subscriber</th>
                    <th className="p-3">Paket</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Mulai</th>
                    <th className="p-3">Berakhir</th>
                    <th className="p-3">Total Bayar</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFF9]">
                  {filteredSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#F4F6FA]/50 transition-colors cursor-pointer" onClick={() => setSelectedSub(sub)}>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EEF0FF] text-[#003087] flex items-center justify-center font-bold text-[10px]">{sub.avatar}</div>
                          <div>
                            <div className="font-bold text-[#0D1B3E]">{sub.name}</div>
                            <div className="text-[10px] text-[#8899AA]">{sub.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3"><StatusBadge status={sub.plan} /></td>
                      <td className="p-3"><StatusBadge status={sub.status} /></td>
                      <td className="p-3 text-[#0D1B3E]">{sub.start}</td>
                      <td className="p-3 text-[#0D1B3E]">{sub.end}</td>
                      <td className="p-3 font-bold text-[#0D1B3E]">{sub.totalPaid}</td>
                      <td className="p-3 text-center">
                        <button className="text-[#8899AA] hover:text-[#0D1B3E]"><MoreVertical size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Growth Chart Simulation */}
            <div className="mt-8 p-5 bg-[#F4F6FA] rounded-[10px] border border-[#E8EFF9]">
              <h3 className="text-[14px] font-bold text-[#0D1B3E] mb-4">Pertumbuhan Subscriber (12 Bulan Terakhir)</h3>
              <div className="h-[150px] w-full flex items-end gap-1">
                {[40, 45, 42, 50, 55, 60, 58, 65, 70, 75, 80, 85].map((val, i) => (
                  <div key={i} className="flex-1 bg-[#003087]/20 rounded-t-sm relative group">
                    <div className="absolute bottom-0 w-full bg-[#003087] rounded-t-sm transition-all" style={{ height: `${val}%` }}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-[#8899AA] mt-2 font-bold">
                <span>APR 24</span>
                <span>OKT 24</span>
                <span>MAR 25</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PLANS */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {dummyPlans.map((plan) => (
              <div key={plan.id} className="bg-white border border-[#E8EFF9] rounded-[12px] p-6 shadow-sm flex flex-col hover:border-[#003087] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[16px] font-black text-[#0D1B3E]">{plan.name}</h3>
                    <div className="text-[24px] font-black text-[#003087] mt-1">{plan.price} <span className="text-[12px] font-medium text-[#8899AA]">/ {plan.duration}</span></div>
                  </div>
                  <button className="p-2 text-[#8899AA] hover:text-[#003087] hover:bg-[#EEF0FF] rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                </div>
                <div className="space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] text-[#4A5568]">
                      <Check size={14} className="text-[#10B981] shrink-0" /> {f}
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-2.5 bg-[#F4F6FA] text-[#0D1B3E] rounded-[8px] text-[12px] font-bold hover:bg-[#003087] hover:text-white transition-all">
                  Kelola Fitur
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">ID Transaksi</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Jumlah</th>
                    <th className="p-3">Metode</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFF9]">
                  {dummyTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-[#F4F6FA]/50 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-[#8899AA]">{trx.id}</td>
                      <td className="p-3 font-bold text-[#0D1B3E]">{trx.user}</td>
                      <td className="p-3 text-[#0D1B3E]">{trx.date}</td>
                      <td className="p-3 font-black text-[#0D1B3E]">{trx.amount}</td>
                      <td className="p-3 text-[#8899AA]">{trx.method}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                          trx.status === 'Berhasil' ? 'bg-[#E8F5EE] text-[#1A8C5B]' : 
                          trx.status === 'Pending' ? 'bg-[#FFF6E0] text-[#C47A00]' : 'bg-[#FFEBEB] text-[#C41A1A]'
                        }`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-[#8899AA] hover:text-[#003087] px-2"><Eye size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Subscriber Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[16px] text-[#0D1B3E] flex items-center gap-2"><User size={18}/> Detail Subscriber</h2>
              <button onClick={() => setSelectedSub(null)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div className="flex items-center gap-4 p-4 bg-[#F4F6FA] rounded-[12px] border border-[#E8EFF9]">
                <div className="w-16 h-16 rounded-full bg-[#003087] text-white flex items-center justify-center text-[24px] font-black">{selectedSub.avatar}</div>
                <div>
                  <h3 className="text-[20px] font-black text-[#0D1B3E]">{selectedSub.name}</h3>
                  <p className="text-[13px] text-[#8899AA]">{selectedSub.email}</p>
                  <div className="flex gap-2 mt-2">
                    <StatusBadge status={selectedSub.plan} />
                    <StatusBadge status={selectedSub.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-[#E8EFF9] rounded-[10px]">
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Masa Langganan</div>
                  <div className="text-[13px] font-bold text-[#0D1B3E]">{selectedSub.start} — {selectedSub.end}</div>
                </div>
                <div className="p-4 border border-[#E8EFF9] rounded-[10px]">
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Total Kontribusi</div>
                  <div className="text-[13px] font-bold text-[#10B981]">{selectedSub.totalPaid}</div>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><Wallet size={14}/> Fitur yang Diakses</h4>
                <div className="flex flex-wrap gap-2">
                  {['Investigasi', 'AI Legal Assistant', 'Download PDF', 'Newsletter Premium'].map((f, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#EEF0FF] text-[#003087] text-[11px] font-bold rounded-full">{f}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><HistoryIcon size={14}/> Riwayat Pembayaran Terakhir</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white border border-[#E8EFF9] rounded-[8px]">
                    <div>
                      <div className="text-[12px] font-bold text-[#0D1B3E]">Perpanjangan Paket Pro</div>
                      <div className="text-[10px] text-[#8899AA]">15 Feb 2025 · Virtual Account</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-black text-[#0D1B3E]">Rp150.000</div>
                      <div className="text-[9px] font-bold text-[#1A8C5B]">BERHASIL</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FFEBEB] rounded-[10px] border border-[#FFCDD2]">
                <h4 className="text-[12px] font-bold text-[#C41A1A] mb-2">Manajemen Langganan</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-white border border-[#FFCDD2] text-[#C41A1A] rounded-[8px] text-[11px] font-bold hover:bg-red-50">Batalkan Langganan</button>
                  <button className="px-4 py-2 bg-[#003087] text-white rounded-[8px] text-[11px] font-bold hover:bg-[#002266]">Upgrade ke Enterprise</button>
                  <button className="px-4 py-2 bg-white border border-[#E8EFF9] text-[#0D1B3E] rounded-[8px] text-[11px] font-bold hover:bg-gray-50">Kirim Invoice</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const dummyAds = [
  {
    id: 'AD-2025-001',
    name: 'Banner Utama Ramadhan',
    client: 'Bank Syariah Indonesia',
    position: 'Header Utama',
    type: 'Image',
    status: 'Aktif',
    startDate: '01 Mar 2025',
    endDate: '31 Mar 2025',
    impressions: 125400,
    clicks: 3420,
    ctr: '2.7%',
    targetUrl: 'https://bsi.co.id/promo-ramadhan',
    image: 'https://picsum.photos/seed/ads1/800/200',
    history: [
      { date: '01 Mar 2025', action: 'Iklan diaktifkan oleh Admin' },
      { date: '15 Mar 2025', action: 'Update target URL oleh Admin' }
    ],
    targeting: {
      device: 'Mobile, Desktop',
      category: 'Hukum, Kebijakan'
    }
  },
  {
    id: 'AD-2025-002',
    name: 'Sidebar Properti Legal',
    client: 'Lippo Karawaci',
    position: 'Sidebar Kanan',
    type: 'Script/HTML',
    status: 'Scheduled',
    startDate: '01 Apr 2025',
    endDate: '30 Apr 2025',
    impressions: 0,
    clicks: 0,
    ctr: '0%',
    targetUrl: 'https://lippo.com/legal-property',
    image: null,
    history: [
      { date: '20 Mar 2025', action: 'Iklan dijadwalkan oleh Admin' }
    ],
    targeting: {
      device: 'Desktop',
      category: 'Properti, Investasi'
    }
  },
  {
    id: 'AD-2025-003',
    name: 'In-Article Hukum Waris',
    client: 'Asuransi Prudential',
    position: 'Dalam Artikel',
    type: 'Image',
    status: 'Aktif',
    startDate: '10 Feb 2025',
    endDate: '10 Mei 2025',
    impressions: 89200,
    clicks: 1560,
    ctr: '1.7%',
    targetUrl: 'https://prudential.co.id/waris-protection',
    image: 'https://picsum.photos/seed/ads3/400/300',
    history: [
      { date: '10 Feb 2025', action: 'Iklan diaktifkan' }
    ],
    targeting: {
      device: 'Mobile',
      category: 'Keluarga, Perdata'
    }
  },
  {
    id: 'AD-2025-004',
    name: 'Popup Newsletter',
    client: 'Internal Media',
    position: 'Popup/Overlay',
    type: 'HTML',
    status: 'Paused',
    startDate: '01 Jan 2025',
    endDate: '31 Des 2025',
    impressions: 45000,
    clicks: 2100,
    ctr: '4.6%',
    targetUrl: '/subscribe',
    image: null,
    history: [
      { date: '01 Jan 2025', action: 'Iklan diaktifkan' },
      { date: '24 Mar 2025', action: 'Iklan dihentikan sementara (Maintenance)' }
    ],
    targeting: {
      device: 'All',
      category: 'All'
    }
  },
  {
    id: 'AD-2025-005',
    name: 'Footer Partner',
    client: 'HukumOnline',
    position: 'Footer',
    type: 'Image',
    status: 'Ended',
    startDate: '01 Jan 2025',
    endDate: '28 Feb 2025',
    impressions: 210000,
    clicks: 1200,
    ctr: '0.5%',
    targetUrl: 'https://hukumonline.com',
    image: 'https://picsum.photos/seed/ads5/200/50',
    history: [
      { date: '01 Jan 2025', action: 'Iklan diaktifkan' },
      { date: '28 Feb 2025', action: 'Iklan berakhir otomatis' }
    ],
    targeting: {
      device: 'All',
      category: 'All'
    }
  }
];

const AdsManagementPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [positionFilter, setPositionFilter] = useState('Semua');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);

  const filteredAds = dummyAds.filter(ad => {
    const matchSearch = ad.name.toLowerCase().includes(search.toLowerCase()) || ad.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Semua' || ad.status === statusFilter;
    const matchPosition = positionFilter === 'Semua' || ad.position === positionFilter;
    return matchSearch && matchStatus && matchPosition;
  });

  const AdStatusBadge = ({ status }: { status: string }) => {
    let bg = '#F3F4F6', text = '#6B7280';
    if (status === 'Aktif') { bg = '#E8F5EE'; text = '#1A8C5B'; }
    else if (status === 'Scheduled') { bg = '#EEF0FF'; text = '#4A5FD4'; }
    else if (status === 'Paused') { bg = '#FFF6E0'; text = '#C47A00'; }
    else if (status === 'Ended') { bg = '#FFEBEB'; text = '#C41A1A'; }
    return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: bg, color: text }}>{status}</span>;
  };

  const performanceData = [
    { name: 'Sen', imp: 12000, click: 320 },
    { name: 'Sel', imp: 15000, click: 410 },
    { name: 'Rab', imp: 11000, click: 280 },
    { name: 'Kam', imp: 18000, click: 520 },
    { name: 'Jum', imp: 22000, click: 630 },
    { name: 'Sab', imp: 19000, click: 550 },
    { name: 'Min', imp: 25000, click: 720 },
  ];

  return (
    <div className="space-y-4 relative">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Megaphone size={18}/>} label="Iklan Aktif" value="12" color="#003087" />
        <StatCard icon={<Eye size={18}/>} label="Total Impressions" value="1.2M" trend={15} color="#4A148C" />
        <StatCard icon={<MousePointer2 size={18}/>} label="Total Clicks" value="45.2K" trend={8} color="#10B981" />
        <StatCard icon={<TrendingUp size={18}/>} label="Avg. CTR" value="3.2%" trend={2} color="#F59E0B" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2">
            <Plus size={14} /> Buat Iklan Baru
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
            <input type="text" placeholder="Cari iklan/klien..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[200px]" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Paused">Paused</option>
            <option value="Ended">Ended</option>
          </select>
          <select value={positionFilter} onChange={e => setPositionFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
            <option value="Semua">Semua Posisi</option>
            <option value="Header Utama">Header Utama</option>
            <option value="Sidebar Kanan">Sidebar Kanan</option>
            <option value="Dalam Artikel">Dalam Artikel</option>
            <option value="Popup/Overlay">Popup/Overlay</option>
            <option value="Footer">Footer</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8EFF9] rounded-[10px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nama Iklan & Klien</th>
                <th className="p-3">Posisi</th>
                <th className="p-3">Tipe</th>
                <th className="p-3">Status</th>
                <th className="p-3">Periode</th>
                <th className="p-3 text-center">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EFF9]">
              {filteredAds.map((ad, i) => (
                <tr key={i} onClick={() => setSelectedAd(ad)} className="hover:bg-[#F4F6FA]/50 transition-colors cursor-pointer">
                  <td className="p-3 font-mono text-[11px] text-[#8899AA]">{ad.id}</td>
                  <td className="p-3">
                    <div className="font-bold text-[#0D1B3E]">{ad.name}</div>
                    <div className="text-[10px] text-[#8899AA]">{ad.client}</div>
                  </td>
                  <td className="p-3 text-[#0D1B3E] font-medium">{ad.position}</td>
                  <td className="p-3 text-[#8899AA]">{ad.type}</td>
                  <td className="p-3"><AdStatusBadge status={ad.status} /></td>
                  <td className="p-3 text-[#8899AA] text-[11px]">
                    {ad.startDate} — {ad.endDate}
                  </td>
                  <td className="p-3 text-center font-bold text-[#003087]">{ad.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-[#E8EFF9] flex items-center justify-between text-[11px] text-[#8899AA]">
          <div>Menampilkan {filteredAds.length} data</div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-100 rounded opacity-50"><ChevronLeft size={14}/></button>
            <button className="w-6 h-6 bg-[#003087] text-white rounded font-bold">1</button>
            <button className="p-1 hover:bg-gray-100 rounded opacity-50"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>

      {/* Detail Slide-over */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[14px] text-[#0D1B3E]">Detail & Performa Iklan</h2>
              <button onClick={() => setSelectedAd(null)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[11px] text-[#8899AA]">{selectedAd.id}</span>
                  <AdStatusBadge status={selectedAd.status} />
                </div>
                <h3 className="text-[18px] font-black text-[#0D1B3E] leading-tight">{selectedAd.name}</h3>
                <p className="text-[13px] text-[#8899AA] font-bold uppercase tracking-wider">{selectedAd.client}</p>
              </div>

              {/* Performance Chart */}
              <div className="bg-[#F4F6FA] p-4 rounded-[10px] border border-[#E8EFF9]">
                <h4 className="text-[12px] font-bold text-[#0D1B3E] mb-4 flex items-center gap-2"><Activity size={14}/> Performa 7 Hari Terakhir</h4>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#003087" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#003087" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFF9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8899AA'}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="imp" stroke="#003087" strokeWidth={2} fillOpacity={1} fill="url(#colorImp)" />
                      <Area type="monotone" dataKey="click" stroke="#10B981" strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center">
                    <div className="text-[9px] text-[#8899AA] uppercase font-bold">Impressions</div>
                    <div className="text-[14px] font-black text-[#0D1B3E]">{selectedAd.impressions.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-[#8899AA] uppercase font-bold">Clicks</div>
                    <div className="text-[14px] font-black text-[#0D1B3E]">{selectedAd.clicks.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-[#8899AA] uppercase font-bold">CTR</div>
                    <div className="text-[14px] font-black text-[#10B981]">{selectedAd.ctr}</div>
                  </div>
                </div>
              </div>

              {/* Ad Preview */}
              {selectedAd.image && (
                <div>
                  <h4 className="text-[12px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><Eye size={14}/> Preview Kreatif</h4>
                  <div className="border border-[#E8EFF9] rounded-[8px] overflow-hidden bg-gray-50">
                    <img src={selectedAd.image} alt="Ad Preview" className="w-full h-auto object-contain" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}

              {/* Config & Targeting */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-[#E8EFF9] rounded-[8px]">
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Posisi</div>
                  <div className="text-[12px] font-bold text-[#0D1B3E]">{selectedAd.position}</div>
                </div>
                <div className="p-3 bg-white border border-[#E8EFF9] rounded-[8px]">
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Tipe</div>
                  <div className="text-[12px] font-bold text-[#0D1B3E]">{selectedAd.type}</div>
                </div>
                <div className="p-3 bg-white border border-[#E8EFF9] rounded-[8px]">
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Target Device</div>
                  <div className="text-[12px] font-bold text-[#0D1B3E]">{selectedAd.targeting.device}</div>
                </div>
                <div className="p-3 bg-white border border-[#E8EFF9] rounded-[8px]">
                  <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Kategori</div>
                  <div className="text-[12px] font-bold text-[#0D1B3E]">{selectedAd.targeting.category}</div>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E8EFF9] rounded-[8px]">
                <div className="text-[10px] text-[#8899AA] uppercase font-bold mb-1">Target URL</div>
                <div className="text-[12px] font-bold text-[#003087] break-all flex items-center gap-1">
                  <LinkIcon size={12}/> {selectedAd.targetUrl}
                </div>
              </div>

              {/* History */}
              <div>
                <h4 className="text-[12px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><History size={14}/> Riwayat Perubahan</h4>
                <div className="space-y-3">
                  {selectedAd.history.map((h: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#003087] mt-1.5 shrink-0"></div>
                      <div>
                        <div className="text-[11px] font-bold text-[#0D1B3E]">{h.action}</div>
                        <div className="text-[10px] text-[#8899AA]">{h.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button className="flex-1 bg-[#003087] text-white py-2 rounded-[8px] text-[12px] font-bold hover:bg-[#002266]">Edit Iklan</button>
                <button className="px-4 py-2 border border-[#FFCDD2] text-[#C41A1A] rounded-[8px] text-[12px] font-bold hover:bg-red-50">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[16px] text-[#0D1B3E]">Buat Iklan Baru</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Nama Iklan <span className="text-[#E31B23]">*</span></label>
                  <input type="text" placeholder="Contoh: Banner Ramadhan" className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Klien / Pengiklan <span className="text-[#E31B23]">*</span></label>
                  <input type="text" placeholder="Nama perusahaan..." className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Posisi Iklan <span className="text-[#E31B23]">*</span></label>
                  <select className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                    <option value="Header Utama">Header Utama</option>
                    <option value="Sidebar Kanan">Sidebar Kanan</option>
                    <option value="Dalam Artikel">Dalam Artikel</option>
                    <option value="Popup/Overlay">Popup/Overlay</option>
                    <option value="Footer">Footer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Tipe Konten <span className="text-[#E31B23]">*</span></label>
                  <select className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                    <option value="Image">Image (JPG/PNG/GIF)</option>
                    <option value="HTML">Custom HTML</option>
                    <option value="Script">Third-party Script (AdSense/etc)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Upload Kreatif / Input Script <span className="text-[#E31B23]">*</span></label>
                <div className="border-2 border-dashed border-[#E8EFF9] rounded-[8px] p-8 text-center hover:border-[#003087] transition-colors cursor-pointer">
                  <UploadCloud size={32} className="mx-auto text-[#8899AA] mb-2" />
                  <p className="text-[12px] font-bold text-[#0D1B3E]">Klik atau drag file ke sini</p>
                  <p className="text-[10px] text-[#8899AA]">Maksimal 2MB. Rekomendasi: 728x90px untuk Header.</p>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Target URL <span className="text-[#E31B23]">*</span></label>
                <input type="url" placeholder="https://..." className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Tanggal Mulai <span className="text-[#E31B23]">*</span></label>
                  <input type="date" className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Tanggal Berakhir <span className="text-[#E31B23]">*</span></label>
                  <input type="date" className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Target Device</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 text-[12px]"><input type="checkbox" defaultChecked /> Desktop</label>
                    <label className="flex items-center gap-2 text-[12px]"><input type="checkbox" defaultChecked /> Mobile</label>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1">Limit (Opsional)</label>
                  <input type="number" placeholder="Maks. Impressions" className="w-full px-3 py-2 rounded-[6px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#E8EFF9] flex justify-end gap-3 bg-[#F4F6FA] shrink-0">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-[#E8EFF9] bg-white text-[#0D1B3E] rounded-[6px] text-[12px] font-bold hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-[#003087] text-white rounded-[6px] text-[12px] font-bold hover:bg-[#002266] transition-colors">Simpan & Aktifkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const systemLogs = [
  { id: 1, timestamp: '2026-03-25 13:45:22', type: 'Info', message: 'Admin login successful', user: 'gecl.hse@gmail.com' },
  { id: 2, timestamp: '2026-03-25 13:30:10', type: 'Warning', message: 'Failed login attempt from IP 182.1.44.12', user: 'Unknown' },
  { id: 3, timestamp: '2026-03-25 12:15:05', type: 'Error', message: 'Database connection timeout', user: 'System' },
  { id: 4, timestamp: '2026-03-25 11:00:00', type: 'Info', message: 'Automatic backup completed', user: 'System' },
  { id: 5, timestamp: '2026-03-25 10:45:33', type: 'Info', message: 'Article #124 updated', user: 'Ahmad Dhani' },
  { id: 6, timestamp: '2026-03-25 09:20:11', type: 'Warning', message: 'High CPU usage detected (85%)', user: 'System' },
  { id: 7, timestamp: '2026-03-25 08:05:44', type: 'Info', message: 'New user registered: santi@email.com', user: 'System' },
];

const backupHistory = [
  { id: 1, date: '2026-03-25 00:00:00', size: '156 MB', type: 'Auto', status: 'Success' },
  { id: 2, date: '2026-03-24 00:00:00', size: '154 MB', type: 'Auto', status: 'Success' },
  { id: 3, date: '2026-03-23 15:30:00', size: '152 MB', type: 'Manual', status: 'Success' },
  { id: 4, date: '2026-03-23 00:00:00', size: '152 MB', type: 'Auto', status: 'Success' },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('umum');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const tabs = [
    { id: 'umum', label: 'Umum', icon: <Globe size={14} /> },
    { id: 'email', label: 'Email & Notifikasi', icon: <Mail size={14} /> },
    { id: 'keamanan', label: 'Keamanan', icon: <Shield size={14} /> },
    { id: 'backup', label: 'Backup & Maintenance', icon: <HardDrive size={14} /> },
    { id: 'log', label: 'Log Sistem', icon: <Terminal size={14} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-black text-[#0D1B3E] tracking-tight">Pengaturan Sistem</h2>
          <p className="text-[12px] text-[#8899AA]">Konfigurasi global platform Jurnal Media Hukum</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-[#E8EFF9] text-[#0D1B3E] rounded-[8px] text-[12px] font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <RotateCcw size={14} /> Reset
          </button>
          <button className="px-4 py-2 bg-[#003087] text-white rounded-[8px] text-[12px] font-bold hover:bg-[#002266] transition-colors flex items-center gap-2 shadow-sm">
            <Save size={14} /> Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8EFF9] overflow-x-auto no-scrollbar bg-white rounded-t-[12px] px-2 shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-[12px] font-bold flex items-center gap-2 transition-all relative shrink-0 ${
              activeTab === tab.id ? 'text-[#003087]' : 'text-[#8899AA] hover:text-[#0D1B3E]'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#003087] rounded-t-full"></div>}
          </button>
        ))}
      </div>

      <div className="bg-white border-x border-b border-[#E8EFF9] rounded-b-[12px] p-6 shadow-sm">
        {activeTab === 'umum' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#0D1B3E]">Nama Aplikasi</label>
                  <input type="text" defaultValue="Jurnal Media Hukum" className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#0D1B3E]">Tagline / Slogan</label>
                  <input type="text" defaultValue="Portal Informasi & Investigasi Hukum Terpercaya" className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#0D1B3E]">Deskripsi Aplikasi</label>
                <textarea rows={3} className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] transition-colors resize-none" defaultValue="Platform media digital yang berfokus pada jurnalisme investigasi hukum, edukasi regulasi, dan bantuan hukum berbasis AI di Indonesia."></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#0D1B3E]">Bahasa Default</label>
                  <select className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English (US)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#0D1B3E]">Zona Waktu</label>
                  <select className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                    <option value="WIB">(GMT+07:00) Jakarta (WIB)</option>
                    <option value="WITA">(GMT+08:00) Makassar (WITA)</option>
                    <option value="WIT">(GMT+09:00) Jayapura (WIT)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#0D1B3E]">Format Tanggal</label>
                  <select className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD MMM YYYY">DD MMM YYYY</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 space-y-4">
                <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2">Fitur & Akses</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-[#F4F6FA] rounded-[8px]">
                    <div>
                      <div className="text-[12px] font-bold">Komentar Publik</div>
                      <div className="text-[10px] text-[#8899AA]">Izinkan pembaca berkomentar di artikel</div>
                    </div>
                    <button className="text-[#003087]"><ToggleRight size={28} /></button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F4F6FA] rounded-[8px]">
                    <div>
                      <div className="text-[12px] font-bold">Registrasi Publik</div>
                      <div className="text-[10px] text-[#8899AA]">Izinkan pengunjung mendaftar akun baru</div>
                    </div>
                    <button className="text-[#003087]"><ToggleRight size={28} /></button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F4F6FA] rounded-[8px]">
                    <div>
                      <div className="text-[12px] font-bold">Mode Maintenance</div>
                      <div className="text-[10px] text-[#8899AA]">Matikan akses publik untuk pemeliharaan</div>
                    </div>
                    <button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} className={isMaintenanceMode ? "text-[#E31B23]" : "text-gray-300"}>
                      {isMaintenanceMode ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F4F6FA] rounded-[8px]">
                    <div>
                      <div className="text-[12px] font-bold">Pencarian AI</div>
                      <div className="text-[10px] text-[#8899AA]">Aktifkan fitur tanya jawab hukum AI</div>
                    </div>
                    <button className="text-[#003087]"><ToggleRight size={28} /></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#0D1B3E]">Logo Utama</label>
                <div className="border-2 border-dashed border-[#E8EFF9] rounded-[12px] p-6 text-center hover:border-[#003087] transition-all cursor-pointer bg-[#F4F6FA]/30">
                  <div className="w-16 h-16 bg-[#003087] rounded-lg mx-auto mb-3 flex items-center justify-center text-white font-bold text-[20px]">JM</div>
                  <p className="text-[11px] font-bold text-[#0D1B3E]">Ganti Logo</p>
                  <p className="text-[9px] text-[#8899AA] mt-1">PNG/SVG, Maks 1MB. Rekomendasi 200x50px.</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#0D1B3E]">Favicon</label>
                <div className="border-2 border-dashed border-[#E8EFF9] rounded-[12px] p-6 text-center hover:border-[#003087] transition-all cursor-pointer bg-[#F4F6FA]/30">
                  <div className="w-8 h-8 bg-[#E31B23] rounded mx-auto mb-3 flex items-center justify-center text-white font-bold text-[12px]">J</div>
                  <p className="text-[11px] font-bold text-[#0D1B3E]">Ganti Favicon</p>
                  <p className="text-[9px] text-[#8899AA] mt-1">ICO/PNG, 32x32px atau 64x64px.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2 flex items-center gap-2">
                  <Server size={16} className="text-[#003087]" /> Konfigurasi SMTP
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#0D1B3E]">SMTP Host</label>
                    <input type="text" defaultValue="smtp.gmail.com" className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#0D1B3E]">SMTP Port</label>
                    <input type="text" defaultValue="587" className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#0D1B3E]">Username</label>
                    <input type="text" defaultValue="noreply@jurnalmedia.id" className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#0D1B3E]">Password</label>
                    <div className="relative">
                      <input type="password" defaultValue="••••••••••••" className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8899AA]"><EyeOff size={14} /></button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#0D1B3E]">Enkripsi</label>
                    <select className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full px-4 py-2.5 bg-[#F4F6FA] text-[#0D1B3E] rounded-[8px] text-[12px] font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <Zap size={14} className="text-[#F59E0B]" /> Kirim Test Email
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2 flex items-center gap-2">
                  <Bell size={16} className="text-[#003087]" /> Notifikasi Email
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Artikel Baru', desc: 'Kirim email ke subscriber saat artikel baru terbit' },
                    { label: 'Pengaduan Masuk', desc: 'Notifikasi admin saat ada pengaduan baru' },
                    { label: 'Verifikasi Jurnalis', desc: 'Notifikasi admin saat ada pengajuan verifikasi' },
                    { label: 'Laporan Mingguan', desc: 'Kirim ringkasan statistik mingguan ke admin' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-[#E8EFF9] rounded-[8px] hover:bg-[#F4F6FA] transition-colors">
                      <div>
                        <div className="text-[12px] font-bold">{item.label}</div>
                        <div className="text-[10px] text-[#8899AA]">{item.desc}</div>
                      </div>
                      <button className="text-[#003087]"><ToggleRight size={24} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2">Template Email</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Welcome Email', 'Reset Password', 'Subscription Success', 'Verification Approved', 'New Report Alert'].map((tpl, i) => (
                  <div key={i} className="p-4 border border-[#E8EFF9] rounded-[10px] flex items-center justify-between hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#EEF0FF] text-[#4A5FD4] rounded-lg flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <span className="text-[12px] font-bold text-[#0D1B3E]">{tpl}</span>
                    </div>
                    <button className="p-1.5 text-[#8899AA] hover:text-[#003087] hover:bg-[#EEF0FF] rounded transition-all opacity-0 group-hover:opacity-100">
                      <Edit size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keamanan' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2 flex items-center gap-2">
                  <Lock size={16} className="text-[#003087]" /> Kebijakan Password & Sesi
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#0D1B3E]">Minimal Karakter</label>
                      <input type="number" defaultValue={8} className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#0D1B3E]">Durasi Sesi (Menit)</label>
                      <input type="number" defaultValue={60} className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-[#E8EFF9] rounded-[8px] cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#E8EFF9] text-[#003087]" />
                      <div>
                        <div className="text-[12px] font-bold">Wajib Karakter Spesial</div>
                        <div className="text-[10px] text-[#8899AA]">Password harus mengandung simbol (!@#$%^&*)</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-[#E8EFF9] rounded-[8px] cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#E8EFF9] text-[#003087]" />
                      <div>
                        <div className="text-[12px] font-bold">Wajib Angka</div>
                        <div className="text-[10px] text-[#8899AA]">Password harus mengandung minimal satu angka</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#003087]" /> Autentikasi & Akses
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#E8F5EE] border border-[#10B981]/20 rounded-[12px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#10B981] text-white rounded-full flex items-center justify-center">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1A8C5B]">Two-Factor Authentication (2FA)</div>
                        <div className="text-[11px] text-[#1A8C5B]/80">Wajibkan 2FA untuk seluruh akun Administrator</div>
                      </div>
                    </div>
                    <button onClick={() => setIs2FAEnabled(!is2FAEnabled)} className={is2FAEnabled ? "text-[#10B981]" : "text-gray-300"}>
                      {is2FAEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#0D1B3E]">Whitelist IP (Akses Admin)</label>
                    <textarea rows={2} placeholder="Masukkan IP dipisahkan koma (contoh: 192.168.1.1, 10.0.0.1)" className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] resize-none"></textarea>
                    <p className="text-[9px] text-[#8899AA]">Kosongkan untuk mengizinkan akses dari IP mana saja.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2">Log Login Terakhir Admin</h4>
              <div className="overflow-x-auto border border-[#E8EFF9] rounded-[10px]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#F4F6FA] text-[#8899AA] font-bold uppercase">
                    <tr>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Perangkat</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EFF9]">
                    {[
                      { user: 'gecl.hse@gmail.com', time: '2026-03-25 13:45', ip: '182.1.44.12', device: 'Chrome / Windows', status: 'Success' },
                      { user: 'admin_utama', time: '2026-03-25 10:20', ip: '36.72.190.4', device: 'Safari / macOS', status: 'Success' },
                      { user: 'gecl.hse@gmail.com', time: '2026-03-24 22:15', ip: '182.1.44.12', device: 'Chrome / Windows', status: 'Success' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-3 font-bold">{log.user}</td>
                        <td className="p-3 text-[#8899AA]">{log.time}</td>
                        <td className="p-3">{log.ip}</td>
                        <td className="p-3">{log.device}</td>
                        <td className="p-3"><StatusBadge status={log.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2 flex items-center gap-2">
                  <Database size={16} className="text-[#003087]" /> Backup Data
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#F4F6FA] rounded-[12px]">
                    <div>
                      <div className="text-[13px] font-bold">Backup Otomatis</div>
                      <div className="text-[11px] text-[#8899AA]">Cadangkan database secara berkala ke cloud storage</div>
                    </div>
                    <button className="text-[#003087]"><ToggleRight size={32} /></button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#0D1B3E]">Frekuensi Backup</label>
                    <select className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                      <option value="daily">Setiap Hari (00:00 WIB)</option>
                      <option value="weekly">Setiap Minggu (Minggu 00:00 WIB)</option>
                      <option value="monthly">Setiap Bulan (Tanggal 1 00:00 WIB)</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-3 bg-[#003087] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#002266] transition-all flex items-center justify-center gap-2 shadow-md">
                      <RefreshCw size={18} /> Backup Sekarang
                    </button>
                    <button className="px-4 py-3 bg-white border border-[#E8EFF9] text-[#0D1B3E] rounded-[10px] text-[13px] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                      <Trash2 size={18} className="text-[#E31B23]" /> Bersihkan Cache
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2 flex items-center gap-2">
                  <AlertCircle size={16} className="text-[#E31B23]" /> Mode Maintenance
                </h4>
                <div className="space-y-4">
                  <div className="p-4 border border-[#E31B23]/20 bg-[#FFEBEB] rounded-[12px]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[13px] font-bold text-[#C41A1A]">Status: {isMaintenanceMode ? 'AKTIF' : 'NON-AKTIF'}</div>
                      <button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} className={isMaintenanceMode ? "text-[#E31B23]" : "text-gray-300"}>
                        {isMaintenanceMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#C41A1A]/80 mb-4">Saat aktif, pengunjung akan melihat halaman pemeliharaan dan tidak dapat mengakses konten.</p>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#C41A1A]">Pesan Kustom Maintenance</label>
                      <textarea rows={2} className="w-full px-3 py-2 rounded-[8px] border border-[#E31B23]/20 text-[12px] outline-none focus:border-[#E31B23] resize-none" defaultValue="Mohon maaf, Jurnal Media Hukum sedang dalam pemeliharaan rutin. Kami akan segera kembali."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-[#0D1B3E] border-b border-[#E8EFF9] pb-2">Riwayat Backup</h4>
              <div className="overflow-x-auto border border-[#E8EFF9] rounded-[10px]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#F4F6FA] text-[#8899AA] font-bold uppercase">
                    <tr>
                      <th className="p-3">Waktu Backup</th>
                      <th className="p-3">Ukuran File</th>
                      <th className="p-3">Tipe</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EFF9]">
                    {backupHistory.map((b, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-3 font-bold">{b.date}</td>
                        <td className="p-3">{b.size}</td>
                        <td className="p-3">{b.type}</td>
                        <td className="p-3"><StatusBadge status={b.status} /></td>
                        <td className="p-3 text-right space-x-2">
                          <button className="p-1.5 text-[#003087] hover:bg-[#EEF0FF] rounded transition-all" title="Download"><Download size={14} /></button>
                          <button className="p-1.5 text-[#10B981] hover:bg-[#E8F5EE] rounded transition-all" title="Restore"><RefreshCw size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'log' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" size={14} />
                  <input type="text" placeholder="Cari log..." className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-full md:w-64" />
                </div>
                <select className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] bg-white">
                  <option value="">Semua Tipe</option>
                  <option value="Info">Info</option>
                  <option value="Warning">Warning</option>
                  <option value="Error">Error</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-white border border-[#E8EFF9] text-[#0D1B3E] rounded-[8px] text-[12px] font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <FileDown size={14} /> Export Log (.csv)
              </button>
            </div>

            <div className="overflow-x-auto border border-[#E8EFF9] rounded-[12px]">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#F4F6FA] text-[#8899AA] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Tipe</th>
                    <th className="p-4">Pesan Aktivitas</th>
                    <th className="p-4">User / Aktor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFF9]">
                  {systemLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-[#8899AA] font-mono text-[11px]">{log.timestamp}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase ${
                          log.type === 'Error' ? 'bg-[#FFEBEB] text-[#C41A1A]' :
                          log.type === 'Warning' ? 'bg-[#FFF6E0] text-[#C47A00]' :
                          'bg-[#EEF0FF] text-[#4A5FD4]'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="p-4 text-[#0D1B3E] font-medium">{log.message}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                            {log.user.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[11px]">{log.user}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between pt-4">
              <p className="text-[11px] text-[#8899AA]">Menampilkan 7 dari 1,240 log aktivitas</p>
              <div className="flex gap-2">
                <button className="p-2 border border-[#E8EFF9] rounded-[6px] hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeft size={14}/></button>
                <button className="p-2 border border-[#E8EFF9] rounded-[6px] hover:bg-gray-50"><ChevronRight size={14}/></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const visitorData = [
  { name: '18 Mar', visitors: 1200, views: 3400 },
  { name: '19 Mar', visitors: 1500, views: 4200 },
  { name: '20 Mar', visitors: 1100, views: 3100 },
  { name: '21 Mar', visitors: 1800, views: 5100 },
  { name: '22 Mar', visitors: 2200, views: 6300 },
  { name: '23 Mar', visitors: 1900, views: 5500 },
  { name: '24 Mar', visitors: 2500, views: 7200 },
];

const topArticlesData = [
  { name: 'KUHP Baru 2023', views: 12400 },
  { name: 'Hak Cipta AI', views: 9800 },
  { name: 'UU Cipta Kerja', views: 8500 },
  { name: 'Syarat Capres', views: 7200 },
  { name: 'Pajak Digital', views: 6100 },
  { name: 'Hukum Waris', views: 5400 },
  { name: 'Sengketa Tanah', views: 4900 },
  { name: 'Izin Usaha', views: 4200 },
  { name: 'KDRT & Hukum', views: 3800 },
  { name: 'Pencemaran Nama', views: 3100 },
];

const trafficSources = [
  { name: 'Organik', value: 45, color: '#003087' },
  { name: 'Langsung', value: 25, color: '#10B981' },
  { name: 'Social Media', value: 20, color: '#4A148C' },
  { name: 'Referral', value: 10, color: '#F59E0B' },
];

const aiUsageData = [
  { name: '18 Mar', queries: 450 },
  { name: '19 Mar', queries: 520 },
  { name: '20 Mar', queries: 480 },
  { name: '21 Mar', queries: 610 },
  { name: '22 Mar', queries: 750 },
  { name: '23 Mar', queries: 680 },
  { name: '24 Mar', queries: 820 },
];

const aiTopicsData = [
  { name: 'Pidana', value: 35 },
  { name: 'Perdata', value: 25 },
  { name: 'Keluarga', value: 15 },
  { name: 'Bisnis', value: 15 },
  { name: 'Ketenagakerjaan', value: 10 },
];

const provinceData = [
  { name: 'DKI Jakarta', value: '32%', count: '45.2k' },
  { name: 'Jawa Barat', value: '18%', count: '25.4k' },
  { name: 'Jawa Timur', value: '14%', count: '19.8k' },
  { name: 'Jawa Tengah', value: '12%', count: '16.9k' },
  { name: 'Sumatera Utara', value: '8%', count: '11.3k' },
  { name: 'Lainnya', value: '16%', count: '22.6k' },
];

const popularArticles = [
  { title: 'Analisis Mendalam KUHP Baru 2023', category: 'Pidana', views: '12,400', shares: '1,240', avgTime: '4m 32s' },
  { title: 'Panduan Hak Cipta Karya AI', category: 'Teknologi', views: '9,800', shares: '850', avgTime: '5m 10s' },
  { title: 'Dampak UU Cipta Kerja bagi Buruh', category: 'Ketenagakerjaan', views: '8,500', shares: '720', avgTime: '6m 15s' },
  { title: 'Syarat Usia Capres-Cawapres 2024', category: 'Politik', views: '7,200', shares: '2,100', avgTime: '3m 45s' },
  { title: 'Cara Lapor Pajak Digital 2025', category: 'Pajak', views: '6,100', shares: '430', avgTime: '7m 20s' },
];

const activeUsers = [
  { name: 'Maya Putri', articles: 42, comments: 15, time: '12h 45m' },
  { name: 'Budi Santoso', articles: 38, comments: 8, time: '10h 20m' },
  { name: 'Reza Firmansyah', articles: 35, comments: 24, time: '15h 10m' },
  { name: 'Santi Wulan', articles: 31, comments: 12, time: '9h 55m' },
  { name: 'Andi Wijaya', articles: 28, comments: 5, time: '8h 30m' },
];

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('30 Hari');

  return (
    <div className="space-y-6">
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-[18px] font-black text-[#0D1B3E]">Analytics & Insight</h2>
        <div className="flex items-center gap-2 bg-white p-1 rounded-[10px] border border-[#E8EFF9] shadow-sm">
          {['Hari Ini', '7 Hari', '30 Hari', 'Custom'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-1.5 rounded-[8px] text-[11px] font-bold transition-all ${
                dateRange === range 
                  ? 'bg-[#003087] text-white shadow-md' 
                  : 'text-[#8899AA] hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={18}/>} label="Total Pengunjung" value="142,840" trend={12} color="#003087" />
        <StatCard icon={<BookOpen size={18}/>} label="Artikel Dibaca" value="582,400" trend={8} color="#4A148C" />
        <StatCard icon={<MousePointer2 size={18}/>} label="Pengguna Aktif" value="12,450" trend={15} color="#10B981" />
        <StatCard icon={<Timer size={18}/>} label="Rerata Durasi Baca" value="5m 42s" trend={2} color="#F59E0B" />
      </div>

      {/* Visitor Trend Chart */}
      <div className="bg-white p-6 rounded-[10px] border border-[#E8EFF9] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[14px] font-bold text-[#0D1B3E]">Tren Pengunjung Harian</h3>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#003087]"></div> <span className="text-[#8899AA]">Pengunjung</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#10B981]"></div> <span className="text-[#8899AA]">Page Views</span></div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitorData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003087" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#003087" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFF9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8899AA'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8899AA'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#003087" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              <Area type="monotone" dataKey="views" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Articles Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[10px] border border-[#E8EFF9] shadow-sm">
          <h3 className="text-[14px] font-bold text-[#0D1B3E] mb-6">Top 10 Artikel Terpopuler</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topArticlesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8EFF9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#0D1B3E', fontWeight: 'bold'}} width={120} />
                <Tooltip 
                  cursor={{fill: '#F4F6FA'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="views" fill="#003087" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Pie Chart */}
        <div className="bg-white p-6 rounded-[10px] border border-[#E8EFF9] shadow-sm">
          <h3 className="text-[14px] font-bold text-[#0D1B3E] mb-6">Sumber Traffic</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {trafficSources.map((source, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }}></div>
                  <span className="text-[11px] font-bold text-[#0D1B3E]">{source.name}</span>
                </div>
                <span className="text-[11px] font-bold text-[#8899AA]">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Legal Usage Section */}
      <div className="bg-white p-6 rounded-[10px] border border-[#E8EFF9] shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-[#EEF0FF] text-[#003087] rounded-lg"><Zap size={18}/></div>
          <div>
            <h3 className="text-[14px] font-bold text-[#0D1B3E]">Penggunaan AI Legal Assistant</h3>
            <p className="text-[11px] text-[#8899AA]">Statistik interaksi chatbot hukum</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[250px]">
            <h4 className="text-[12px] font-bold text-[#8899AA] mb-4 uppercase tracking-wider">Query per Hari</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFF9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8899AA'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8899AA'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="queries" stroke="#4A148C" strokeWidth={3} dot={{ r: 4, fill: '#4A148C' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[250px]">
            <h4 className="text-[12px] font-bold text-[#8899AA] mb-4 uppercase tracking-wider">Topik Paling Sering Ditanyakan</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiTopicsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFF9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8899AA'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8899AA'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#4A148C" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Articles Table */}
        <div className="bg-white rounded-[10px] border border-[#E8EFF9] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-[#0D1B3E]">Artikel Terpopuler</h3>
            <button className="text-[11px] font-bold text-[#003087] hover:underline">Lihat Semua</button>
          </div>
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[9px] font-bold">
              <tr>
                <th className="p-3">Judul</th>
                <th className="p-3 text-center">Views</th>
                <th className="p-3 text-center">Shares</th>
                <th className="p-3 text-center">Avg. Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EFF9]">
              {popularArticles.map((art, i) => (
                <tr key={i} className="hover:bg-[#F4F6FA]/50 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-[#0D1B3E] line-clamp-1">{art.title}</div>
                    <div className="text-[9px] text-[#003087] font-bold uppercase">{art.category}</div>
                  </td>
                  <td className="p-3 text-center font-bold text-[#0D1B3E]">{art.views}</td>
                  <td className="p-3 text-center text-[#8899AA]">{art.shares}</td>
                  <td className="p-3 text-center text-[#8899AA]">{art.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Active Users Table */}
        <div className="bg-white rounded-[10px] border border-[#E8EFF9] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-[#0D1B3E]">Pengguna Paling Aktif</h3>
            <button className="text-[11px] font-bold text-[#003087] hover:underline">Lihat Semua</button>
          </div>
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[9px] font-bold">
              <tr>
                <th className="p-3">Nama</th>
                <th className="p-3 text-center">Artikel</th>
                <th className="p-3 text-center">Komentar</th>
                <th className="p-3 text-center">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EFF9]">
              {activeUsers.map((user, i) => (
                <tr key={i} className="hover:bg-[#F4F6FA]/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EEF0FF] text-[#003087] flex items-center justify-center font-bold text-[9px]">{user.name[0]}</div>
                      <div className="font-bold text-[#0D1B3E]">{user.name}</div>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-[#0D1B3E]">{user.articles}</td>
                  <td className="p-3 text-center text-[#8899AA]">{user.comments}</td>
                  <td className="p-3 text-center text-[#8899AA]">{user.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reader Distribution Section */}
      <div className="bg-white p-6 rounded-[10px] border border-[#E8EFF9] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#E8F5EE] text-[#10B981] rounded-lg"><Globe2 size={18}/></div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0D1B3E]">Sebaran Pembaca</h3>
              <p className="text-[11px] text-[#8899AA]">Distribusi geografis pengguna di Indonesia</p>
            </div>
          </div>
          <button className="text-[11px] font-bold text-[#003087] flex items-center gap-1.5 hover:underline">
            <Map size={14}/> Lihat Peta Detail
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#F4F6FA] rounded-[12px] p-8 flex items-center justify-center border border-[#E8EFF9]">
            {/* Map Placeholder */}
            <div className="text-center">
              <Map size={64} className="text-[#8899AA] opacity-20 mx-auto mb-4" />
              <p className="text-[12px] font-bold text-[#8899AA]">Interactive Map Visualization</p>
              <p className="text-[10px] text-[#8899AA]">Peta sebaran pembaca per provinsi</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[12px] font-bold text-[#0D1B3E] mb-2">Top Provinsi</h4>
            {provinceData.map((prov, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-[#0D1B3E]">{prov.name}</span>
                  <span className="text-[#8899AA]">{prov.count} ({prov.value})</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#003087] rounded-full" style={{ width: prov.value }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-[#8899AA]">
    <Settings size={48} className="mb-4 opacity-20" />
    <h2 className="text-[18px] font-bold text-[#0D1B3E] mb-2">{title}</h2>
    <p className="text-[12px]">Halaman ini sedang dalam pengembangan.</p>
  </div>
);

// --- MAIN LAYOUT & APP ---

export default function AdminPanel() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={14}/> },
    { id: 'cms-berita', label: 'CMS Berita', icon: <FileText size={14}/> },
    { id: 'investigasi', label: 'Investigasi', icon: <Search size={14}/> },
    { id: 'knowledge-rag', label: 'Knowledge RAG', icon: <BookOpen size={14}/> },
    { id: 'ai-legal-config', label: 'AI Legal Config', icon: <Bot size={14}/> },
    { id: 'dokumen-hukum', label: 'Dokumen Hukum', icon: <FileCheck size={14}/> },
    { id: 'manajemen-user', label: 'Manajemen User', icon: <Users size={14}/> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard size={14}/> },
    { id: 'pengaduan', label: 'Pengaduan', icon: <Megaphone size={14}/>, badge: '47' },
    { id: 'verif-jurnalis', label: 'Verif. Jurnalis', icon: <IdCard size={14}/>, badge: '3', badgeColor: '#F59E0B' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={14}/> },
    { id: 'manajemen-iklan', label: 'Manajemen Iklan', icon: <Megaphone size={14}/> },
    { id: 'pengaturan', label: 'Pengaturan Sistem', icon: <Settings size={14}/> },
  ];

  const pages: Record<string, React.ReactNode> = {
    'dashboard': <DashboardPage />,
    'cms-berita': <CMSBeritaPage />,
    'investigasi': <InvestigasiPage />,
    'knowledge-rag': <KnowledgeRAGPage />,
    'ai-legal-config': <AILegalConfigPage />,
    'dokumen-hukum': <DokumenHukumPage />,
    'manajemen-user': <ManajemenUserPage />,
    'subscription': <SubscriptionPage />,
    'pengaduan': <PengaduanPage />,
    'verif-jurnalis': <VerifJurnalisPage />,
    'analytics': <AnalyticsPage />,
    'manajemen-iklan': <AdsManagementPage />,
    'pengaturan': <SettingsPage />,
  };

  const activeTitle = menuItems.find(m => m.id === activePage)?.label || 'Admin Panel';

  return (
    <div className="flex h-screen bg-[#F4F6FA] font-sans text-[#0D1B3E] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[220px] bg-[#0D1B3E] text-white flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-14 bg-[#001A5E] flex items-center px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#E31B23] rounded flex items-center justify-center font-bold text-[10px]">JM</div>
            <div>
              <div className="font-bold text-[13px] leading-tight">Admin Panel</div>
              <div className="text-[9px] text-white/40">v1.0 · Admin Mode</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[6px] transition-colors ${
                activePage === item.id 
                  ? 'bg-white/12 text-white font-semibold' 
                  : 'text-white/75 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={activePage === item.id ? 'text-white' : 'text-white/75'}>{item.icon}</span>
                <span className="text-[11px]">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: item.badgeColor || '#E31B23', color: '#fff' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-white/10">
            <Link to="/workspace" className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-white/75 hover:bg-white/5 transition-colors">
              <ChevronLeft size={14}/>
              <span className="text-[11px]">Kembali ke Workspace</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[220px]">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-[#E8EFF9] flex items-center justify-between px-4 lg:px-6 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[#8899AA]" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-[14px] font-bold text-[#0D1B3E]">{activeTitle}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative text-[#8899AA] hover:text-[#0D1B3E]">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E31B23] text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-white">5</span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-[#E8EFF9]">
              <div className="w-7 h-7 rounded-full bg-[#0D1B3E] text-white flex items-center justify-center text-[10px] font-bold">AD</div>
              <div className="hidden md:block text-[11px] font-medium">Admin Utama</div>
              <button className="text-[#8899AA] hover:text-[#E31B23] ml-2"><LogOut size={14}/></button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {pages[activePage]}
        </main>
      </div>
    </div>
  );
}
