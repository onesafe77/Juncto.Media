import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { processDocument, searchContext, syncAllCMSData, scrapeAndIndexURL, getDocumentChunks, deleteDocument, crawlPeraturanUU, crawlJDIHN, crawlHukumOnline } from '../lib/rag';
import FullScreenLoader from '../components/FullScreenLoader';
import InvestigasiPage from '../components/InvestigasiPage';
import AdminDokumenHukum from '../components/AdminDokumenHukum';

// --- REUSABLE COMPONENTS ---

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
            {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(trend)}%
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
                {onAction ? (
                  onAction(row)
                ) : (
                  <button className="text-[#8899AA] hover:text-[#0D1B3E] px-2">···</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="p-3 border-t border-[#E8EFF9] flex items-center justify-between text-[11px] text-[#8899AA]">
      <div>Menampilkan 1-{data.length} dari {data.length} data</div>
      <div className="flex items-center gap-1">
        <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14} /></button>
        <button className="w-6 h-6 bg-[#003087] text-white rounded font-bold">1</button>
        <button className="w-6 h-6 hover:bg-gray-100 rounded">2</button>
        <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={14} /></button>
      </div>
    </div>
  </div>
);

// --- PAGES ---

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalInvestigasi: 0,
    totalUsers: 0,
    totalReports: 0,
    premiumUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: artCount },
          { count: invCount },
          { count: usrCount },
          { count: repCount }
        ] = await Promise.all([
          supabase.from('articles').select('*', { count: 'exact', head: true }),
          supabase.from('investigations').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('reports').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          totalArticles: artCount || 0,
          totalInvestigasi: invCount || 0,
          totalUsers: usrCount || 0,
          totalReports: repCount || 0,
          premiumUsers: 0
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#003087]" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FileText size={18} />} label="Total Artikel" value={stats.totalArticles.toLocaleString()} trend={12} />
        <StatCard icon={<Search size={18} />} label="Investigasi" value={stats.totalInvestigasi.toString()} color="#4A148C" />
        <StatCard icon={<Users size={18} />} label="Total User" value={stats.totalUsers.toLocaleString()} trend={5} color="#10B981" />
        <StatCard icon={<CreditCard size={18} />} label="Premium" value={stats.premiumUsers.toString()} trend={8} color="#F59E0B" />

        <StatCard icon={<BarChart3 size={18} />} label="Revenue" value="Rp0" color="#10B981" />
        <StatCard icon={<Megaphone size={18} />} label="Pengaduan" value={<>{stats.totalReports} <span className="w-2 h-2 rounded-full bg-[#E31B23] inline-block ml-1"></span></>} color="#E31B23" />
        <StatCard icon={<IdCard size={18} />} label="Jurnalis" value="0" color="#F59E0B" />
        <StatCard icon={<Bot size={18} />} label="RAG Chunks" value="0" color="#003087" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E8EFF9] rounded-[10px] p-5 shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <Activity className="w-12 h-12 text-[#E8EFF9] mb-4" />
          <h3 className="text-[14px] font-bold text-[#0D1B3E] mb-1">Aktivitas Terbaru</h3>
          <p className="text-[12px] text-[#8899AA] text-center max-w-xs italic">Hubungkan analytics untuk melihat grafik aktivitas secara real-time.</p>
        </div>
        <div className="bg-white border border-[#E8EFF9] rounded-[10px] p-5 shadow-sm space-y-6">
          <h3 className="text-[14px] font-bold text-[#0D1B3E]">Ringkasan Sistem</h3>
          <div className="space-y-4">
            <div className="p-3 bg-[#F4F6FA] rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-[#8899AA] uppercase tracking-wider">Database Status</span>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Connected</span>
              </div>
              <div className="text-[12px] text-[#0D1B3E] font-medium flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" /> Supabase PostgreSQL
              </div>
            </div>

            <div className="p-3 bg-[#F4F6FA] rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-[#8899AA] uppercase tracking-wider">AI Engine</span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Online</span>
              </div>
              <div className="text-[12px] text-[#0D1B3E] font-medium flex items-center gap-2">
                <Cpu size={14} className="text-blue-500" /> OpenRouter (Gemini 2.0)
              </div>
            </div>

            <div className="p-3 bg-[#F4F6FA] rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-[#8899AA] uppercase tracking-wider">Auth Service</span>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Active</span>
              </div>
              <div className="text-[12px] text-[#0D1B3E] font-medium flex items-center gap-2">
                <ShieldCheck size={14} className="text-purple-500" /> Supabase GoTrue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const CMSBeritaPage = () => {
  const { user } = useAuth();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [articleList, setArticleList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newArticle, setNewArticle] = useState<any>({
    title: '',
    category: 'Hukum',
    status: 'Draft',
    is_premium: false,
    content: '',
    tags: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function fetchArticles() {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArticleList(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  const openWriteModal = (article: any = null) => {
    if (article) {
      setEditingArticle(article);
      setNewArticle({
        title: article.title,
        category: article.category,
        status: article.status,
        is_premium: article.is_premium,
        content: article.content,
        tags: article.tags || []
      });
      setImagePreview(article.image_url);
    } else {
      setEditingArticle(null);
      setNewArticle({
        title: '',
        category: 'Hukum',
        status: 'Draft',
        is_premium: false,
        content: '',
        tags: []
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setIsPreviewMode(false);
    setIsWriteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update({
            ...newArticle,
            image_url: imageUrl || imagePreview,
          })
          .eq('id', editingArticle.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([{
            ...newArticle,
            image_url: imageUrl,
            author: user?.user_metadata?.full_name || 'Admin',
            author_id: user?.id,
            views: 0
          }]);

        if (error) throw error;
      }

      setIsWriteModalOpen(false);
      setNewArticle({
        title: '',
        category: 'Hukum',
        status: 'Draft',
        is_premium: false,
        content: '',
        tags: []
      });
      setImageFile(null);
      setImagePreview(null);
      fetchArticles();
    } catch (err: any) {
      alert('Error saving article: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus berita "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Refresh the list after deletion
        fetchArticles();
      } catch (err: any) {
        alert('Gagal menghapus berita: ' + err.message);
      }
    }
  };

  const columns = [
    {
      key: 'title', label: 'Judul & Rubrik', render: (val: string, row: any) => (
        <div>
          <div className="font-bold text-[#0D1B3E]">{val} {row.is_premium && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded ml-1">PREMIUM</span>}</div>
          <div className="text-[10px] text-[#8899AA]">{row.category}</div>
        </div>
      )
    },
    { key: 'author', label: 'Penulis' },
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'views', label: 'Views', render: (val: number) => (val || 0).toLocaleString() },
    { key: 'created_at', label: 'Tanggal', render: (val: string) => new Date(val).toLocaleDateString('id-ID') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => openWriteModal()}
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#003087]" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={articleList}
          onAction={(row: any) => (
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => openWriteModal(row)}
                className="text-[#8899AA] hover:text-[#003087] p-1.5 rounded-lg hover:bg-gray-100 transition-all text-center flex items-center justify-center"
                title="Edit Artikel"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleDelete(row.id, row.title)}
                className="text-[#8899AA] hover:text-[#E31B23] p-1.5 rounded-lg hover:bg-red-50 transition-all text-center flex items-center justify-center"
                title="Hapus Berita"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        />
      )}

      {/* Write Article Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[16px] text-[#0D1B3E] flex items-center gap-2">
                {editingArticle ? <Edit size={18} /> : <Plus size={18} />}
                {editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h2>
              <button onClick={() => setIsWriteModalOpen(false)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
              <div>
                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Judul Artikel <span className="text-[#E31B23]">*</span></label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Masukkan judul artikel..."
                  className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Rubrik <span className="text-[#E31B23]">*</span></label>
                  <select
                    value={newArticle.category}
                    onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}
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
                    onChange={e => setNewArticle({ ...newArticle, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Review">Review</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-bold text-[#0D163E] border-b border-[#E8EFF9] pb-1 grow">Isi & Media</label>
                  <div className="flex bg-[#F4F6FA] p-0.5 rounded-lg border border-[#E8EFF9]">
                    <button
                      onClick={() => setIsPreviewMode(false)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!isPreviewMode ? 'bg-[#003087] text-white shadow-sm' : 'text-[#8899AA] hover:text-[#0D1B3E]'}`}
                    >
                      Editor
                    </button>
                    <button
                      onClick={() => setIsPreviewMode(true)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${isPreviewMode ? 'bg-[#003087] text-white shadow-sm' : 'text-[#8899AA] hover:text-[#0D1B3E]'}`}
                    >
                      Pratinjau
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-3">
                    {!isPreviewMode ? (
                      <>
                        <label className="block text-[11px] font-bold text-[#8899AA] uppercase flex items-center justify-between">
                          <span>Konten Artikel <span className="text-[#E31B23]">*</span></span>
                          <span className="text-[10px] font-medium text-[#8899AA]">Markdown Aktif</span>
                        </label>
                        <textarea
                          value={newArticle.content}
                          onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                          rows={12}
                          placeholder="Tulis isi artikel di sini..."
                          className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] resize-none min-h-[300px]"
                        ></textarea>
                      </>
                    ) : (
                      <div className="bg-[#F4F6FA]/50 rounded-[8px] border border-[#E8EFF9] p-4 min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                        <div className="article-body scale-90 origin-top">
                          <ReactMarkdown>{newArticle.content || '*Belum ada konten...*'}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#8899AA] uppercase mb-1.5">Foto Cover</label>
                    <div className={`relative border-2 border-dashed rounded-[10px] aspect-[4/3] flex flex-col items-center justify-center transition-colors cursor-pointer group hover:bg-[#F4F6FA] ${imagePreview ? 'border-[#003087]' : 'border-[#E8EFF9]'}`}>
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[8px]" />
                          <button
                            onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={32} className="text-[#8899AA] group-hover:text-[#003087] mb-2" />
                          <p className="text-[11px] font-bold text-[#0D1B3E]">Pilih Foto</p>
                          <p className="text-[9px] text-[#8899AA]">JPG, PNG maks 2MB</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-[#8899AA] mt-2 italic">* Foto ini akan muncul sebagai cover berita di Beranda.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 bg-[#F4F6FA] rounded-xl border border-[#E8EFF9]">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D1B3E] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag size={14} className="text-[#003087]" /> Pilih Kriteria / Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Korupsi', 'Pidana Umum', 'Perdata', 'Mahkamah Agung', 'MK', 'KPK', 'Investigasi', 'Viral', 'Eksklusif'].map(tag => {
                      const isSelected = newArticle.tags?.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const currentTags = newArticle.tags || [];
                            if (isSelected) {
                              setNewArticle({ ...newArticle, tags: currentTags.filter((t: string) => t !== tag) });
                            } else {
                              setNewArticle({ ...newArticle, tags: [...currentTags, tag] });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-[8px] text-[11px] font-bold transition-all border ${isSelected
                            ? 'bg-[#003087] text-white border-[#003087] shadow-sm'
                            : 'bg-white text-[#8899AA] border-[#E8EFF9] hover:border-[#003087] hover:text-[#003087]'
                            }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8EFF9]">
                  <label className="block text-[10px] font-bold text-[#8899AA] mb-1.5 uppercase">Tambah Kriteria Kustom (Ketik & Enter)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newArticle.tags?.filter((t: string) => !['Korupsi', 'Pidana Umum', 'Perdata', 'Mahkamah Agung', 'MK', 'KPK', 'Investigasi', 'Viral', 'Eksklusif'].includes(t)).map((tag: string, idx: number) => (
                      <span key={idx} className="bg-[#003087]/10 text-[#003087] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        {tag}
                        <button onClick={() => setNewArticle({ ...newArticle, tags: newArticle.tags.filter((t: string) => t !== tag) })} className="hover:text-red-500"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: Politik, Ekonomi, Sosmed..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) {
                          const currentTags = newArticle.tags || [];
                          if (!currentTags.includes(val)) {
                            setNewArticle({ ...newArticle, tags: [...currentTags, val] });
                          }
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-[#E8EFF9] rounded-[8px] text-[12px] outline-none focus:border-[#003087]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-[8px]">
                <input
                  type="checkbox"
                  id="premium-check"
                  checked={newArticle.is_premium}
                  onChange={e => setNewArticle({ ...newArticle, is_premium: e.target.checked })}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="premium-check" className="text-[12px] font-medium text-amber-800 cursor-pointer">Tandai sebagai Artikel Premium (Hanya untuk pelanggan Pro/Enterprise)</label>
              </div>
            </div>
            <div className="p-4 border-t border-[#E8EFF9] flex justify-end gap-3 bg-[#F4F6FA] shrink-0">
              <button
                onClick={() => setIsWriteModalOpen(false)}
                disabled={saving}
                className="px-4 py-2 rounded-[8px] text-[12px] font-bold text-[#8899AA] hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!newArticle.title || !newArticle.content || saving}
                className="bg-[#003087] text-white px-6 py-2 rounded-[8px] text-[12px] font-bold hover:bg-[#002566] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <Loader2 size={12} className="animate-spin" />}
                {saving ? 'Menyimpan...' : (editingArticle ? 'Simpan Perubahan' : 'Simpan Artikel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ManajemenNotifikasiPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [sending, setSending] = useState(false);
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);

  useEffect(() => {
    fetchRecent();
  }, []);

  async function fetchRecent() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setRecentNotifs(data);
  }

  const handleSend = async () => {
    if (!title || !message) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          title,
          message,
          type,
          link: '/workspace'
        }]);

      if (error) throw error;

      setTitle('');
      setMessage('');
      alert('Notifikasi berhasil dikirim!');
      fetchRecent();
    } catch (err: any) {
      alert('Gagal mengirim: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white border border-[#E8EFF9] rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-[16px] text-[#0D1B3E] mb-4 flex items-center gap-2">
          <Megaphone className="text-[#003087]" size={18} /> Kirim Informasi Terbaru (Broadcast)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Judul Notifikasi</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Pembaruan Sistem Malam Ini"
              className="w-full px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Pesan / Informasi</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="Masukkan detail informasi yang ingin disampaikan..."
              className="w-full px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] resize-none"
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" checked={type === 'info'} onChange={() => setType('info')} className="text-[#003087]" />
                <span className="text-[12px]">Info</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" checked={type === 'warning'} onChange={() => setType('warning')} className="text-[#E31B23]" />
                <span className="text-[12px]">Pemuatan/Alert</span>
              </label>
            </div>
            <button
              onClick={handleSend}
              disabled={!title || !message || sending}
              className="bg-[#003087] text-white px-6 py-2 rounded-[8px] text-[12px] font-bold hover:bg-[#002566] transition-colors disabled:opacity-50"
            >
              {sending ? 'Mengirim...' : 'Kirim Sekarang'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8EFF9] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-[#F4F6FA] border-b border-[#E8EFF9]">
          <h4 className="font-bold text-[13px] text-[#0D1B3E]">Riwayat Notifikasi Terakhir</h4>
        </div>
        <div className="divide-y divide-[#E8EFF9]">
          {recentNotifs.length === 0 ? (
            <div className="p-8 text-center text-[#8899AA] text-[12px]">Belum ada riwayat notifikasi.</div>
          ) : (
            recentNotifs.map(n => (
              <div key={n.id} className="p-4 flex justify-between items-start gap-4">
                <div>
                  <div className="font-bold text-[13px] text-[#0D1B3E]">{n.title}</div>
                  <div className="text-[11px] text-[#8899AA] mt-1">{n.message}</div>
                  <div className="text-[9px] text-[#8899AA] mt-2">{new Date(n.created_at).toLocaleString('id-ID')}</div>
                </div>
                <StatusBadge status={n.type === 'info' ? 'Info' : 'Warning'} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


const ManajemenUserPage = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setUserList(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const columns = [
    {
      key: 'full_name', label: 'User', render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">{(val || 'U').charAt(0)}</div>
          <div>
            <div className="font-bold text-[#0D1B3E]">{val || 'Unnamed User'}</div>
            <div className="text-[10px] text-[#8899AA]">{row.id}</div>
          </div>
        </div>
      )
    },
    { key: 'role', label: 'Role', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'created_at', label: 'Bergabung', render: (val: string) => new Date(val).toLocaleDateString('id-ID') },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#003087]" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
          <input type="text" placeholder="Cari nama..." className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[250px]" />
        </div>
      </div>
      <DataTable columns={columns} data={userList} />
    </div>
  );
};


const PengaduanPage = () => {
  const [reportList, setReportList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewReport, setViewReport] = useState<any>(null);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setReportList(data);
      setLoading(false);
    }
    fetchReports();
  }, []);

  const columns = [
    { key: 'id', label: 'ID', render: (val: string) => <span className="font-mono text-[11px] text-[#8899AA]">{val}</span> },
    {
      key: 'title', label: 'Laporan', render: (val: string, row: any) => (
        <div>
          <div className="font-bold text-[#0D1B3E]">{val}</div>
          <div className="text-[10px] text-[#8899AA]">Kategori: {row.category} | Pelapor: {row.reporter_name}</div>
        </div>
      )
    },
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'created_at', label: 'Tanggal', render: (val: string) => new Date(val).toLocaleDateString('id-ID') },
    {
      key: 'id', label: 'Aksi', render: (val: string, row: any) => (
        <button onClick={() => setViewReport(row)} className="text-[11px] bg-[#EEF0FF] text-[#003087] px-3 py-1.5 rounded-lg font-bold hover:bg-[#003087] hover:text-white transition-colors">
          Lihat Detail
        </button>
      )
    }
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#003087]" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Megaphone size={18} />} label="Total Laporan" value={reportList.length.toString()} />
        <StatCard icon={<Megaphone size={18} />} label="Baru" value={reportList.filter(r => r.status === 'Baru').length.toString()} color="#E31B23" />
        <StatCard icon={<Check size={18} />} label="Selesai" value={reportList.filter(r => r.status === 'Selesai').length.toString()} color="#10B981" />
        <StatCard icon={<FileText size={18} />} label="Diproses" value={reportList.filter(r => r.status === 'Diproses').length.toString()} color="#003087" />
      </div>
      <DataTable columns={columns} data={reportList} />

      {/* Detail Modal */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA]">
              <h3 className="font-bold text-[#0D1B3E] text-[16px]">Detail Laporan: {viewReport.id}</h3>
              <button onClick={() => setViewReport(null)} className="text-[#8899AA] hover:text-[#0D1B3E]"><X size={18} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-[13px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[#8899AA] font-bold text-[10px] mb-1">Tanggal Masuk</div>
                  <div className="font-medium">{new Date(viewReport.created_at).toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <div className="text-[#8899AA] font-bold text-[10px] mb-1">Status Laporan</div>
                  <StatusBadge status={viewReport.status} />
                </div>
              </div>

              <div>
                <div className="text-[#8899AA] font-bold text-[10px] mb-1">Judul Laporan</div>
                <div className="text-[#0D1B3E] font-bold text-[15px]">{viewReport.title}</div>
              </div>

              <div className="bg-[#F4F6FA] p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[#8899AA] font-bold text-[10px] mb-0.5">Kategori</div>
                    <div className="font-medium text-[#003087] uppercase tracking-wider text-[11px]">{viewReport.category}</div>
                  </div>
                  <div>
                    <div className="text-[#8899AA] font-bold text-[10px] mb-0.5">Pihak Terlapor</div>
                    <div className="font-medium">{viewReport.terlapor || '-'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#E8EFF9]">
                  <div>
                    <div className="text-[#8899AA] font-bold text-[10px] mb-0.5">Nama Pelapor</div>
                    <div className="font-medium">{viewReport.reporter_name}</div>
                  </div>
                  <div>
                    <div className="text-[#8899AA] font-bold text-[10px] mb-0.5">Email</div>
                    <div className="font-medium">{viewReport.reporter_email || '-'}</div>
                  </div>
                  <div>
                    <div className="text-[#8899AA] font-bold text-[10px] mb-0.5">Telepon</div>
                    <div className="font-medium">{viewReport.reporter_phone || '-'}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[#8899AA] font-bold text-[10px] mb-2">Isi Laporan</div>
                <div className="bg-white border border-[#E8EFF9] rounded-lg p-4 text-[#4A5568] whitespace-pre-wrap leading-relaxed shadow-sm">
                  {viewReport.description}
                </div>
              </div>

              {viewReport.attachments && viewReport.attachments.length > 0 && (
                <div>
                  <div className="text-[#8899AA] font-bold text-[10px] mb-2">Lampiran Bukti</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {viewReport.attachments.map((file: any, idx: number) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 border border-[#E8EFF9] rounded-lg hover:border-[#003087] hover:bg-[#EEF0FF] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-[#F4F6FA] flex items-center justify-center text-[#003087] group-hover:bg-white">
                          <FileText size={14} />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-[11px] text-[#0D1B3E] truncate">{file.name}</div>
                          <div className="text-[10px] text-[#8899AA]">{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E8EFF9] bg-[#F4F6FA] flex justify-end gap-2">
              <button
                onClick={() => setViewReport(null)}
                className="px-4 py-2 border border-[#E8EFF9] text-[#0D1B3E] bg-white rounded-lg text-[12px] font-bold hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const VerifJurnalisPage = () => {
  const [journalistList, setJournalistList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJournalists() {
      const { data, error } = await supabase
        .from('journalists')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setJournalistList(data);
      setLoading(false);
    }
    fetchJournalists();
  }, []);

  const columns = [
    {
      key: 'name', label: 'Jurnalis', render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-200"></div>
          <div>
            <div className="font-bold text-[#0D1B3E]">{val}</div>
            <div className="font-mono text-[10px] text-[#8899AA]">{row.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'position', label: 'Posisi', render: (val: string, row: any) => (
        <div>
          <div className="text-[12px] text-[#0D1B3E]">{val}</div>
          <div className="text-[10px] text-[#8899AA]">Desk: {row.desk}</div>
        </div>
      )
    },
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'valid_until', label: 'Berlaku s.d.' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#003087]" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-[#E8EFF9] mb-4">
        <button className="px-4 py-2 border-b-2 border-[#003087] text-[#003087] font-bold text-[12px]">Semua Anggota</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-[#8899AA] font-medium text-[12px]">Pending Verifikasi</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-[#8899AA] font-medium text-[12px]">Expired</button>
      </div>
      <div className="flex justify-end mb-4">
        <button className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold">+ Tambah Anggota</button>
      </div>
      <DataTable columns={columns} data={journalistList} />
    </div>
  );
};




// RAG documents are now fetched from Supabase

const KnowledgeRAGPage = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [testQuery, setTestQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');
  const [isURLModalOpen, setIsURLModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState('');
  const [viewingChunks, setViewingChunks] = useState<any[] | null>(null);
  const [viewingDocName, setViewingDocName] = useState('');
  const [loadingChunks, setLoadingChunks] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rag_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setDocs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Create document entry
      const { data: doc, error } = await supabase.from('rag_documents').insert({
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Pending'
      }).select().single();

      if (error) throw error;
      fetchDocs();

      // 2. Read file content (Simple implementation for .txt/.pdf as text for now)
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        if (content) {
          await processDocument(doc.id, content);
          fetchDocs();
        }
      };
      reader.readAsText(file); // Note: For real PDF parsing, use a library like pdf.js
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleSyncCMS = async () => {
    setIsSyncing(true);
    setSyncProgress('Memulai sinkronisasi CMS...');
    try {
      const result = await syncAllCMSData((stage, current, total, name) => {
        setSyncProgress(`${stage}: ${current}/${total} — ${name}`);
      });
      const totalIndexed = result.articles.indexed + result.investigations.indexed;
      const totalErrors = result.articles.errors + result.investigations.errors;
      setSyncProgress(`Selesai! ${totalIndexed} diindeks, ${totalErrors} gagal.`);
      fetchDocs();
    } catch (err: any) {
      setSyncProgress(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleScrapeURL = async () => {
    if (!urlInput.trim()) return;
    setIsScraping(true);
    setScrapeStatus('Memulai scraping...');
    try {
      const result = await scrapeAndIndexURL(urlInput.trim(), (status) => {
        setScrapeStatus(status);
      });
      setScrapeStatus(`✅ Berhasil! "${result.title}" — ${result.chunks} chunks diindeks`);
      fetchDocs();
      setTimeout(() => {
        setIsURLModalOpen(false);
        setUrlInput('');
        setScrapeStatus('');
      }, 2000);
    } catch (err: any) {
      setScrapeStatus(`❌ Gagal: ${err.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  const handleViewChunks = async (docId: string, docName: string) => {
    setLoadingChunks(true);
    setViewingDocName(docName);
    try {
      const chunks = await getDocumentChunks(docId);
      setViewingChunks(chunks);
    } catch (err) {
      console.error('Failed to load chunks:', err);
      setViewingChunks([]);
    } finally {
      setLoadingChunks(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Hapus dokumen ini beserta semua chunks-nya?')) return;
    try {
      await deleteDocument(docId);
      fetchDocs();
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const handleReindex = async (docId: string) => {
    alert('Fitur re-index akan tersedia di versi mendatang.');
  };

  const handleAutoCrawl = async () => {
    setIsCrawling(true);
    setCrawlProgress('Memulai auto-crawl peraturan.go.id...');
    try {
      const result = await crawlPeraturanUU(1, (status, current, total) => {
        if (total > 0) {
          setCrawlProgress(`${status} (${current}/${total})`);
        } else {
          setCrawlProgress(status);
        }
      });
      setCrawlProgress(`Selesai! Ditemukan: ${result.discovered}, Diindeks: ${result.indexed}, Sudah ada: ${result.skipped}, Gagal: ${result.errors}`);
      fetchDocs();
    } catch (err: any) {
      setCrawlProgress(`Error: ${err.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleAutoCrawlJDIHN = async () => {
    setIsCrawling(true);
    setCrawlProgress('Memulai auto-crawl JDIHN...');
    try {
      const result = await crawlJDIHN(10, (status, current, total) => {
        if (total > 0) {
          setCrawlProgress(`${status} (${current}/${total})`);
        } else {
          setCrawlProgress(status);
        }
      });
      setCrawlProgress(`JDIHN Selesai! Ditemukan: ${result.discovered}, Diindeks: ${result.indexed}, Sudah ada: ${result.skipped}, Gagal: ${result.errors}`);
      fetchDocs();
    } catch (err: any) {
      setCrawlProgress(`Error JDIHN: ${err.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleCrawlHukumOnline = async () => {
    setIsCrawling(true);
    setCrawlProgress('Memulai crawl HukumOnline Putusan...');
    try {
      const result = await crawlHukumOnline(20, (status, current, total) => {
        if (total > 0) {
          setCrawlProgress(`${status} (${current}/${total})`);
        } else {
          setCrawlProgress(status);
        }
      });
      setCrawlProgress(`HukumOnline Selesai! Ditemukan: ${result.discovered}, Diindeks: ${result.indexed}, Sudah ada: ${result.skipped}, Gagal: ${result.errors}`);
      fetchDocs();
    } catch (err: any) {
      setCrawlProgress(`Error HukumOnline: ${err.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  const filteredDocs = docs.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'Semua' || doc.type === typeFilter;
    const matchStatus = statusFilter === 'Semua' || doc.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleTestQuery = async () => {
    if (!testQuery.trim()) return;
    setIsQuerying(true);
    try {
      const results = await searchContext(testQuery);
      setQueryResults(results.map((r: any) => ({
        doc: r.name,
        score: r.similarity.toFixed(2),
        text: r.content
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === 'PDF') return <FileText size={14} className="text-[#E31B23]" />;
    if (type === 'TXT') return <File size={14} className="text-[#8899AA]" />;
    if (type === 'URL') return <Globe size={14} className="text-[#003087]" />;
    if (type === 'CMS') return <Database size={14} className="text-[#4A148C]" />;
    return <File size={14} />;
  };

  const RAGStatusBadge = ({ status, progress }: { status: string, progress?: number }) => {
    if (status === 'Indexed') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#1A8C5B] bg-[#E8F5EE] px-2 py-0.5 rounded w-fit"><CheckCircle2 size={10} /> INDEXED</span>;
    if (status === 'Processing') return (
      <div className="flex flex-col gap-1 w-24">
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#4A5FD4] bg-[#EEF0FF] px-2 py-0.5 rounded w-fit"><Loader2 size={10} className="animate-spin" /> PROCESSING</span>
        <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-[#4A5FD4] h-1.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
      </div>
    );
    if (status === 'Pending') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#C47A00] bg-[#FFF6E0] px-2 py-0.5 rounded w-fit"><Clock size={10} /> PENDING</span>;
    if (status === 'Error') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#C41A1A] bg-[#FFEBEB] px-2 py-0.5 rounded w-fit"><AlertCircle size={10} /> ERROR</span>;
    return null;
  };

  return (
    <>
      <div className="flex h-full gap-4 relative">
        {/* Main Content */}
        <div className={`flex-1 space-y-4 transition-all duration-300 ${isTestPanelOpen ? 'lg:pr-[350px]' : ''}`}>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Database size={18} />} label="Total Dokumen" value={String(docs.length)} color="#003087" />
            <StatCard icon={<Server size={18} />} label="Indexed" value={String(docs.filter(d => d.status === 'Indexed').length)} color="#4A148C" />
            <StatCard icon={<Activity size={18} />} label="Processing" value={String(docs.filter(d => d.status === 'Processing').length)} color="#4A5FD4" />
            <StatCard icon={<CheckCircle2 size={18} />} label="CMS Synced" value={String(docs.filter(d => d.type === 'CMS').length)} color="#10B981" />
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => document.getElementById('rag-upload')?.click()}
                className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2"
              >
                <UploadCloud size={14} /> Upload Dokumen
              </button>
              <input
                type="file"
                id="rag-upload"
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <button onClick={() => setIsURLModalOpen(true)} className="bg-white border border-[#E8EFF9] text-[#0D1B3E] px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-gray-50">
                <LinkIcon size={14} /> Tambah URL
              </button>
              <button
                onClick={handleSyncCMS}
                disabled={isSyncing}
                className="bg-[#4A148C] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#380b6e] disabled:opacity-50"
              >
                {isSyncing ? <><Loader2 size={14} className="animate-spin" /> Syncing...</> : <><RefreshCw size={14} /> Sync CMS Data</>}
              </button>
              <button
                onClick={handleAutoCrawl}
                disabled={isCrawling}
                className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#002266] disabled:opacity-50"
              >
                {isCrawling ? <><Loader2 size={14} className="animate-spin" /> Crawling...</> : <><Bot size={14} /> Auto Crawl UU</>}
              </button>
              <button
                onClick={handleAutoCrawlJDIHN}
                disabled={isCrawling}
                className="bg-[#10B981] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#059669] disabled:opacity-50"
              >
                {isCrawling ? <><Loader2 size={14} className="animate-spin" /> Crawling...</> : <><Search size={14} /> Auto Crawl JDIHN</>}
              </button>
              <button
                onClick={handleCrawlHukumOnline}
                disabled={isCrawling}
                className="bg-[#F59E0B] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#D97706] disabled:opacity-50"
              >
                {isCrawling ? <><Loader2 size={14} className="animate-spin" /> Crawling...</> : <><Globe size={14} /> Crawl HukumOnline</>}
              </button>
              {(syncProgress || crawlProgress) && (
                <span className="text-[11px] text-[#4A148C] font-medium bg-[#F3E8FF] px-3 py-1.5 rounded-[8px] max-w-[300px] truncate">
                  {crawlProgress || syncProgress}
                </span>
              )}
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
                    <th className="p-3">Sumber</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFF9]">
                  {filteredDocs.length > 0 ? filteredDocs.map((row, i) => (
                    <tr key={i} className="hover:bg-[#F4F6FA]/50 transition-colors">
                      <td className="p-3 font-medium text-[#0D1B3E] max-w-[250px] truncate" title={row.name}>{row.name}</td>
                      <td className="p-3"><div className="flex items-center gap-1"><TypeIcon type={row.type} /> {row.type}</div></td>
                      <td className="p-3 text-[#8899AA]">{row.size}</td>
                      <td className="p-3"><RAGStatusBadge status={row.status} progress={row.progress} /></td>
                      <td className="p-3 text-[#8899AA]">{row.chunks_count > 0 ? row.chunks_count.toLocaleString() : '-'}</td>
                      <td className="p-3 text-[#8899AA]">{row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                      <td className="p-3">{row.metadata?.url ? <a href={row.metadata.url} target="_blank" rel="noopener noreferrer" className="text-[#003087] hover:underline text-[11px] truncate block max-w-[150px]" title={row.metadata.url}>{new URL(row.metadata.url).hostname.replace('www.', '')}</a> : <span className="text-[#8899AA]">-</span>}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleReindex(row.id)} className="text-[#8899AA] hover:text-[#003087]" title="Re-index"><RefreshCw size={14} /></button>
                          <button onClick={() => handleViewChunks(row.id, row.name)} className="text-[#8899AA] hover:text-[#003087]" title="Lihat Chunks"><Eye size={14} /></button>
                          <button onClick={() => handleDelete(row.id)} className="text-[#8899AA] hover:text-[#E31B23]" title="Hapus"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-[#8899AA]">Tidak ada dokumen yang ditemukan.</td>
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
              <h2 className="font-bold text-[14px] text-[#0D1B3E] flex items-center gap-2"><Bot size={16} /> Test RAG Retrieval</h2>
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
                {isQuerying ? <><Loader2 size={14} className="animate-spin" /> Mencari...</> : <><Search size={14} /> Jalankan Query</>}
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
                          <FileText size={12} className="shrink-0" /> <span className="truncate">{res.doc}</span>
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

      {/* URL Scraping Modal */}
      {
        isURLModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA]">
                <h2 className="font-bold text-[14px] text-[#0D1B3E] flex items-center gap-2"><Globe size={16} className="text-[#003087]" /> Scrape URL ke RAG</h2>
                <button onClick={() => { setIsURLModalOpen(false); setScrapeStatus(''); }} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">URL Peraturan / Dokumen Hukum</label>
                  <input
                    type="url"
                    placeholder="https://peraturan.go.id/id/uu-no-2-tahun-2025"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] font-mono"
                    disabled={isScraping}
                  />
                  <p className="text-[10px] text-[#8899AA] mt-1">Masukkan URL halaman peraturan. Firecrawl akan mengambil konten dan mengindeksnya ke RAG.</p>
                </div>

                {scrapeStatus && (
                  <div className={`p-3 rounded-[8px] text-[12px] font-medium ${scrapeStatus.includes('Berhasil') ? 'bg-[#E8F5EE] text-[#1A8C5B]' :
                    scrapeStatus.includes('Gagal') ? 'bg-[#FFEBEB] text-[#C41A1A]' :
                      'bg-[#EEF0FF] text-[#4A5FD4]'
                    }`}>
                    {isScraping && <Loader2 size={12} className="inline animate-spin mr-2" />}
                    {scrapeStatus}
                  </div>
                )}

                <button
                  onClick={handleScrapeURL}
                  disabled={isScraping || !urlInput.trim()}
                  className="w-full bg-[#003087] text-white py-2.5 rounded-[8px] text-[12px] font-bold hover:bg-[#002266] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isScraping ? <><Loader2 size={14} className="animate-spin" /> Scraping...</> : <><Globe size={14} /> Scrape & Indeks ke RAG</>}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* View Chunks Modal */}
      {viewingChunks !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
              <h2 className="font-bold text-[14px] text-[#0D1B3E] flex items-center gap-2"><Eye size={16} className="text-[#003087]" /> Chunks: {viewingDocName}</h2>
              <button onClick={() => setViewingChunks(null)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingChunks ? (
                <div className="text-center py-10"><Loader2 size={24} className="animate-spin text-[#003087] mx-auto" /><p className="text-[12px] text-[#8899AA] mt-2">Memuat chunks...</p></div>
              ) : viewingChunks.length === 0 ? (
                <div className="text-center py-10 text-[#8899AA] text-[12px]">Tidak ada chunks ditemukan.</div>
              ) : (
                viewingChunks.map((chunk: any, i: number) => (
                  <div key={chunk.id} className="bg-[#F4F6FA] p-3 rounded-[8px] border border-[#E8EFF9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#003087] bg-[#E8EFF9] px-2 py-0.5 rounded">Chunk {i + 1}</span>
                      <span className="text-[10px] text-[#8899AA]">{chunk.content.length} chars</span>
                    </div>
                    <p className="text-[11px] text-[#0D1B3E] leading-relaxed whitespace-pre-wrap">{chunk.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
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
            className={`flex items-center gap-2 px-4 py-3 text-[12px] font-bold border-b-2 transition-colors ${activeTab === tab.id
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
                  className={`w-full text-left px-3 py-2.5 rounded-[8px] text-[12px] font-medium transition-colors ${activeTemplateId === template.id
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
        <StatCard icon={<Users size={18} />} label="Total Subscriber Aktif" value="8,492" trend={5} color="#003087" />
        <StatCard icon={<DollarSign size={18} />} label="Revenue Bulan Ini" value="Rp133,8Jt" trend={15} color="#10B981" />
        <StatCard icon={<TrendingDown size={18} />} label="Churn Rate" value="2.4%" trend={-1} color="#E31B23" />
        <StatCard icon={<TrendingUp size={18} />} label="Subscriber Baru" value="142" trend={8} color="#10B981" />
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
            className={`flex items-center gap-2 px-4 py-3 text-[12px] font-bold border-b-2 transition-colors ${activeTab === tab.id
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
                        <button className="text-[#8899AA] hover:text-[#0D1B3E]"><MoreVertical size={14} /></button>
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
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${trx.status === 'Berhasil' ? 'bg-[#E8F5EE] text-[#1A8C5B]' :
                          trx.status === 'Pending' ? 'bg-[#FFF6E0] text-[#C47A00]' : 'bg-[#FFEBEB] text-[#C41A1A]'
                          }`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-[#8899AA] hover:text-[#003087] px-2"><Eye size={14} /></button>
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
              <h2 className="font-bold text-[16px] text-[#0D1B3E] flex items-center gap-2"><User size={18} /> Detail Subscriber</h2>
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
                <h4 className="text-[13px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><Wallet size={14} /> Fitur yang Diakses</h4>
                <div className="flex flex-wrap gap-2">
                  {['Investigasi', 'AI Legal Assistant', 'Download PDF', 'Newsletter Premium'].map((f, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#EEF0FF] text-[#003087] text-[11px] font-bold rounded-full">{f}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><HistoryIcon size={14} /> Riwayat Pembayaran Terakhir</h4>
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
        <StatCard icon={<Megaphone size={18} />} label="Iklan Aktif" value="12" color="#003087" />
        <StatCard icon={<Eye size={18} />} label="Total Impressions" value="1.2M" trend={15} color="#4A148C" />
        <StatCard icon={<MousePointer2 size={18} />} label="Total Clicks" value="45.2K" trend={8} color="#10B981" />
        <StatCard icon={<TrendingUp size={18} />} label="Avg. CTR" value="3.2%" trend={2} color="#F59E0B" />
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
            <button className="p-1 hover:bg-gray-100 rounded opacity-50"><ChevronLeft size={14} /></button>
            <button className="w-6 h-6 bg-[#003087] text-white rounded font-bold">1</button>
            <button className="p-1 hover:bg-gray-100 rounded opacity-50"><ChevronRight size={14} /></button>
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
                <h4 className="text-[12px] font-bold text-[#0D1B3E] mb-4 flex items-center gap-2"><Activity size={14} /> Performa 7 Hari Terakhir</h4>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#003087" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#003087" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFF9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8899AA' }} />
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
                  <h4 className="text-[12px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><Eye size={14} /> Preview Kreatif</h4>
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
                  <LinkIcon size={12} /> {selectedAd.targetUrl}
                </div>
              </div>

              {/* History */}
              <div>
                <h4 className="text-[12px] font-bold text-[#0D1B3E] mb-3 flex items-center gap-2"><History size={14} /> Riwayat Perubahan</h4>
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
            className={`px-6 py-4 text-[12px] font-bold flex items-center gap-2 transition-all relative shrink-0 ${activeTab === tab.id ? 'text-[#003087]' : 'text-[#8899AA] hover:text-[#0D1B3E]'
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
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase ${log.type === 'Error' ? 'bg-[#FFEBEB] text-[#C41A1A]' :
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
                <button className="p-2 border border-[#E8EFF9] rounded-[6px] hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeft size={14} /></button>
                <button className="p-2 border border-[#E8EFF9] rounded-[6px] hover:bg-gray-50"><ChevronRight size={14} /></button>
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
              className={`px-4 py-1.5 rounded-[8px] text-[11px] font-bold transition-all ${dateRange === range
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
        <StatCard icon={<Users size={18} />} label="Total Pengunjung" value="142,840" trend={12} color="#003087" />
        <StatCard icon={<BookOpen size={18} />} label="Artikel Dibaca" value="582,400" trend={8} color="#4A148C" />
        <StatCard icon={<MousePointer2 size={18} />} label="Pengguna Aktif" value="12,450" trend={15} color="#10B981" />
        <StatCard icon={<Timer size={18} />} label="Rerata Durasi Baca" value="5m 42s" trend={2} color="#F59E0B" />
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
                  <stop offset="5%" stopColor="#003087" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#003087" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFF9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8899AA' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8899AA' }} />
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
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#0D1B3E', fontWeight: 'bold' }} width={120} />
                <Tooltip
                  cursor={{ fill: '#F4F6FA' }}
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
          <div className="p-2 bg-[#EEF0FF] text-[#003087] rounded-lg"><Zap size={18} /></div>
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8899AA' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8899AA' }} />
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8899AA' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8899AA' }} />
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
            <div className="p-2 bg-[#E8F5EE] text-[#10B981] rounded-lg"><Globe2 size={18} /></div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0D1B3E]">Sebaran Pembaca</h3>
              <p className="text-[11px] text-[#8899AA]">Distribusi geografis pengguna di Indonesia</p>
            </div>
          </div>
          <button className="text-[11px] font-bold text-[#003087] flex items-center gap-1.5 hover:underline">
            <Map size={14} /> Lihat Peta Detail
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={14} /> },
    { id: 'cms-berita', label: 'CMS Berita', icon: <FileText size={14} /> },
    { id: 'notifikasi', label: 'Broadcast Notifikasi', icon: <Megaphone size={14} /> },
    { id: 'investigasi', label: 'Investigasi', icon: <Search size={14} /> },
    { id: 'knowledge-rag', label: 'Knowledge RAG', icon: <BookOpen size={14} /> },
    { id: 'ai-legal-config', label: 'AI Legal Config', icon: <Bot size={14} /> },
    { id: 'dokumen-hukum', label: 'Dokumen Hukum', icon: <FileCheck size={14} /> },
    { id: 'manajemen-user', label: 'Manajemen User', icon: <Users size={14} /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard size={14} /> },
    { id: 'pengaduan', label: 'Pengaduan', icon: <Megaphone size={14} />, badge: '47' },
    { id: 'verif-jurnalis', label: 'Verif. Jurnalis', icon: <IdCard size={14} />, badge: '3', badgeColor: '#F59E0B' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={14} /> },
    { id: 'manajemen-iklan', label: 'Manajemen Iklan', icon: <Megaphone size={14} /> },
    { id: 'pengaturan', label: 'Pengaturan Sistem', icon: <Settings size={14} /> },
  ];

  const pages: Record<string, React.ReactNode> = {
    'dashboard': <DashboardPage />,
    'cms-berita': <CMSBeritaPage />,
    'notifikasi': <ManajemenNotifikasiPage />,
    'investigasi': <InvestigasiPage />,
    'knowledge-rag': <KnowledgeRAGPage />,
    'ai-legal-config': <AILegalConfigPage />,
    'dokumen-hukum': <AdminDokumenHukum />,
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
    <>
      {isLoggingOut && <FullScreenLoader message="Membungkus sesi Admin Anda..." />}
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
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[6px] transition-colors ${activePage === item.id
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
                <ChevronLeft size={14} />
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
                <button
                  onClick={async () => {
                    setIsLoggingOut(true);
                    // Delay for 5 seconds as requested by the user
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    await supabase.auth.signOut();
                    window.location.href = '/';
                  }}
                  className="text-[#8899AA] hover:text-[#E31B23] ml-2"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {pages[activePage]}
          </main>
        </div>
      </div>
    </>
  );
}
