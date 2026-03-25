import React, { useState } from 'react';
import { Search, Camera, Upload, CheckCircle, AlertTriangle, XCircle, Ban } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

// Mock validation function
const validateCard = async (id: string) => {
  // Simulate API call
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      if (id === 'JM-2025-00142') {
        resolve({
          found: true,
          status: 'valid',
          checkedAt: new Date().toISOString(),
          member: {
            id: 'JM-2025-00142',
            name: 'Budi Santoso',
            photo: 'https://i.pravatar.cc/300?img=11',
            position: 'Reporter Investigasi',
            desk: 'Hukum & Keadilan',
            joinDate: '01 Januari 2025',
            validUntil: '31 Desember 2025',
            status: 'active'
          }
        });
      } else if (id === 'JM-2024-00089') {
        resolve({
          found: true,
          status: 'expired',
          checkedAt: new Date().toISOString(),
          member: {
            id: 'JM-2024-00089',
            name: 'Siti Aminah',
            photo: 'https://i.pravatar.cc/300?img=5',
            position: 'Fotografer',
            desk: 'Kebijakan',
            joinDate: '01 Januari 2024',
            validUntil: '31 Desember 2024',
            status: 'expired'
          }
        });
      } else if (id === 'JM-2023-00012') {
        resolve({
          found: true,
          status: 'revoked',
          checkedAt: new Date().toISOString(),
          member: {
            id: 'JM-2023-00012',
            name: 'Andi Wijaya',
            photo: 'https://i.pravatar.cc/300?img=8',
            position: 'Editor',
            desk: 'Anggaran',
            joinDate: '01 Januari 2023',
            validUntil: '31 Desember 2023',
            status: 'revoked'
          }
        });
      } else {
        resolve({
          found: false,
          status: 'not_found',
          checkedAt: new Date().toISOString(),
          member: null
        });
      }
    }, 1000);
  });
};

