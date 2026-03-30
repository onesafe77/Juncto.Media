import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Share2, ChevronLeft, ChevronRight, Check, Moon, Sun, Lock, Loader2, AlertCircle, ArrowLeft, ArrowRight, BookOpen, X, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import ReactMarkdown from 'react-markdown';

export default function InvestigasiDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State
    const [data, setData] = useState<any>(null);
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Reader State (-1 = Cover, 0...N = Pages, N+1 = End Screen)
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(-1);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [shareToast, setShareToast] = useState(false);

    // Load user's subscription status (dummy for now: true if user exists, false otherwise, or just use `false` to test paywall)
    // In a real app, query the subscription table. We'll use a simple boolean.
    const hasPremiumAccess = user ? false : false; // Force false to demonstrate paywall

    // LocalStorage keys
    const bookmarkKey = 'inv_bookmarks';
    const progressKey = `inv_progress_${id}`;
    const themeKey = 'inv_theme_dark';

    useEffect(() => {
        // Load preferences
        const savedTheme = localStorage.getItem(themeKey) === 'true';
        setIsDarkMode(savedTheme);

        const currentBookmarks = JSON.parse(localStorage.getItem(bookmarkKey) || '[]');
        setIsBookmarked(currentBookmarks.includes(id));

        const savedProgress = parseInt(localStorage.getItem(progressKey) || '-1', 10);

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

                const parsedPages = typeof investigation.pages === 'string'
                    ? JSON.parse(investigation.pages)
                    : (investigation.pages || []);

                // Sort by order just in case
                parsedPages.sort((a: any, b: any) => a.order - b.order);
                setPages(parsedPages);

                // Restore progress if valid
                if (!isNaN(savedProgress) && savedProgress >= -1 && savedProgress <= parsedPages.length) {
                    setCurrentPageIndex(savedProgress);
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDetail();
    }, [id]);

    // Save progress whenever index changes
    useEffect(() => {
        if (!loading && data) {
            localStorage.setItem(progressKey, currentPageIndex.toString());
        }
    }, [currentPageIndex, data, loading, progressKey]);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem(themeKey, newTheme.toString());
    };

    const toggleBookmark = () => {
        if (!id) return;
        const current = JSON.parse(localStorage.getItem(bookmarkKey) || '[]');
        if (isBookmarked) {
            localStorage.setItem(bookmarkKey, JSON.stringify(current.filter((b: string) => b !== id)));
            setIsBookmarked(false);
        } else {
            localStorage.setItem(bookmarkKey, JSON.stringify([...current, id]));
            setIsBookmarked(true);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `[INVESTIGASI] ${data.title}`,
                    text: data.description || data.title,
                    url: window.location.href,
                });
            } catch (err) { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setShareToast(true);
            setTimeout(() => setShareToast(false), 2500);
        }
    };

    const handleNext = () => {
        if (currentPageIndex < pages.length) {
            setCurrentPageIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        if (currentPageIndex > -1) {
            setCurrentPageIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    // --- RENDER STATES ---

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-[#003087] mb-4" />
            <p className="font-bold text-[#8899AA]">Memuat eBook Investigasi...</p>
        </div>
    );

    if (error || !data) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
            <AlertCircle className="w-12 h-12 text-[#E31B23] mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-[#0D1B3E] mb-2">Kasus Tidak Ditemukan</h2>
            <Link to="/workspace/investigasi" className="mt-4 bg-[#003087] text-white px-8 py-3 rounded-lg font-bold">Kembali</Link>
        </div>
    );

    const isCover = currentPageIndex === -1;
    const isEndScreen = currentPageIndex === pages.length;
    const isLibraryEmpty = pages.length === 0;

    // --- SUB-COMPONENTS VIEWS ---

    const renderCover = () => (
        <div className="min-h-screen bg-[#0D1B3E] text-white flex flex-col relative overflow-hidden">
            {shareToast && <div className="absolute top-6 right-6 z-50 bg-white text-[#0D1B3E] font-bold px-4 py-2 rounded shadow-lg animate-in fade-in slide-in-from-top-4">Tautan disalin!</div>}

            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img src={data.image_url || `https://picsum.photos/seed/${data.id}/1200/800`} alt="Cover" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E] via-[#0D1B3E]/80 to-transparent"></div>
            </div>

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <button onClick={() => navigate('/workspace/investigasi')} className="flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors">
                    <ArrowLeft size={18} /> Kembali
                </button>
                <div className="flex items-center gap-4">
                    <button onClick={toggleBookmark} className="text-white/70 hover:text-white transition-colors">
                        <Bookmark size={20} className={isBookmarked ? "fill-white text-white" : ""} />
                    </button>
                    <button onClick={handleShare} className="text-white/70 hover:text-white transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Cover Content Centered */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full">
                <span className="bg-[#E31B23] text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-[0.2em] mb-6">
                    {data.category || 'Investigasi Eksklusif'}
                </span>

                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg">
                    {data.title}
                </h1>

                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    {data.description}
                </p>

                <div className="flex items-center justify-center gap-6 text-sm font-bold text-white/60 mb-12">
                    <span className="flex items-center gap-2"><BookOpen size={16} /> Oleh {data.journalist}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span>{pages.length} Halaman</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span>~{Math.max(1, Math.round(pages.length * 1.5))} Menit Baca</span>
                </div>

                <button
                    onClick={handleNext}
                    disabled={isLibraryEmpty}
                    className="bg-white text-[#0D1B3E] px-12 py-4 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3"
                >
                    {currentPageIndex === -1 && localStorage.getItem(progressKey) && parseInt(localStorage.getItem(progressKey)!) > -1 ? `Lanjutkan dari Hal ${parseInt(localStorage.getItem(progressKey)!) + 1}` : '▶ Mulai Baca'}
                </button>

                {isLibraryEmpty && <p className="text-red-400 text-sm font-bold mt-4">Belum ada halaman diterbitkan.</p>}
            </div>
        </div>
    );

    const renderThankYouScreen = () => (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDarkMode ? 'bg-[#0A0A0A] text-white' : 'bg-[#F4F6FA] text-[#0D1B3E]'}`}>
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Terima Kasih Telah Membaca!</h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investigasi selesai. Bantu sebarkan karya jurnalistik ini ke jaringan Anda.</p>

                <button onClick={handleShare} className="w-full bg-[#003087] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#002566] transition-colors shadow-lg">
                    <Share2 size={18} /> Bagikan Investigasi Ini
                </button>

                <button onClick={() => navigate('/workspace/investigasi')} className={`w-full py-4 rounded-xl font-bold transition-colors border ${isDarkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-[#E8EFF9] bg-white hover:bg-gray-50'}`}>
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    );

    const renderPageContent = () => {
        const page = pages[currentPageIndex];
        if (!page) return null;

        const isLocked = page.is_locked && !hasPremiumAccess;

        return (
            <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-white text-[#111827]'}`}>
                {/* Thin Progress Bar Top */}
                <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200 z-50">
                    <div className="h-full bg-[#E31B23] transition-all duration-300" style={{ width: `${((currentPageIndex + 1) / pages.length) * 100}%` }}></div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 relative pb-32"> {/* space for bottom nav */}

                    {/* Floating Controls (Theme, Share, Close) */}
                    <div className="fixed top-4 right-4 z-40 flex flex-col gap-2">
                        <button onClick={toggleTheme} className={`p-3 rounded-full shadow-lg transition-colors ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-100'}`}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => navigate('/workspace/investigasi')} className={`p-3 rounded-full shadow-lg transition-colors ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-100'}`}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Block */}
                    <div className={`max-w-[680px] mx-auto px-6 pt-16 md:pt-24 ${isLocked ? 'blur-[8px] select-none pointer-events-none pb-[50vh] overflow-hidden' : ''} transition-all duration-500`}>

                        {page.title && <h2 className="text-2xl md:text-3xl font-black mb-8 leading-snug">{page.title}</h2>}

                        {page.type === 'cover' && (
                            <div className="space-y-6">
                                {page.image_url && <img src={page.image_url} alt={page.title} className="w-full rounded-2xl shadow-md" />}
                                {page.content && <div className="prose prose-lg max-w-none md:prose-xl font-serif text-justify" dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br/>') }} />}
                            </div>
                        )}

                        {page.type === 'text' && (
                            <div className={`prose prose-lg max-w-none md:prose-xl font-serif leading-relaxed text-justify ${isDarkMode ? 'prose-invert prose-p:text-gray-300' : 'prose-p:text-gray-800'}`}>
                                <ReactMarkdown>{page.content}</ReactMarkdown>
                            </div>
                        )}

                        {page.type === 'text_image' && (
                            <div className="space-y-8">
                                {page.image_url && <img src={page.image_url} alt="Ilustrasi" className="w-full rounded-2xl shadow-md" />}
                                <div className={`prose prose-lg max-w-none md:prose-xl font-serif leading-relaxed text-justify ${isDarkMode ? 'prose-invert prose-p:text-gray-300' : 'prose-p:text-gray-800'}`}>
                                    <ReactMarkdown>{page.content}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {page.type === 'quote' && (
                            <div className="py-12 md:py-20 px-8 border-l-4 border-[#E31B23] bg-gradient-to-r from-[#E31B23]/5 to-transparent my-10 rounded-r-xl">
                                <Quote size={48} className="text-[#E31B23]/20 mb-4" />
                                <blockquote className="text-2xl md:text-3xl font-bold font-heading italic leading-relaxed text-[#E31B23]">
                                    "{page.content}"
                                </blockquote>
                            </div>
                        )}

                        {page.type === 'closing' && (
                            <div className="text-center py-20 px-4">
                                <div className="w-16 h-1 bg-[#003087] mx-auto mb-8 rounded-full"></div>
                                <h3 className="text-xl md:text-2xl font-bold mb-6">Investigasi Selesai</h3>
                                <p className="text-lg opacity-80 mb-12 max-w-lg mx-auto">{page.content}</p>
                            </div>
                        )}

                    </div>

                    {/* Paywall Overlay */}
                    {isLocked && (
                        <div className="fixed inset-0 z-40 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-end p-6 pb-40">
                            <div className="bg-white text-center p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-500">
                                <Lock className="w-12 h-12 text-[#E31B23] mx-auto mb-4" />
                                <h3 className="text-2xl font-black text-[#0D1B3E] mb-2 tracking-tight">Konten Premium</h3>
                                <p className="text-gray-600 mb-8 text-sm">Halaman ini eksklusif untuk pelanggan. Berlangganan Juncto.Media mulai Rp 49.000/bulan untuk membaca kelanjutannya.</p>
                                <button className="w-full bg-[#E31B23] text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-black transition-colors mb-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                                    Berlangganan Sekarang
                                </button>
                                {!user && (
                                    <button className="w-full bg-white text-[#0D1B3E] font-bold text-sm py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        Sudah punya akun? Login
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* Sticky Bottom Navigation */}
                <div className={`fixed bottom-0 left-0 right-0 z-50 border-t ${isDarkMode ? 'bg-[#18181B] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'} shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 md:p-6`}>
                    <div className="max-w-[680px] mx-auto flex items-center justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentPageIndex === 0 && isLocked} // Prev allowed if locked but only to go back
                            className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs px-4 py-2 hover:bg-gray-500/10 rounded-lg transition-colors border border-transparent"
                        >
                            <ChevronLeft size={16} /> Kembali
                        </button>

                        <div className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                            Hal {currentPageIndex + 1} / {pages.length}
                        </div>

                        {currentPageIndex === pages.length - 1 ? (
                            <button
                                onClick={handleNext}
                                disabled={isLocked}
                                className={`flex items-center gap-2 font-black uppercase tracking-wider text-xs px-6 py-2.5 rounded-full transition-all shadow-md
                                    ${isLocked ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed' : 'bg-[#10B981] text-white hover:bg-[#059669] hover:scale-105'}`}
                            >
                                Selesai <Check size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={isLocked}
                                className={`flex items-center gap-2 font-black uppercase tracking-wider text-xs px-6 py-2.5 rounded-full transition-all shadow-md
                                    ${isLocked ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed' : 'bg-[#003087] text-white hover:bg-[#002566] hover:scale-105'}`}
                            >
                                Lanjut <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isCover) return renderCover();
    if (isEndScreen) return renderThankYouScreen();
    return renderPageContent();
}
