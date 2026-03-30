import React, { useState, useEffect } from 'react';
import { Search, Loader2, Edit, Trash2, Plus, ArrowLeft, Image as ImageIcon, FileText, Quote, X, Settings, Check, Type, MoveVertical, Copy, Archive, BookOpen, Lock, Unlock, UploadCloud, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Helper component for badges
const StatusBadge = ({ status }: { status: string }) => {
    let bg = '#F3F4F6', text = '#6B7280';
    if (status === 'Published') { bg = '#E8F5EE'; text = '#1A8C5B'; }
    else if (status === 'Aktif') { bg = '#E8EFF9'; text = '#003087'; }
    else if (status === 'Archive' || status === 'Arsip') { bg = '#FFF6E0'; text = '#C47A00'; }
    else if (status === 'Draft') { bg = '#F3F4F6'; text = '#6B7280'; }
    return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: bg, color: text }}>{status}</span>;
};

export default function InvestigasiPage() {
    const [investigasiList, setInvestigasiList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [newCase, setNewCase] = useState<any>({
        title: '',
        description: '',
        journalist: 'Admin',
        category: 'Investigasi',
        status: 'Draft',
        image_url: '',
        published_at: '',
        free_pages_count: 3,
        pages: []
    });
    const [coverFile, setCoverFile] = useState<File | null>(null);

    useEffect(() => {
        fetchInvestigations();
    }, []);

    async function fetchInvestigations() {
        setLoading(true);
        const { data, error } = await supabase
            .from('investigations')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setInvestigasiList(data);
        setLoading(false);
    }

    // File Upload Helper
    const handleUploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `investigations/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('article-images').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSave = async () => {
        if (!newCase.title) return alert('Judul harus diisi!');
        setSaving(true);
        try {
            let finalImageUrl = newCase.image_url;
            if (coverFile) {
                finalImageUrl = await handleUploadImage(coverFile);
            }

            const caseData = {
                title: newCase.title,
                description: newCase.description,
                journalist: newCase.journalist,
                category: newCase.category,
                status: newCase.status,
                image_url: finalImageUrl,
                published_at: newCase.status === 'Published' && !newCase.published_at ? new Date().toISOString() : newCase.published_at,
                free_pages_count: newCase.free_pages_count,
                pages: newCase.pages
            };

            if (editingId) {
                const { error } = await supabase.from('investigations').update(caseData).eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('investigations').insert([{
                    id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                    ...caseData,
                    created_at: new Date().toISOString()
                }]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchInvestigations();
        } catch (err: any) {
            alert('Gagal menyimpan: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setNewCase({ title: '', description: '', journalist: 'Admin', category: 'Investigasi', status: 'Draft', image_url: '', published_at: '', free_pages_count: 3, pages: [] });
        setCoverFile(null);
        setModalStep(1);
        setIsModalOpen(true);
    };

    const openEditModal = (row: any) => {
        setEditingId(row.id);
        setNewCase({
            title: row.title || '',
            description: row.description || '',
            journalist: row.journalist || 'Admin',
            category: row.category || 'Investigasi',
            status: row.status || 'Draft',
            image_url: row.image_url || '',
            published_at: row.published_at || '',
            free_pages_count: row.free_pages_count ?? 3,
            pages: typeof row.pages === 'string' ? JSON.parse(row.pages) : (row.pages || [])
        });
        setCoverFile(null);
        setModalStep(1);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus investigasi ini?')) return;
        await supabase.from('investigations').delete().eq('id', id);
        fetchInvestigations();
    };

    // Page Builder Actions
    const addPage = (type: string) => {
        const newPage = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            title: '',
            content: '',
            image_url: '',
            is_locked: newCase.pages.length >= newCase.free_pages_count
        };
        setNewCase({ ...newCase, pages: [...newCase.pages, newPage] });
    };

    const updatePage = (id: string, updates: any) => {
        setNewCase({
            ...newCase,
            pages: newCase.pages.map((p: any) => p.id === id ? { ...p, ...updates } : p)
        });
    };

    const removePage = (id: string) => {
        setNewCase({ ...newCase, pages: newCase.pages.filter((p: any) => p.id !== id) });
    };

    const movePage = (index: number, direction: -1 | 1) => {
        const newPages = [...newCase.pages];
        if (index + direction < 0 || index + direction >= newPages.length) return;
        const temp = newPages[index];
        newPages[index] = newPages[index + direction];
        newPages[index + direction] = temp;

        // Auto update locks based on position
        const updatedLocks = newPages.map((p, i) => ({ ...p, is_locked: i >= newCase.free_pages_count }));
        setNewCase({ ...newCase, pages: updatedLocks });
    };

    const filteredData = investigasiList.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-4">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button onClick={openCreateModal} className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#002566] transition-colors shadow-sm">
                        <Plus size={14} /> Buat eBook Baru
                    </button>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
                        <input type="text" placeholder="Cari Judul..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[200px]" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
                        <option value="Semua">Semua Status</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Arsip">Arsip</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#003087]" size={32} /></div>
            ) : (
                <div className="bg-white border border-[#E8EFF9] rounded-[10px] overflow-hidden shadow-sm">
                    <table className="w-full text-left text-[12px]">
                        <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
                            <tr>
                                <th className="p-3 w-12">Cover</th>
                                <th className="p-3">Judul Investigasi</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Halaman</th>
                                <th className="p-3 text-center">Akses Gratis</th>
                                <th className="p-3">Tgl Publish</th>
                                <th className="p-3 text-center w-24">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8EFF9]">
                            {filteredData.map((row, i) => {
                                const pages = typeof row.pages === 'string' ? JSON.parse(row.pages) : (row.pages || []);
                                return (
                                    <tr key={i} className="hover:bg-[#F4F6FA]/50 transition-colors">
                                        <td className="p-3">
                                            <div className="w-10 h-14 bg-gray-200 rounded object-cover overflow-hidden">
                                                {row.image_url ? <img src={row.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><BookOpen size={16} /></div>}
                                            </div>
                                        </td>
                                        <td className="p-3 font-semibold text-[#0D1B3E]">
                                            {row.title}
                                            <div className="text-[11px] text-[#8899AA] font-normal mt-0.5">{row.category}</div>
                                        </td>
                                        <td className="p-3"><StatusBadge status={row.status} /></td>
                                        <td className="p-3 text-center font-bold text-[#0D1B3E]">{pages.length}</td>
                                        <td className="p-3 text-center">
                                            <span className="bg-green-50 text-green-700 font-bold px-2 py-1 rounded text-[11px]">s/d Hal {row.free_pages_count}</span>
                                        </td>
                                        <td className="p-3 text-[#8899AA]">{row.published_at ? new Date(row.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                                        <td className="p-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openEditModal(row)} className="text-[#8899AA] hover:text-[#003087]" title="Edit"><Edit size={14} /></button>
                                                <button onClick={() => handleDelete(row.id)} className="text-[#8899AA] hover:text-[#E31B23]" title="Hapus"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredData.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-[#8899AA]">Tidak ada data investigasi.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 3-Step Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#0D1B3E]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-[#E8EFF9] flex items-center justify-between shrink-0 bg-[#F4F6FA]">
                            <div>
                                <h2 className="font-bold text-[16px] text-[#0D1B3E]">{editingId ? 'Edit Investigasi' : 'Buat Investigasi Baru'}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-[11px] font-bold px-2 py-1 rounded ${modalStep === 1 ? 'bg-[#003087] text-white' : 'bg-gray-200 text-gray-500'}`}>1. Info Dasar</span>
                                    <div className="w-4 h-[2px] bg-gray-300"></div>
                                    <span className={`text-[11px] font-bold px-2 py-1 rounded ${modalStep === 2 ? 'bg-[#003087] text-white' : 'bg-gray-200 text-gray-500'}`}>2. Page Builder</span>
                                    <div className="w-4 h-[2px] bg-gray-300"></div>
                                    <span className={`text-[11px] font-bold px-2 py-1 rounded ${modalStep === 3 ? 'bg-[#003087] text-white' : 'bg-gray-200 text-gray-500'}`}>3. Monetisasi</span>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-[#8899AA] transition-colors"><X size={18} /></button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            {modalStep === 1 && (
                                <div className="space-y-4 max-w-2xl mx-auto">
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Judul Investigasi <span className="text-red-500">*</span></label>
                                        <input type="text" value={newCase.title} onChange={e => setNewCase({ ...newCase, title: e.target.value })} className="w-full px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[13px]" placeholder="Contoh: Skandal Anggaran Daerah X..." autoFocus />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Deskripsi Singkat / Sinopsis</label>
                                        <textarea value={newCase.description} onChange={e => setNewCase({ ...newCase, description: e.target.value })} className="w-full px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[13px] h-24 resize-none" placeholder="Ringkasan investigasi ini..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Kategori</label>
                                            <select value={newCase.category} onChange={e => setNewCase({ ...newCase, category: e.target.value })} className="w-full px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[13px]">
                                                <option>Investigasi</option>
                                                <option>Korupsi</option>
                                                <option>Kebijakan Publik</option>
                                                <option>Hukum & Kriminal</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Status Posting</label>
                                            <select value={newCase.status} onChange={e => setNewCase({ ...newCase, status: e.target.value })} className="w-full px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[13px]">
                                                <option>Draft</option>
                                                <option>Published</option>
                                                <option>Arsip</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Cover Depan (Thumbnail)</label>
                                        <div className="border-2 border-dashed border-[#E8EFF9] rounded-xl p-4 text-center cursor-pointer hover:border-[#003087]" onClick={() => document.getElementById('cover-img')?.click()}>
                                            {coverFile || newCase.image_url ? (
                                                <div className="text-[#003087] font-bold text-[12px] flex items-center justify-center gap-2"><Check size={16} /> Gambar Terpilih</div>
                                            ) : (
                                                <div className="text-[#8899AA] text-[12px] flex flex-col items-center"><UploadCloud size={24} className="mb-2" /> Klik untuk upload cover</div>
                                            )}
                                            <input id="cover-img" type="file" className="hidden" accept="image/*" onChange={e => e.target.files && setCoverFile(e.target.files[0])} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalStep === 2 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100">
                                        <span className="text-[12px] font-bold text-[#8899AA] mr-2">Tambah Halaman:</span>
                                        <button onClick={() => addPage('cover')} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-[11px] font-bold flex items-center gap-1"><ImageIcon size={12} /> Cover Bab</button>
                                        <button onClick={() => addPage('text')} className="px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1"><Type size={12} /> Teks Penuh</button>
                                        <button onClick={() => addPage('text_image')} className="px-3 py-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold flex items-center gap-1"><FileText size={12} /> Teks + Gambar</button>
                                        <button onClick={() => addPage('quote')} className="px-3 py-1.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-700 text-[11px] font-bold flex items-center gap-1"><Quote size={12} /> Kutipan Kunci</button>
                                    </div>

                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 pb-10">
                                        {newCase.pages.length === 0 ? (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                                                <BookOpen className="mx-auto text-gray-300 mb-2" size={32} />
                                                <p className="text-gray-500 text-[13px] font-medium">Belum ada halaman. Tambahkan halaman pertama!</p>
                                            </div>
                                        ) : (
                                            newCase.pages.map((page: any, index: number) => (
                                                <div key={page.id} className={`border rounded-xl p-4 bg-gray-50 border-gray-200 relative`}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col gap-1">
                                                                <button onClick={() => movePage(index, -1)} disabled={index === 0} className="text-gray-400 hover:text-[#003087] disabled:opacity-30"><MoveVertical size={14} className="rotate-180" /></button>
                                                                <button onClick={() => movePage(index, 1)} disabled={index === newCase.pages.length - 1} className="text-gray-400 hover:text-[#003087] disabled:opacity-30"><MoveVertical size={14} /></button>
                                                            </div>
                                                            <span className="w-6 h-6 rounded-full bg-[#003087] text-white flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                                                            <span className="text-[12px] font-bold uppercase text-[#8899AA]">{page.type}</span>
                                                            {page.is_locked ? <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold flex gap-1 items-center"><Lock size={10} /> Terkunci</span> : <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold flex gap-1 items-center"><Unlock size={10} /> Gratis</span>}
                                                        </div>
                                                        <button onClick={() => removePage(page.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button>
                                                    </div>

                                                    <div className="pl-10 space-y-3">
                                                        <input type="text" placeholder="Judul Halaman (Opsional)" value={page.title} onChange={e => updatePage(page.id, { title: e.target.value })} className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-[13px] font-bold" />

                                                        {(page.type === 'cover' || page.type === 'text_image') && (
                                                            <div className="border border-gray-200 bg-white rounded p-3 text-center text-[11px] text-gray-500 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                                                                <UploadCloud size={16} className="mb-1" />
                                                                <span>[Upload Gambar Halaman - Placeholder API]</span>
                                                            </div>
                                                        )}

                                                        {(page.type === 'text' || page.type === 'text_image' || page.type === 'quote') && (
                                                            <textarea placeholder={page.type === 'quote' ? "Kutipan..." : "Isi konten..."} value={page.content} onChange={e => updatePage(page.id, { content: e.target.value })} className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-[13px] min-h-[100px] resize-y" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {modalStep === 3 && (
                                <div className="space-y-6 max-w-xl mx-auto py-8">
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Settings className="text-[#003087] w-8 h-8" />
                                        </div>
                                        <h3 className="text-[18px] font-bold text-[#0D1B3E]">Pengaturan Monetisasi</h3>
                                        <p className="text-[13px] text-[#8899AA] mt-1">Atur paywall dan akses pembaca ke investigasi ini.</p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <label className="block text-[14px] font-bold text-[#0D1B3E]">Gratis hingga halaman ke:</label>
                                                <p className="text-[12px] text-gray-500">Halaman setelah ini akan terkunci (Paywall).</p>
                                            </div>
                                            <input
                                                type="number"
                                                min="1"
                                                max={Math.max(1, newCase.pages.length)}
                                                value={newCase.free_pages_count}
                                                onChange={e => {
                                                    const val = parseInt(e.target.value) || 1;
                                                    setNewCase({ ...newCase, free_pages_count: val });
                                                    // Re-evaluate locks
                                                    setNewCase(prev => ({
                                                        ...prev,
                                                        pages: prev.pages.map((p: any, i: number) => ({ ...p, is_locked: i >= val }))
                                                    }));
                                                }}
                                                className="w-20 px-3 py-2 rounded-[8px] border border-gray-300 text-[16px] font-bold text-center"
                                            />
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h4 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-wider">Preview Akses Pembaca:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.from({ length: Math.max(1, newCase.pages.length) }).map((_, i) => (
                                                    <div key={i} className={`w-8 h-10 rounded flex items-center justify-center text-[10px] font-bold ${i < newCase.free_pages_count ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-[#E8EFF9] flex justify-between bg-[#F4F6FA] shrink-0">
                            <button onClick={() => modalStep > 1 ? setModalStep(s => (s - 1) as 1 | 2 | 3) : setIsModalOpen(false)} className="px-5 py-2.5 rounded-[8px] text-[13px] font-bold text-[#8899AA] hover:bg-gray-200 transition-colors">
                                {modalStep === 1 ? 'Batal' : 'Kembali'}
                            </button>

                            {modalStep < 3 ? (
                                <button onClick={() => setModalStep(s => (s + 1) as 1 | 2 | 3)} className="bg-[#0D1B3E] text-white px-6 py-2.5 rounded-[8px] text-[13px] font-bold hover:bg-black transition-all">
                                    Lanjut ke Tahap {modalStep + 1}
                                </button>
                            ) : (
                                <button onClick={handleSave} disabled={saving} className="bg-[#10B981] text-white px-8 py-2.5 rounded-[8px] text-[13px] font-bold hover:bg-[#059669] transition-all disabled:opacity-50 flex items-center gap-2">
                                    {saving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> Selesai & Simpan</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
