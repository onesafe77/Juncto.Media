import React, { useState, useEffect } from 'react';
import { Search, FilePlus, Layers, FileCheck, Ban, Trash, Download, Eye, MoreVertical, ChevronLeft, ChevronRight, X, UploadCloud, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const StatCard = ({ icon, label, value, color = '#003087', trend }: any) => (
    <div className="bg-white border border-[#E8EFF9] rounded-[10px] p-4 flex items-center gap-4 shadow-sm">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: color }}>
            {icon}
        </div>
        <div>
            <div className="text-[10px] text-[#8899AA] font-medium uppercase tracking-wider">{label}</div>
            <div className="text-[22px] font-black text-[#0D1B3E] leading-tight flex items-center gap-2">
                {value}
                {trend && (
                    <span className={`text-[10px] flex items-center ${trend > 0 ? 'text-[#10B981]' : 'text-[#E31B23]'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    </div>
);

export default function AdminDokumenHukum() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Form State
    const [newDoc, setNewDoc] = useState({ title: '', description: '', category: 'Umum', is_premium: false });
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    async function fetchTemplates() {
        setLoading(true);
        const { data, error } = await supabase
            .from('legal_templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setTemplates(data);
        setLoading(false);
    }

    const handleDelete = async (id: string, file_url: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus template dokumen ini?')) return;
        try {
            await supabase.from('legal_templates').delete().eq('id', id);
            fetchTemplates();
        } catch (err) {
            alert('Gagal menghapus: ' + err);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA template dokumen? Tindakan ini tidak dapat dibatalkan.')) return;

        try {
            setLoading(true);
            // Supabase delete requires a filter, using neq with a dummy uuid or id to delete all
            const { error } = await supabase.from('legal_templates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (error) throw error;
            fetchTemplates();
        } catch (err: any) {
            alert('Gagal menghapus semua data: ' + err.message);
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert('File Dokumen wajib dipilih!');
            return;
        }
        if (files.length === 1 && !newDoc.title) {
            alert('Judul Dokumen wajib diisi!');
            return;
        }

        setUploading(true);
        try {
            const inserts = [];

            for (const f of files) {
                let docTitle = newDoc.title;
                let docDesc = newDoc.description;
                let docCategory = newDoc.category;

                if (files.length > 1) {
                    let cleanTitle = f.name.replace(/\.[^/.]+$/, "");
                    cleanTitle = cleanTitle.replace(/^[0-9A-Za-z\W_]+?\.\s*/, "");
                    cleanTitle = cleanTitle.replace(/^Draf\s+/i, "");
                    docTitle = cleanTitle;
                    docDesc = `Template dokumen standar untuk ${cleanTitle} yang dapat disesuaikan dengan kebutuhan Anda.`;

                    if (newDoc.category === 'Otomatis') {
                        const l = cleanTitle.toLowerCase();
                        if (l.includes('kerja') || l.includes('karyawan') || l.includes('phk') || l.includes('pkwt')) docCategory = 'Ketenagakerjaan';
                        else if (l.includes('sewa') || l.includes('tanah') || l.includes('bangunan') || l.includes('rumah') || l.includes('properti')) docCategory = 'Properti';
                        else if (l.includes('somasi') || l.includes('gugatan') || l.includes('sengketa') || l.includes('damai')) docCategory = 'Sengketa';
                        else if (l.includes('bisnis') || l.includes('saham') || l.includes('investasi') || l.includes('nda') || l.includes('kerahasiaan') || l.includes('perusahaan') || l.includes('jual beli') || l.includes('kemitraan')) docCategory = 'Bisnis';
                        else if (l.includes('cerai') || l.includes('waris') || l.includes('keluarga') || l.includes('nikah')) docCategory = 'Keluarga';
                        else docCategory = 'Umum';
                    }
                }

                const fileExt = f.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `templates/${fileName}`;

                const { error: uploadError } = await supabase.storage.from('legal-documents').upload(filePath, f);
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('legal-documents').getPublicUrl(filePath);

                inserts.push({
                    title: docTitle,
                    description: docDesc,
                    category: docCategory,
                    is_premium: newDoc.is_premium,
                    file_name: f.name,
                    file_url: publicUrl,
                    file_size_kb: Math.round(f.size / 1024)
                });
            }

            const { error: dbError } = await supabase.from('legal_templates').insert(inserts);
            if (dbError) throw dbError;

            alert(`Berhasil mengupload ${files.length} template dokumen!`);
            setIsUploadModalOpen(false);
            setNewDoc({ title: '', description: '', category: 'Umum', is_premium: false });
            setFiles([]);
            fetchTemplates();
        } catch (err: any) {
            alert('Gagal mengupload: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const filteredDocs = templates.filter(doc => {
        const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter === 'Semua' || doc.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={<FileCheck size={18} />} label="Total Template" value={templates.length.toString()} color="#003087" />
                <StatCard icon={<Layers size={18} />} label="Premium" value={templates.filter(t => t.is_premium).length.toString()} color="#4A148C" />
                <StatCard icon={<Download size={18} />} label="Total Diunduh (Semua)" value={templates.reduce((acc, curr) => acc + (curr.downloads || 0), 0).toString()} color="#10B981" />
            </div>

            <div className="bg-white p-4 rounded-[10px] border border-[#E8EFF9] shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => setIsUploadModalOpen(true)} className="bg-[#003087] text-white px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#002566] transition-colors shadow-sm">
                            <FilePlus size={14} /> Upload Template Baru
                        </button>
                        {templates.length > 0 && (
                            <button onClick={handleDeleteAll} className="bg-red-50 text-[#E31B23] border border-red-200 px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center gap-2 hover:bg-red-100 transition-colors shadow-sm">
                                <Trash size={14} /> Hapus Semua Data
                            </button>
                        )}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8899AA]" />
                            <input
                                type="text"
                                placeholder="Cari judul template..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none focus:border-[#003087] w-[250px]"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-[8px] border border-[#E8EFF9] text-[12px] outline-none bg-white font-medium text-[#0D1B3E]">
                            <option value="Semua">Semua Kategori</option>
                            <option value="Bisnis">Bisnis</option>
                            <option value="Sengketa">Sengketa</option>
                            <option value="Ketenagakerjaan">Ketenagakerjaan</option>
                            <option value="Properti">Properti</option>
                            <option value="Umum">Umum</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E8EFF9] rounded-[10px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[12px]">
                        <thead className="bg-[#F4F6FA] text-[#8899AA] uppercase text-[10px] font-bold">
                            <tr>
                                <th className="p-4">Judul Template</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">File</th>
                                <th className="p-4">Tipe Akses</th>
                                <th className="p-4">Diunduh</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8EFF9]">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-[#8899AA]"><Loader2 className="animate-spin mx-auto w-6 h-6" /></td></tr>
                            ) : filteredDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-[#F4F6FA]/50 transition-colors">
                                    <td className="p-4 max-w-[300px]">
                                        <div className="font-bold text-[#0D1B3E] mb-1">{doc.title}</div>
                                        <div className="text-[10px] text-[#8899AA] line-clamp-1">{doc.description}</div>
                                    </td>
                                    <td className="p-4 font-bold text-[#003087]">{doc.category}</td>
                                    <td className="p-4">
                                        <div className="text-[#0D1B3E] font-medium">{doc.file_name}</div>
                                        <div className="text-[10px] text-[#8899AA]">{doc.file_size_kb} KB</div>
                                    </td>
                                    <td className="p-4">
                                        {doc.is_premium ?
                                            <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-[#FFF6E0] text-[#C47A00]">Premium</span> :
                                            <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-[#E8F5EE] text-[#1A8C5B]">Gratis</span>
                                        }
                                    </td>
                                    <td className="p-4 text-[#8899AA] font-bold">{doc.downloads || 0} kali</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <a href={`${doc.file_url}?download=${encodeURIComponent(doc.file_name)}`} target="_blank" rel="noreferrer" className="p-1.5 text-[#8899AA] hover:text-[#003087] hover:bg-[#EEF0FF] rounded transition-colors" title="Download Template"><Download size={14} /></a>
                                            <button onClick={() => handleDelete(doc.id, doc.file_url)} className="p-1.5 text-[#8899AA] hover:text-[#E31B23] hover:bg-red-50 rounded transition-colors" title="Hapus Template"><Trash size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredDocs.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-[#8899AA]">Belum ada template yang diupload.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-[#E8EFF9] flex justify-between items-center bg-[#F4F6FA] shrink-0">
                            <h2 className="font-bold text-[16px] text-[#0D1B3E] flex items-center gap-2"><FilePlus size={18} /> Upload Template Hukum Baru</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-[#8899AA] hover:text-[#E31B23] p-1 rounded hover:bg-red-50 transition-colors"><X size={18} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
                            {files.length <= 1 && (
                                <>
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Judul Template <span className="text-[#E31B23]">*</span></label>
                                        <input type="text" value={newDoc.title} onChange={e => setNewDoc({ ...newDoc, title: e.target.value })} placeholder="Contoh: Draf Perjanjian Kerja Waktu Tertentu..." className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087]" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Deskripsi Singkat</label>
                                        <textarea value={newDoc.description} onChange={e => setNewDoc({ ...newDoc, description: e.target.value })} placeholder="Penjelasan singkat kegunaan template ini..." className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] h-20 resize-none" />
                                    </div>
                                </>
                            )}
                            {files.length > 1 && (
                                <div className="bg-[#EEF0FF] p-4 rounded-lg flex items-start gap-3 border border-[#003087]/20">
                                    <div className="text-[20px]">🪄</div>
                                    <div className="text-[#003087] text-[12px] font-medium leading-relaxed">
                                        Anda sedang mengunggah <b>{files.length} dokumen</b> sekaligus. Judul dan deskripsi masing-masing template akan diisi secara mutakhir secara otomatis berdasarkan nama file.
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Kategori <span className="text-[#E31B23]">*</span></label>
                                    <select value={newDoc.category} onChange={e => setNewDoc({ ...newDoc, category: e.target.value })} className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                                        {files.length > 1 && <option value="Otomatis">✨ Deteksi Otomatis dari Judul</option>}
                                        <option value="Umum">Umum</option>
                                        <option value="Bisnis">Bisnis</option>
                                        <option value="Sengketa">Sengketa</option>
                                        <option value="Ketenagakerjaan">Ketenagakerjaan</option>
                                        <option value="Properti">Properti</option>
                                        <option value="Keluarga">Keluarga</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">Akses Template <span className="text-[#E31B23]">*</span></label>
                                    <select value={newDoc.is_premium ? 'Premium' : 'Gratis'} onChange={e => setNewDoc({ ...newDoc, is_premium: e.target.value === 'Premium' })} className="w-full px-4 py-2.5 rounded-[8px] border border-[#E8EFF9] text-[13px] outline-none focus:border-[#003087] bg-white">
                                        <option value="Gratis">Gratis (Publik)</option>
                                        <option value="Premium">Premium (Berbayar/Subs)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[12px] font-bold text-[#0D1B3E] mb-1.5">File Template (Docx / PDF) <span className="text-[#E31B23]">*</span></label>
                                <div onClick={() => document.getElementById('template-upload')?.click()} className="border-2 border-dashed border-[#003087]/30 rounded-[10px] p-8 flex flex-col items-center justify-center bg-[#F4F6FA] hover:bg-[#EEF0FF] hover:border-[#003087] transition-all cursor-pointer group">
                                    <UploadCloud size={32} className={`${files.length > 0 ? 'text-[#10B981]' : 'text-[#003087]'} mb-3 group-hover:scale-110 transition-transform`} />
                                    <p className="text-[14px] font-bold text-[#0D1B3E]">
                                        {files.length === 0 ? 'Klik untuk memilih file' : files.length === 1 ? files[0].name : `${files.length} file dipilih`}
                                    </p>
                                    <p className="text-[11px] text-[#8899AA] mt-1">
                                        {files.length === 0 ? 'Format didukung: Word (.doc, .docx), PDF, Maks 20MB' : 'Klik lagi untuk menambah/mengganti file'}
                                    </p>
                                </div>
                                <input type="file" id="template-upload" className="hidden" accept=".pdf,.doc,.docx" multiple onChange={e => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const selectedFiles = Array.from(e.target.files);
                                        setFiles(selectedFiles);

                                        // Auto-generate title if single file
                                        if (selectedFiles.length === 1) {
                                            const sf = selectedFiles[0];
                                            let cleanTitle = sf.name.replace(/\.[^/.]+$/, ""); // Remove extension
                                            cleanTitle = cleanTitle.replace(/^[0-9A-Za-z\W_]+?\.\s*/, ""); // Line leading "01. "
                                            cleanTitle = cleanTitle.replace(/^Draf\s+/i, ""); // Remove leading "Draf "

                                            // Auto category detection for single file
                                            const l = cleanTitle.toLowerCase();
                                            let autoCat = 'Umum';
                                            if (l.includes('kerja') || l.includes('karyawan') || l.includes('phk') || l.includes('pkwt')) autoCat = 'Ketenagakerjaan';
                                            else if (l.includes('sewa') || l.includes('tanah') || l.includes('bangunan') || l.includes('rumah') || l.includes('properti')) autoCat = 'Properti';
                                            else if (l.includes('somasi') || l.includes('gugatan') || l.includes('sengketa') || l.includes('damai')) autoCat = 'Sengketa';
                                            else if (l.includes('bisnis') || l.includes('saham') || l.includes('investasi') || l.includes('nda') || l.includes('kerahasiaan') || l.includes('perusahaan') || l.includes('jual beli') || l.includes('kemitraan')) autoCat = 'Bisnis';
                                            else if (l.includes('cerai') || l.includes('waris') || l.includes('keluarga') || l.includes('nikah')) autoCat = 'Keluarga';

                                            setNewDoc(prev => ({
                                                ...prev,
                                                title: cleanTitle,
                                                description: `Template dokumen standar untuk ${cleanTitle} yang dapat disesuaikan dengan kebutuhan Anda.`,
                                                category: autoCat
                                            }));
                                        } else {
                                            // Bulk file - switch to auto detection by default
                                            setNewDoc(prev => ({
                                                ...prev,
                                                category: 'Otomatis'
                                            }));
                                        }
                                    } else {
                                        setFiles([]);
                                    }
                                }} />
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#E8EFF9] flex justify-end gap-3 bg-[#F4F6FA] shrink-0">
                            <button disabled={uploading} onClick={() => setIsUploadModalOpen(false)} className="px-5 py-2.5 border border-[#E8EFF9] bg-white text-[#0D1B3E] rounded-[8px] text-[13px] font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">Batal</button>
                            <button disabled={uploading || files.length === 0 || (files.length === 1 && !newDoc.title)} onClick={handleUpload} className="px-6 py-2.5 bg-[#003087] text-white rounded-[8px] text-[13px] font-bold hover:bg-[#002266] transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {uploading ? <><Loader2 size={16} className="animate-spin" /> Mengunggah...</> : <><Save size={16} /> Simpan & Publikasi</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
