import { useState, useEffect } from 'react';
import { FileText, Download, Plus, Search, FileSignature, FileWarning, FileCheck, Filter, X, Loader2, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DokumenHukum() {
  const [activeTab, setActiveTab] = useState('templates');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    setLoading(true);
    const { data, error } = await supabase
      .from('legal_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTemplates(data);
    }
    setLoading(false);
  }

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Bisnis': return FileSignature;
      case 'Sengketa': return FileWarning;
      case 'Ketenagakerjaan': return FileWarning;
      case 'Properti': return FileSignature;
      default: return FileText;
    }
  };

  const filteredTemplates = templates.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua Kategori' || doc.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const history = [
    { id: 1, title: 'Draft Somasi PT. ABC', date: '24 Mar 2026', status: 'Selesai' },
    { id: 2, title: 'NDA Project X', date: '20 Mar 2026', status: 'Draft' },
  ];

  const categories = ['Semua Kategori', 'Bisnis', 'Sengketa', 'Umum', 'Properti', 'Ketenagakerjaan', 'Keluarga'];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-blue-gray/30">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-dark mb-2">Dokumen Hukum</h1>
          <p className="text-text-medium mb-4">Cari dan gunakan template dokumen hukum yang disusun oleh ahli.</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-gray" />
            <input
              type="text"
              placeholder="Cari template dokumen (misal: Surat Kuasa, Perjanjian Kerja)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-off-white border border-blue-gray/30 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="lg:hidden bg-off-white hover:bg-blue-gray/20 text-dark px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-blue-gray/30"
          >
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter (Desktop) & Mobile Drawer */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl lg:shadow-none lg:bg-transparent lg:static lg:block shrink-0 transition-transform duration-300
          ${showMobileFilter ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col bg-white lg:bg-transparent lg:border-none border-r border-blue-gray/30">
            <div className="p-4 border-b border-blue-gray/30 lg:hidden flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-dark">Filter Dokumen</h2>
              <button onClick={() => setShowMobileFilter(false)} className="p-2 text-text-medium hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 lg:p-0 flex-1 overflow-y-auto">
              <div className="bg-white lg:border border-blue-gray/30 lg:rounded-2xl p-4 lg:p-6 mb-6">
                <h3 className="font-bold text-dark mb-4">Kategori</h3>
                <div className="space-y-2">
                  {categories.map((cat, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-primary focus:ring-primary/20 border-blue-gray/50"
                      />
                      <span className="text-sm font-medium text-text-medium group-hover:text-dark transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white lg:border border-blue-gray/30 lg:rounded-2xl p-4 lg:p-6">
                <h3 className="font-bold text-dark mb-4">Status (Dokumen Saya)</h3>
                <div className="space-y-2">
                  {['Semua Status', 'Draft', 'Menunggu Tanda Tangan', 'Selesai'].map((status, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" defaultChecked={idx === 0} className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-blue-gray/50" />
                      <span className="text-sm font-medium text-text-medium group-hover:text-dark transition-colors">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Backdrop */}
        {showMobileFilter && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setShowMobileFilter(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-blue-gray/30 overflow-hidden">
            <div className="flex border-b border-blue-gray/30">
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 ${activeTab === 'templates' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-medium hover:bg-off-white'}`}
              >
                Template Tersedia
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 ${activeTab === 'history' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-medium hover:bg-off-white'}`}
              >
                Dokumen Saya
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === 'templates' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {loading ? (
                    <div className="col-span-full py-12 flex justify-center">
                      <Loader2 className="animate-spin text-primary w-8 h-8" />
                    </div>
                  ) : filteredTemplates.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-text-medium">
                      Tidak ada template yang ditemukan.
                    </div>
                  ) : (
                    filteredTemplates.map(template => {
                      const Icon = getIconForCategory(template.category);
                      return (
                        <div
                          key={template.id}
                          className="border border-blue-gray/30 rounded-xl p-5 hover:border-primary hover:shadow-md transition-all group flex flex-col h-full bg-white"
                        >
                          <div className="w-12 h-12 bg-light-blue rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                            <Icon className="w-6 h-6 text-primary group-hover:text-white" />
                          </div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-light block">{template.category}</span>
                            {template.is_premium && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Premium</span>
                            )}
                          </div>
                          <h3 className="font-heading font-bold text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">{template.title}</h3>
                          <p className="text-sm text-text-medium mb-4 line-clamp-2 flex-1">{template.description || `Template standar yang dapat disesuaikan untuk kebutuhan ${template.category.toLowerCase()} Anda.`}</p>
                          <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-blue-gray/10">
                            <button onClick={() => setPreviewDoc(template)} className="flex items-center justify-center gap-2 bg-off-white hover:bg-blue-gray/10 text-dark text-sm font-bold py-2.5 rounded-lg transition-colors border border-blue-gray/20">
                              <Eye className="w-4 h-4" /> Preview
                            </button>
                            <a href={`${template.file_url}?download=${encodeURIComponent(template.file_name)}`} className="flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-sm shadow-primary/20">
                              <Download className="w-4 h-4" /> Unduh
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-blue-gray/30 text-sm text-text-medium">
                        <th className="py-3 font-medium">Nama Dokumen</th>
                        <th className="py-3 font-medium">Tanggal Diubah</th>
                        <th className="py-3 font-medium">Status</th>
                        <th className="py-3 font-medium text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(doc => (
                        <tr key={doc.id} className="border-b border-blue-gray/10 hover:bg-off-white transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-blue-gray" />
                              <span className="font-bold text-dark">{doc.title}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-text-medium">{doc.date}</td>
                          <td className="py-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${doc.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="p-2 text-text-medium hover:text-primary transition-colors" title="Unduh">
                              <Download className="w-5 h-5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-text-medium">
                            Belum ada dokumen yang dibuat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-blue-gray/20 bg-off-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-dark text-lg">{previewDoc.title}</h3>
                  <p className="text-xs text-text-medium">{previewDoc.file_name} • {(previewDoc.file_size_kb || 0)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={`${previewDoc.file_url}?download=${encodeURIComponent(previewDoc.file_name)}`} className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
                  <Download className="w-4 h-4" /> Unduh
                </a>
                <button onClick={() => setPreviewDoc(null)} className="p-2 text-text-medium hover:text-dark hover:bg-blue-gray/10 rounded-lg transition-colors shrink-0">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            {/* Modal Body: Google Docs Viewer Iframe */}
            <div className="flex-1 bg-blue-gray/5 relative w-full h-full">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(previewDoc.file_url)}&embedded=true`}
                className="w-full h-full border-none"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
