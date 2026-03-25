import { Bell, FileText, Search, Scale, BarChart2 } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'investigasi',
      title: 'Investigasi Baru: Gurita Bisnis Pejabat Daerah',
      message: 'Laporan investigasi terbaru kami tentang aliran dana proyek infrastruktur daerah telah terbit.',
      time: '2 jam lalu',
      read: false,
      icon: <Search className="w-5 h-5 text-accent" />
    },
    {
      id: 2,
      type: 'hukum',
      title: 'Update Kasus: Vonis Harvey Moeis',
      message: 'Hakim Pengadilan Tipikor Jakarta telah menjatuhkan vonis 20 tahun penjara.',
      time: '5 jam lalu',
      read: false,
      icon: <Scale className="w-5 h-5 text-[#B71C1C]" />
    },
    {
      id: 3,
      type: 'anggaran',
      title: 'Laporan APBN 2025 Tersedia',
      message: 'Analisis mendalam tentang postur APBN 2025 dan dampaknya pada subsidi publik.',
      time: '1 hari lalu',
      read: true,
      icon: <BarChart2 className="w-5 h-5 text-[#1B5E20]" />
    },
    {
      id: 4,
      type: 'kebijakan',
      title: 'RUU Penyiaran: Draf Terbaru',
      message: 'Kami telah memperbarui analisis draf RUU Penyiaran dengan pasal-pasal kontroversial terbaru.',
      time: '2 hari lalu',
      read: true,
      icon: <FileText className="w-5 h-5 text-[#003087]" />
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-primary">
              <Bell className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-dark relative inline-block">
              Notifikasi
              <div className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full bg-primary"></div>
            </h1>
          </div>
          <p className="text-text-medium text-lg mt-6">Pembaruan terbaru dari artikel dan topik yang Anda ikuti.</p>
        </div>
        <button className="text-sm font-bold text-primary hover:text-secondary transition-colors">
          Tandai semua dibaca
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-blue-gray/30 overflow-hidden">
        <div className="divide-y divide-blue-gray/20">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 sm:p-6 flex gap-4 transition-colors hover:bg-off-white cursor-pointer ${!notif.read ? 'bg-blue-gray/5' : ''}`}
            >
              <div className="shrink-0 mt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notif.read ? 'bg-white shadow-sm border border-blue-gray/20' : 'bg-off-white'}`}>
                  {notif.icon}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className={`text-base font-bold ${!notif.read ? 'text-dark' : 'text-text-medium'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs font-medium text-text-light whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
                <p className={`text-sm ${!notif.read ? 'text-text-medium font-medium' : 'text-text-light'}`}>
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="shrink-0 flex items-center justify-center w-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
