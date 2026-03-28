import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, Share2, Printer, Clock, User, Calendar, Shield, Search, Loader2, AlertCircle, ChevronLeft, Target, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export default function InvestigasiDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [shareToast, setShareToast] = useState(false);

    // localStorage helpers for investigation bookmarks
    const getInvBookmarks = (): string[] => {
        try {
            return JSON.parse(localStorage.getItem('inv_bookmarks') || '[]');
        } catch { return []; }
    };
    const setInvBookmarks = (ids: string[]) => {
        localStorage.setItem('inv_bookmarks', JSON.stringify(ids));
    };

    useEffect(() => {
        async function fetchDetail() {
            if (!id) return;
            setLoading(true);
            try {
                const { data: investigation, error: supabaseError } = await supabase
                    .from('investigations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (supabaseError) throw supabaseError;
                setData(investigation);

                // Check bookmark status from localStorage
                setIsBookmarked(getInvBookmarks().includes(id));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDetail();
    }, [id, user]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `[INVESTIGASI] ${data.title}`,
                    text: data.description || data.title,
                    url: window.location.href,
                });
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setShareToast(true);
                setTimeout(() => setShareToast(false), 2500);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const toggleBookmark = () => {
        if (!id) return;
        setBookmarkLoading(true);
        const current = getInvBookmarks();
        if (isBookmarked) {
            setInvBookmarks(current.filter(b => b !== id));
            setIsBookmarked(false);
        } else {
            setInvBookmarks([...current, id]);
            setIsBookmarked(true);
        }
        setBookmarkLoading(false);
        setShareToast(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-[#003087] mb-4" />
                <p className="font-bold text-[#8899AA]">Memuat detail investigasi...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center p-6">
                <AlertCircle className="w-12 h-12 text-[#E31B23] mb-4" />
                <h2 className="text-2xl font-bold text-[#0D1B3E] mb-2">Kasus Tidak Ditemukan</h2>
                <p className="text-[#8899AA] mb-8">{error || 'Maaf, kasus investigasi yang Anda cari tidak tersedia.'}</p>
                <Link to="/workspace/investigasi" className="bg-[#003087] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#002566] transition-colors">
                    Kembali ke Investigasi
                </Link>
            </div>
        );
    }

    const StatusBadge = ({ status }: { status: string }) => {
        let bg = '#F3F4F6', text = '#6B7280';
        const s = status.toLowerCase();
        if (['published', 'aktif', 'selesai'].includes(s)) { bg = '#E8F5EE'; text = '#1A8C5B'; }
        else if (['review', 'proses'].includes(s)) { bg = '#EEF0FF'; text = '#4A5FD4'; }
        else if (s === 'draft') { bg = '#FFF8E1'; text = '#F59E0B'; }
        return <span className="px-3 py-1 rounded-sm text-[11px] font-extrabold uppercase tracking-[0.1em]" style={{ backgroundColor: bg, color: text }}>{status}</span>;
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Toast notification for share */}
            {shareToast && (
                <div className="fixed top-6 right-6 z-50 bg-[#0D1B3E] text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
                    <Share2 size={16} /> Tautan berhasil disalin!
                </div>
            )}

            {/* Article-style Header */}
            <div className="p-4 lg:p-8 max-w-[1000px] mx-auto pt-12">
                <div className="mb-8 text-center">
                    {/* Breadcrumb & Category badges */}
                    <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                        <span className="bg-[#E31B23] text-white text-[11px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-[0.1em]">
                            Investigasi
                        </span>
                        <span className="text-[#8899AA] text-sm font-mono">/</span>
                        <StatusBadge status={data.status} />
                        {data.priority && (
                            <>
                                <span className="text-[#8899AA] text-sm font-mono">/</span>
                                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-[0.1em] ${data.priority === 'Tinggi' ? 'bg-[#FFEBEB] text-[#C41A1A]' : 'bg-[#F3F4F6] text-[#6B7280]'
                                    }`}>
                                    Prioritas {data.priority}
                                </span>
                            </>
                        )}
                        <span className="text-[#8899AA] text-sm font-mono">/</span>
                        <Link to="/workspace/investigasi" className="text-sm text-[#8899AA] hover:text-[#003087] transition-colors font-bold uppercase tracking-wider">
                            Semua Kasus
                        </Link>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#0D1B3E] mb-6 leading-[1.1] tracking-tight">
                        {data.title}
                    </h1>

                    {/* Author & Date Section */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#E31B23] flex items-center justify-center font-bold text-white text-xl shadow-lg">
                                <Shield size={24} />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-base text-[#0D1B3E] leading-tight">{data.journalist || 'Tim Redaksi Juncto'}</p>
                                <p className="text-[11px] font-bold text-[#E31B23] uppercase tracking-widest mt-0.5">Jurnalis Investigasi</p>
                            </div>
                        </div>

                        <div className="h-px w-24 bg-[#E8EFF9]"></div>

                        <div className="flex items-center gap-6 text-[12px] font-bold text-[#8899AA] uppercase tracking-widest">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#003087]" />
                                {new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            {data.target_date && (
                                <span className="flex items-center gap-1.5">
                                    <Target className="w-4 h-4 text-[#E31B23]" />
                                    Target: {data.target_date}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons: Share, Bookmark, Print */}
                    <div className="flex items-center justify-center gap-3 border-y border-[#E8EFF9] py-4">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F6FA] hover:bg-[#003087] hover:text-white transition-all text-[#0D1B3E] font-bold text-xs uppercase tracking-wider shadow-sm group"
                        >
                            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Bagikan
                        </button>
                        <button
                            onClick={toggleBookmark}
                            disabled={bookmarkLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-bold text-xs uppercase tracking-wider shadow-sm group ${isBookmarked
                                ? 'bg-[#003087] text-white'
                                : 'bg-[#F4F6FA] text-[#0D1B3E] hover:bg-[#003087] hover:text-white'
                                }`}
                        >
                            <Bookmark className={`w-4 h-4 group-hover:scale-110 transition-transform ${isBookmarked ? 'fill-current' : ''}`} />
                            {bookmarkLoading ? 'Menyimpan...' : isBookmarked ? 'Tersimpan' : 'Simpan'}
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F6FA] hover:bg-[#001A5E] hover:text-white transition-all text-[#0D1B3E] font-bold text-xs uppercase tracking-wider shadow-sm group"
                        >
                            <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" /> Cetak
                        </button>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl scale-[1.02] border-4 border-white">
                    <img
                        src={data.image_url || `https://picsum.photos/seed/${data.id}/1200/500`}
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] font-medium italic">
                        Foto: Dokumen Redaksi Juncto.Media — Unit Investigasi
                    </div>
                </div>

                {/* Content Body */}
                <div className="max-w-[720px] mx-auto">

                    {/* Investigation Focus */}
                    <div className="article-body selection:bg-[#003087]/10 space-y-8">

                        <div className="p-8 bg-gradient-to-br from-[#F8FAFC] to-[#F0F4FA] rounded-2xl border border-[#E8EFF9] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#003087]/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-5 bg-[#E31B23] rounded-full"></div>
                                    <h3 className="text-xs font-black text-[#E31B23] uppercase tracking-[0.2em]">Fokus Investigasi</h3>
                                </div>
                                <p className="text-xl md:text-2xl text-[#0D1B3E] font-heading font-bold leading-relaxed italic">
                                    "{data.description || 'Deskripsi fokus investigasi belum ditambahkan.'}"
                                </p>
                            </div>
                        </div>

                        {/* Timeline / Progress Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#003087] rounded-full"></div>
                                <h3 className="text-xs font-black text-[#003087] uppercase tracking-[0.2em]">Timeline Investigasi</h3>
                            </div>

                            <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#003087] before:to-[#E8EFF9]">
                                <div className="relative">
                                    <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-[#003087] ring-4 ring-[#003087]/10"></div>
                                    <div className="bg-white rounded-xl border border-[#E8EFF9] p-5 shadow-sm">
                                        <div className="text-[10px] font-bold text-[#8899AA] uppercase tracking-wider mb-1">
                                            {new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <p className="text-sm font-bold text-[#0D1B3E]">Kasus investigasi dimulai</p>
                                        <p className="text-xs text-[#8899AA] mt-1">Investigasi dibuka oleh {data.journalist || 'Tim Redaksi Juncto.Media'}</p>
                                    </div>
                                </div>

                                {data.start_date && data.start_date !== data.created_at?.split('T')[0] && (
                                    <div className="relative">
                                        <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-[#4A5FD4] ring-4 ring-[#4A5FD4]/10"></div>
                                        <div className="bg-white rounded-xl border border-[#E8EFF9] p-5 shadow-sm">
                                            <div className="text-[10px] font-bold text-[#8899AA] uppercase tracking-wider mb-1">{data.start_date}</div>
                                            <p className="text-sm font-bold text-[#0D1B3E]">Tahap investigasi lapangan dimulai</p>
                                        </div>
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-[#E8EFF9] ring-4 ring-[#F4F6FA] border-2 border-dashed border-[#8899AA]"></div>
                                    <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E8EFF9] p-5">
                                        <div className="text-[10px] font-bold text-[#8899AA] uppercase tracking-wider mb-1">
                                            {data.target_date || 'Belum ditentukan'}
                                        </div>
                                        <p className="text-sm font-bold text-[#8899AA]">Target penyelesaian investigasi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Reports Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#0D1B3E] rounded-full"></div>
                                <h3 className="text-xs font-black text-[#0D1B3E] uppercase tracking-[0.2em]">Laporan Terkait</h3>
                            </div>
                            <div className="py-12 bg-[#F8FAFC] rounded-2xl border border-dashed border-[#E8EFF9] text-center">
                                <FileText size={40} className="mx-auto text-[#C5D3E8] mb-3 opacity-40" />
                                <h4 className="font-bold text-[#0D1B3E] mb-1">Belum ada laporan terbit</h4>
                                <p className="text-sm text-[#8899AA]">Ikuti terus perkembangan kasus ini untuk mendapatkan laporan eksklusif.</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Footer */}
                    <div className="mt-12 pt-8 border-t border-[#E8EFF9]">
                        <h4 className="text-xs font-black text-[#0D1B3E] uppercase tracking-[0.2em] mb-6 text-center">Bagikan Kasus Ini</h4>
                        <div className="flex justify-center gap-4">
                            {[
                                { name: 'WhatsApp', icon: <Share2 className="w-4 h-4" />, color: '#25D366' },
                                { name: 'Facebook', icon: <Share2 className="w-4 h-4" />, color: '#1877F2' },
                                { name: 'X', icon: <Share2 className="w-4 h-4" />, color: '#000000' }
                            ].map(platform => (
                                <button
                                    key={platform.name}
                                    onClick={handleShare}
                                    className="w-12 h-12 rounded-full border border-[#E8EFF9] flex items-center justify-center hover:scale-110 transition-all text-[#8899AA] shadow-sm hover:text-white"
                                    style={{ '--hover-bg': platform.color } as any}
                                >
                                    {platform.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CTA Banner */}
                    <div className="mt-12 mb-16">
                        <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#0D1B3E] to-[#001A5E] text-white p-8 rounded-2xl shadow-2xl hover:shadow-[#003087]/20 transition-all border border-white/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="flex items-center gap-4 relative z-10 mb-4 md:mb-0">
                                <div className="w-14 h-14 bg-[#E31B23] rounded-xl flex items-center justify-center shadow-inner shrink-0">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-lg">Kawal Kasus Ini</p>
                                    <p className="text-sm text-[#C5D3E8]">Dukung jurnalisme investigasi untuk Indonesia yang lebih transparan.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 relative z-10 shrink-0">
                                <button
                                    onClick={handleShare}
                                    className="bg-white text-[#0D1B3E] px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#E31B23] hover:text-white transition-all"
                                >
                                    Sebarkan
                                </button>
                                <button
                                    onClick={toggleBookmark}
                                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-white/20 transition-all"
                                >
                                    {isBookmarked ? 'Tersimpan ✓' : 'Simpan Kasus'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Back Navigation */}
                    <div className="mb-20 text-center">
                        <Link
                            to="/workspace/investigasi"
                            className="inline-flex items-center gap-2 text-[#003087] hover:text-[#E31B23] font-bold text-sm transition-colors group"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Semua Kasus Investigasi
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
