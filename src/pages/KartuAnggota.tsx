import { useState, useRef } from 'react';
import { Download, Share2, Printer, Calendar, FileText, Star, CheckCircle, AlertTriangle, XCircle, Info, IdCard } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import ValidasiForm from '../components/workspace/ValidasiForm';

interface JournalistMember {
  id: string;
  name: string;
  photo: string;
  position: string;
  desk: string;
  joinDate: string;
  validUntil: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  articlesCount: number;
  email: string;
}

const mockMember: JournalistMember = {
  id: 'JM-2025-00142',
  name: 'Budi Santoso',
  photo: 'https://i.pravatar.cc/300?img=11',
  position: 'Reporter Investigasi',
  desk: 'Hukum & Keadilan',
  joinDate: '01 Januari 2025',
  validUntil: '31 Desember 2025',
  status: 'active',
  articlesCount: 47,
  email: 'budi.santoso@juncto.media'
};

export default function KartuAnggota() {
  const [activeTab, setActiveTab] = useState<'kartu' | 'validasi'>('kartu');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mock user state
  const isJournalist = true;
  const membershipStatus = mockMember.status;

  useEffect(() => {
    if (isJournalist && (membershipStatus === 'active' || membershipStatus === 'expired')) {
      const validationUrl = `https://juncto.media/validasi?id=${mockMember.id}`;
      QRCode.toDataURL(validationUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#003087',
          light: '#FFFFFF'
        }
      }).then(url => {
        setQrCodeDataUrl(url);
      }).catch(err => {
        console.error('Error generating QR code', err);
      });
    }
  }, [isJournalist, membershipStatus]);

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A6 landscape size in mm: 148 x 105
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a6'
      });
      
      // Calculate dimensions to fit the card properly
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Kartu-Jurnalis-Juncto-${mockMember.name.replace(/\s+/g, '-')}-${mockMember.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Gagal mengunduh kartu. Silakan coba lagi.');
    }
  };

  const handleShare = () => {
    const validationUrl = `https://juncto.media/validasi?id=${mockMember.id}`;
    navigator.clipboard.writeText(validationUrl)
      .then(() => alert('Link validasi disalin ke clipboard ✓'))
      .catch(() => alert('Gagal menyalin link'));
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    // Simple mock calculation
    return 292;
  };
  
  const daysRemaining = calculateDaysRemaining();
  const progressPercentage = Math.min(100, Math.max(0, (daysRemaining / 365) * 100));
  
  let progressColor = '#10B981'; // Green
  if (daysRemaining <= 30) progressColor = '#E31B23'; // Red
  else if (daysRemaining <= 60) progressColor = '#F59E0B'; // Amber

  if (!isJournalist) {
    return (
      <div className="p-4 lg:p-8 max-w-[800px] mx-auto">
        <div className="bg-white rounded-xl border border-blue-gray/20 overflow-hidden shadow-sm p-8 text-center">
          <div className="w-24 h-24 bg-blue-gray/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <IdCard className="w-12 h-12 text-blue-gray/40" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-dark mb-4">Kartu Anggota Jurnalis</h2>
          <p className="text-text-medium mb-8 max-w-md mx-auto">
            Anda belum terdaftar sebagai jurnalis anggota Juncto.Media.
            Ingin bergabung sebagai jurnalis? Hubungi redaksi untuk informasi keanggotaan dan proses pendaftaran.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors w-full sm:w-auto">
              Hubungi Redaksi
            </button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-blue-gray/20">
            <p className="text-text-medium mb-4">Ingin memvalidasi kartu jurnalis lain?</p>
            <button 
              onClick={() => setActiveTab('validasi')}
              className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors"
            >
              Validasi Kartu
            </button>
          </div>
        </div>
        
        {activeTab === 'validasi' && (
          <div className="mt-8">
            <ValidasiForm />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[1000px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-dark mb-2">Kartu Anggota Jurnalis</h1>
        <p className="text-text-medium">Kelola kartu identitas digital Anda dan verifikasi keanggotaan.</p>
      </div>

      <div className="flex border-b border-blue-gray/20 mb-8">
        <button
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'kartu' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-text-medium hover:text-dark'
          }`}
          onClick={() => setActiveTab('kartu')}
        >
          Kartu Saya
        </button>
        <button
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'validasi' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-text-medium hover:text-dark'
          }`}
          onClick={() => setActiveTab('validasi')}
        >
          Validasi Kartu
        </button>
      </div>

      {activeTab === 'kartu' && (
        <div className="space-y-8">
          {membershipStatus === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Kartu Sedang Diproses</h3>
                <p className="text-blue-800 text-sm">
                  Pengajuan kartu anggota Anda sedang dalam proses verifikasi oleh tim redaksi. 
                  Anda akan menerima notifikasi setelah kartu aktif.
                </p>
              </div>
            </div>
          )}

          {(membershipStatus === 'active' || membershipStatus === 'expired') && (
            <>
              {/* Digital Card Container */}
              <div className="flex flex-col items-center">
                <div 
                  ref={cardRef}
                  className="w-full max-w-[400px] aspect-[1.67] rounded-xl overflow-hidden relative shadow-xl print:shadow-none bg-[#003087] text-white"
                  style={{
                    backgroundImage: 'radial-gradient(circle at top right, #0040B5, #003087)'
                  }}
                >
                  {/* Accent Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E31B23]"></div>
                  
                  {/* Header Strip */}
                  <div className="h-12 bg-[#001A5E] flex items-center justify-between px-4 pl-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-[#003087] font-bold text-[10px]">
                        JM
                      </div>
                      <span className="font-heading font-extrabold tracking-tight text-sm">Juncto.Media</span>
                    </div>
                    
                    {membershipStatus === 'active' ? (
                      <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        AKTIF
                      </span>
                    ) : (
                      <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        EXPIRED
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 pl-6 flex gap-4 h-[calc(100%-48px)]">
                    {/* Photo */}
                    <div className="w-[72px] shrink-0 flex flex-col justify-between">
                      <div className="w-[72px] h-[96px] rounded-lg overflow-hidden border-2 border-white/20 bg-white/10">
                        <img src={mockMember.photo} alt={mockMember.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                      </div>
                      
                      {/* QR Code */}
                      {qrCodeDataUrl && (
                        <div className="mt-auto bg-white p-1 rounded">
                          <img src={qrCodeDataUrl} alt="QR Code" className="w-[64px] h-[64px]" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <h2 className="text-[18px] font-extrabold text-white leading-tight mb-1">
                        {mockMember.name}
                      </h2>
                      <p className="text-[11px] text-white/80 font-mono mb-3">
                        NIM: {mockMember.id}
                      </p>
                      
                      <div className="space-y-1.5 text-[10px] text-white/75 flex-1">
                        <div className="grid grid-cols-[60px_1fr]">
                          <span>Jabatan</span>
                          <span className="text-white font-medium">: {mockMember.position}</span>
                        </div>
                        <div className="grid grid-cols-[60px_1fr]">
                          <span>Desk</span>
                          <span className="text-white font-medium">: {mockMember.desk}</span>
                        </div>
                        <div className="grid grid-cols-[60px_1fr]">
                          <span>Bergabung</span>
                          <span className="text-white font-medium">: {mockMember.joinDate}</span>
                        </div>
                        <div className="grid grid-cols-[60px_1fr]">
                          <span>Berlaku s.d</span>
                          <span className="text-white font-medium">: {mockMember.validUntil}</span>
                        </div>
                      </div>

                      <div className="text-[7px] text-white/50 mt-auto text-center pr-4">
                        juncto.media/validasi
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-gray/20 rounded-lg text-sm font-bold text-dark hover:bg-off-white transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-gray/20 rounded-lg text-sm font-bold text-dark hover:bg-off-white transition-colors shadow-sm"
                  >
                    <Share2 className="w-4 h-4" /> Bagikan
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-gray/20 rounded-lg text-sm font-bold text-dark hover:bg-off-white transition-colors shadow-sm"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl border border-blue-gray/20 p-6 max-w-[600px] mx-auto">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-off-white rounded-lg border border-blue-gray/10">
                    <div className="flex items-center justify-center gap-2 text-primary font-bold text-xl mb-1">
                      <Calendar className="w-5 h-5" /> 365
                    </div>
                    <div className="text-xs text-text-medium">Hari Sisa Aktif</div>
                  </div>
                  <div className="text-center p-4 bg-off-white rounded-lg border border-blue-gray/10">
                    <div className="flex items-center justify-center gap-2 text-primary font-bold text-xl mb-1">
                      <FileText className="w-5 h-5" /> {mockMember.articlesCount}
                    </div>
                    <div className="text-xs text-text-medium">Artikel Dipublikasi</div>
                  </div>
                  <div className="text-center p-4 bg-off-white rounded-lg border border-blue-gray/10">
                    <div className="flex items-center justify-center gap-2 text-primary font-bold text-xl mb-1">
                      <Star className="w-5 h-5" /> Reporter
                    </div>
                    <div className="text-xs text-text-medium">Level Kartu</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-dark mb-2">
                    <span>Masa Aktif Keanggotaan</span>
                    <span>{Math.round(progressPercentage)}% ({daysRemaining}/365 hari)</span>
                  </div>
                  <div className="w-full h-2.5 bg-blue-gray/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${progressPercentage}%`,
                        backgroundColor: progressColor
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'validasi' && (
        <ValidasiForm />
      )}
    </div>
  );
}