export default function ValidasiForm({ initialId = '' }: { initialId?: string }) {
  const [activeTab, setActiveTab] = useState<'input' | 'scan'>('input');
  const [inputId, setInputId] = useState(initialId);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    if (initialId) {
      handleValidate(initialId);
    }
  }, [initialId]);

  useEffect(() => {
    if (activeTab === 'scan' && !scannerActive) {
      const scanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          // Assuming the QR code contains a URL like https://juncto.media/validasi?id=JM-2025-00142
          try {
            const url = new URL(decodedText);
            const id = url.searchParams.get('id');
            if (id) {
              scanner.clear();
              setScannerActive(false);
              setInputId(id);
              setActiveTab('input');
              handleValidate(id);
            } else {
              // Maybe it's just the ID
              if (decodedText.startsWith('JM-')) {
                scanner.clear();
                setScannerActive(false);
                setInputId(decodedText);
                setActiveTab('input');
                handleValidate(decodedText);
              }
            }
          } catch (e) {
            // Not a URL, check if it's an ID
            if (decodedText.startsWith('JM-')) {
              scanner.clear();
              setScannerActive(false);
              setInputId(decodedText);
              setActiveTab('input');
              handleValidate(decodedText);
            }
          }
        },
        (error) => {
          // Ignore errors during scanning
        }
      );

      setScannerActive(true);

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    
    // Auto format JM-YYYY-NNNNN
    if (val.length > 0 && !val.startsWith('JM-')) {
      if (val.startsWith('J') || val.startsWith('JM')) {
        // Let them type
      } else {
        val = 'JM-' + val;
      }
    }
    
    // Add dashes automatically
    if (val.length === 7 && !val.endsWith('-') && inputId.length < 7) {
      val = val + '-';
    }

    setInputId(val);
  };

  const handleValidate = async (idToValidate: string = inputId) => {
    if (!idToValidate || idToValidate.length < 10) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const data = await validateCard(idToValidate);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  return (
    <div className="max-w-[500px] mx-auto">
      <div className="bg-white rounded-xl border border-blue-gray/20 overflow-hidden shadow-sm">
        <div className="p-6 text-center border-b border-blue-gray/10">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            🔓 Dapat diakses publik
          </div>
          <h2 className="text-xl font-heading font-bold text-dark mb-2">Validasi Kartu Jurnalis</h2>
          <p className="text-text-medium text-sm">
            Verifikasi keaslian kartu anggota jurnalis Juncto.Media. Masukkan nomor ID kartu atau scan QR Code.
          </p>
        </div>

        <div className="flex border-b border-blue-gray/10">
          <button
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'input' ? 'bg-off-white text-primary border-b-2 border-primary' : 'text-text-medium hover:bg-off-white/50'
            }`}
            onClick={() => setActiveTab('input')}
          >
            <span className="text-lg">🔢</span> Masukkan Nomor ID
          </button>
          <button
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'scan' ? 'bg-off-white text-primary border-b-2 border-primary' : 'text-text-medium hover:bg-off-white/50'
            }`}
            onClick={() => setActiveTab('scan')}
          >
            <Camera className="w-4 h-4" /> Scan QR Code
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'input' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Nomor ID Kartu Jurnalis</label>
                <input
                  type="text"
                  value={inputId}
                  onChange={handleInputChange}
                  placeholder="JM-2025-00000"
                  className="w-full px-4 py-3 rounded-lg border border-blue-gray/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-lg tracking-wider"
                  maxLength={14}
                />
                <p className="text-xs text-text-light mt-2">Format: JM-YYYY-NNNNN (contoh: JM-2025-00142)</p>
              </div>
              
              <button
                onClick={() => handleValidate()}
                disabled={isLoading || inputId.length < 13}
                className="w-full py-3 bg-[#003087] text-white rounded-lg font-bold hover:bg-[#002266] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5" /> Cek Validasi
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div id="reader" className="w-full overflow-hidden rounded-lg border border-blue-gray/30 bg-black"></div>
              <p className="text-center text-sm text-text-medium">
                Arahkan kamera ke QR Code pada kartu jurnalis
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          {result.status === 'valid' && (
            <div className="bg-white rounded-xl border-2 border-[#10B981] overflow-hidden shadow-lg">
              <div className="bg-[#E8F5EE] p-4 flex items-center justify-center gap-2 border-b border-[#10B981]/20">
                <CheckCircle className="w-6 h-6 text-[#1A8C5B]" />
                <span className="text-[#1A8C5B] font-bold text-lg">Kartu VALID</span>
              </div>
              
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <img src={result.member.photo} alt={result.member.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-gray/10" />
                  <div>
                    <h3 className="font-heading font-bold text-xl text-dark">{result.member.name}</h3>
                    <p className="text-text-medium font-mono text-sm">ID: {result.member.id}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-text-light">Jabatan</span>
                    <span className="font-medium text-dark">: {result.member.position}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-text-light">Desk</span>
                    <span className="font-medium text-dark">: {result.member.desk}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-text-light">Status</span>
                    <span className="font-medium text-[#10B981] flex items-center gap-1">: 🟢 AKTIF</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-text-light">Berlaku</span>
                    <span className="font-medium text-dark">: s.d. {result.member.validUntil}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6 bg-off-white p-4 rounded-lg border border-blue-gray/10">
                  <div className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" /> Terdaftar sebagai jurnalis resmi
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" /> Kartu diterbitkan oleh Juncto.Media
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" /> Masa berlaku valid
                  </div>
                </div>
                
                <div className="text-xs text-text-light italic text-center">
                  Diverifikasi pada: {formatDate(result.checkedAt)}
                </div>
              </div>
            </div>
          )}

          {result.status === 'expired' && (
            <div className="bg-white rounded-xl border-2 border-[#F59E0B] overflow-hidden shadow-lg">
              <div className="bg-[#FFF6E0] p-4 flex items-center justify-center gap-2 border-b border-[#F59E0B]/20">
                <AlertTriangle className="w-6 h-6 text-[#C47A00]" />
                <span className="text-[#C47A00] font-bold text-lg">Kartu EXPIRED</span>
              </div>
              
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <img src={result.member.photo} alt={result.member.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-gray/10 grayscale" />
                  <div>
                    <h3 className="font-heading font-bold text-xl text-dark">{result.member.name}</h3>
                    <p className="text-text-medium font-mono text-sm">ID: {result.member.id}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-text-light">Status</span>
                    <span className="font-medium text-[#F59E0B] flex items-center gap-1">: 🟡 KADALUARSA</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-text-light">Berlaku</span>
                    <span className="font-medium text-dark">: s.d. {result.member.validUntil}</span>
                  </div>
                </div>
                
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm font-medium flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  Kartu ini sudah melewati masa berlaku dan tidak dapat digunakan sebagai identitas resmi jurnalis Juncto.Media.
                </div>
              </div>
            </div>
          )}

          {result.status === 'not_found' && (
            <div className="bg-white rounded-xl border-2 border-[#E31B23] overflow-hidden shadow-lg">
              <div className="bg-[#FFEBEE] p-4 flex items-center justify-center gap-2 border-b border-[#E31B23]/20">
                <XCircle className="w-6 h-6 text-[#C41A1A]" />
                <span className="text-[#C41A1A] font-bold text-lg">Kartu Tidak Valid</span>
              </div>
              
              <div className="p-6 text-center">
                <p className="text-dark font-medium mb-6">
                  Nomor ID "{inputId}" tidak terdaftar dalam sistem Juncto.Media.
                </p>
                
                <div className="bg-off-white p-4 rounded-lg text-left text-sm text-text-medium mb-6">
                  <p className="font-bold text-dark mb-2">Kemungkinan:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Nomor ID salah atau tidak lengkap</li>
                    <li>Kartu tidak diterbitkan oleh Juncto.Media</li>
                    <li>Kartu telah dicabut dari sistem</li>
                  </ul>
                </div>
                
                <button 
                  onClick={() => {
                    setResult(null);
                    setInputId('');
                  }}
                  className="px-6 py-2 bg-white border border-blue-gray/30 rounded-lg font-bold text-dark hover:bg-off-white transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {result.status === 'revoked' && (
            <div className="bg-white rounded-xl border-2 border-[#6B7280] overflow-hidden shadow-lg">
              <div className="bg-[#F3F4F6] p-4 flex items-center justify-center gap-2 border-b border-[#6B7280]/20">
                <Ban className="w-6 h-6 text-[#374151]" />
                <span className="text-[#374151] font-bold text-lg">Kartu DICABUT</span>
              </div>
              
              <div className="p-6">
                <p className="text-dark font-medium mb-4 text-center">
                  Kartu ini tercatat dalam sistem namun telah dicabut oleh Redaksi Juncto.Media.
                </p>
                
                <div className="bg-off-white p-4 rounded-lg text-sm text-text-medium">
                  <div className="grid grid-cols-[140px_1fr] mb-2">
                    <span className="text-text-light">Alasan:</span>
                    <span className="font-medium text-dark">Tidak lagi aktif sebagai anggota</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr]">
                    <span className="text-text-light">Tanggal pencabutan:</span>
                    <span className="font-medium text-dark">15 Januari 2025</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
