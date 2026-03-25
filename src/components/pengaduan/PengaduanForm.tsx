import React, { useState } from 'react';
import { Lock, UploadCloud, X, AlertCircle, Megaphone } from 'lucide-react';

interface PengaduanFormProps {
  onSuccess: (reportId: string) => void;
}

export default function PengaduanForm({ onSuccess }: PengaduanFormProps) {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    terlapor: '',
    content: '',
    name: '',
    email: '',
    phone: '',
    agreed: false,
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.category) newErrors.category = 'Kategori wajib dipilih';
    if (!formData.title) newErrors.title = 'Judul laporan wajib diisi';
    else if (formData.title.length < 10) newErrors.title = 'Judul minimal 10 karakter';
    
    if (!formData.terlapor) newErrors.terlapor = 'Instansi/Pihak terlapor wajib diisi';
    else if (formData.terlapor.length < 3) newErrors.terlapor = 'Minimal 3 karakter';
    
    if (!formData.content) newErrors.content = 'Isi laporan wajib diisi';
    else if (formData.content.length < 50) newErrors.content = 'Isi laporan minimal 50 karakter';
    
    if (!formData.agreed) newErrors.agreed = 'Anda harus menyetujui pernyataan ini';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Generate random report number
      const year = new Date().getFullYear();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const reportId = `JM-${year}-${randomNum}`;
      onSuccess(reportId);
    }
  };

  const isFormValid = formData.category && formData.title && formData.terlapor && formData.content && formData.agreed;

  return (
    <div className="bg-white border border-[#E8EFF9] rounded-xl p-5 lg:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0D1B3E] mb-1">Formulir Laporan</h2>
        <div className="flex items-center gap-1.5 text-sm text-[#8899AA]">
          <Lock className="w-3.5 h-3.5" />
          <span>Semua data terenkripsi. Identitas Anda aman.</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Field 1: Kategori */}
        <div>
          <label className="block text-sm font-bold text-[#0D1B3E] mb-2">Kategori Laporan <span className="text-[#E31B23]">*</span></label>
          <select 
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full border ${errors.category ? 'border-[#E31B23]' : 'border-[#E8EFF9]'} rounded-lg h-11 px-3.5 text-sm focus:outline-none focus:border-[#003087] focus:ring-3 focus:ring-[#003087]/10 transition-all bg-white`}
          >
            <option value="">── Pilih Kategori ──</option>
            <option value="kebijakan">📋 Kebijakan — Penyimpangan regulasi/kebijakan</option>
            <option value="anggaran">📊 Anggaran — Dugaan korupsi / mark-up anggaran</option>
            <option value="hukum">⚖️ Hukum — Pelanggaran proses hukum / aparat</option>
            <option value="keadilan">🤝 Keadilan — Pelanggaran HAM / ketidakadilan</option>
            <option value="lainnya">🏛️ Lainnya — Laporan lain yang relevan</option>
          </select>
          {errors.category && <p className="text-[#E31B23] text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.category}</p>}
        </div>

        {/* Field 2: Judul */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-bold text-[#0D1B3E]">Judul Laporan <span className="text-[#E31B23]">*</span></label>
            <span className="text-xs text-[#8899AA]">{formData.title.length}/150</span>
          </div>
          <input 
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={150}
            placeholder="Contoh: Dugaan mark-up proyek jalan Desa X Rp2 Miliar"
            className={`w-full border ${errors.title ? 'border-[#E31B23]' : 'border-[#E8EFF9]'} rounded-lg h-11 px-3.5 text-sm focus:outline-none focus:border-[#003087] focus:ring-3 focus:ring-[#003087]/10 transition-all bg-white`}
          />
          {errors.title && <p className="text-[#E31B23] text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
        </div>

        {/* Field 3: Terlapor */}
        <div>
          <label className="block text-sm font-bold text-[#0D1B3E] mb-2">Instansi / Pihak Terlapor <span className="text-[#E31B23]">*</span></label>
          <input 
            type="text"
            name="terlapor"
            value={formData.terlapor}
            onChange={handleInputChange}
            placeholder="Contoh: Dinas PU Kabupaten Bogor / PT. XYZ"
            className={`w-full border ${errors.terlapor ? 'border-[#E31B23]' : 'border-[#E8EFF9]'} rounded-lg h-11 px-3.5 text-sm focus:outline-none focus:border-[#003087] focus:ring-3 focus:ring-[#003087]/10 transition-all bg-white`}
          />
          {errors.terlapor && <p className="text-[#E31B23] text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.terlapor}</p>}
        </div>

        {/* Field 4: Isi Laporan */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-bold text-[#0D1B3E]">Isi Laporan <span className="text-[#E31B23]">*</span></label>
            <span className="text-xs text-[#8899AA]">{formData.content.length}/3000</span>
          </div>
          <textarea 
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            maxLength={3000}
            placeholder="Jelaskan kronologi, fakta, dan dugaan pelanggaran secara detail. Sertakan tanggal, lokasi, dan pihak-pihak yang terlibat."
            className={`w-full border ${errors.content ? 'border-[#E31B23]' : 'border-[#E8EFF9]'} rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#003087] focus:ring-3 focus:ring-[#003087]/10 transition-all bg-white min-h-[160px] resize-y`}
          />
          {errors.content && <p className="text-[#E31B23] text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.content}</p>}
        </div>

        {/* Field 5: Upload Bukti */}
        <div>
          <label className="block text-sm font-bold text-[#0D1B3E] mb-2">Lampiran Bukti (Opsional)</label>
          <div className="border-2 border-dashed border-[#C5D3E8] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#F4F6FA] transition-colors cursor-pointer relative">
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 bg-[#E8EFF9] rounded-full flex items-center justify-center text-[#003087] mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#0D1B3E] mb-1">Seret file ke sini atau klik untuk pilih</p>
            <p className="text-xs text-[#8899AA]">PDF, JPG, PNG, DOC, XLS &middot; Maks 10MB per file</p>
          </div>
          
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#F4F6FA] border border-[#E8EFF9] rounded-lg p-2.5">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#003087] shrink-0">
                      <FileIcon type={file.type} />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#0D1B3E] truncate">{file.name}</p>
                      <p className="text-[10px] text-[#8899AA]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeFile(idx)}
                    className="p-1.5 text-[#8899AA] hover:text-[#E31B23] hover:bg-white rounded-md transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Field 6: Identitas Pelapor */}
        <div className="border border-[#E8EFF9] rounded-xl overflow-hidden">
          <div className="bg-[#F4F6FA] p-4 flex items-center justify-between border-b border-[#E8EFF9]">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#003087]" />
              <span className="text-sm font-bold text-[#0D1B3E]">Laporkan Secara Anonim</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003087]"></div>
            </label>
          </div>
          
          <div className="p-4">
            {isAnonymous ? (
              <div className="bg-[#EEF0FF] border border-[#C5CFFF] text-[#4A5FD4] p-3.5 rounded-lg text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Identitas Anda tidak akan disimpan. Laporan tetap dapat diproses.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#E8F5EE] border border-[#A5D6A7] text-[#1B5E20] p-3.5 rounded-lg text-sm flex items-start gap-2.5 mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>Informasi Anda hanya digunakan redaksi untuk verifikasi dan tidak dipublikasikan.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D1B3E] mb-1.5">Nama Lengkap (Opsional)</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-[#E8EFF9] rounded-lg h-10 px-3 text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D1B3E] mb-1.5">Email (Opsional)</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-[#E8EFF9] rounded-lg h-10 px-3 text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#0D1B3E] mb-1.5">No. HP / WhatsApp (Opsional)</label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-[#E8EFF9] rounded-lg h-10 px-3 text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5 shrink-0">
              <input 
                type="checkbox" 
                name="agreed"
                checked={formData.agreed}
                onChange={handleInputChange}
                className="peer appearance-none w-5 h-5 border-2 border-[#C5D3E8] rounded bg-white checked:bg-[#003087] checked:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#003087]/20 transition-colors"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm text-[#4A5568] group-hover:text-[#0D1B3E] transition-colors">
              Saya menyatakan laporan ini berdasarkan fakta dan bukan fitnah. Saya bertanggung jawab atas kebenaran informasi yang disampaikan.
            </span>
          </label>
          {errors.agreed && <p className="text-[#E31B23] text-xs mt-1.5 ml-8 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.agreed}</p>}
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={!isFormValid}
          className={`w-full h-12 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-all ${
            isFormValid 
              ? 'bg-[#003087] text-white hover:bg-[#001A5E] shadow-lg shadow-[#003087]/20' 
              : 'bg-[#C5D3E8] text-white cursor-not-allowed'
          }`}
        >
          <Megaphone className="w-5 h-5" />
          Kirim Laporan
        </button>
      </form>
    </div>
  );
}

// Helper for file icon
function FileIcon({ type }: { type: string }) {
  if (type.includes('image')) return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
  if (type.includes('pdf')) return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
