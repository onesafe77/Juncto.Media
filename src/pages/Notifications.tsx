import { Bell, FileText, Search, Scale, BarChart2, Loader2, CheckCircle } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'investigasi': return <Search className="w-5 h-5 text-accent" />;
      case 'hukum': return <Scale className="w-5 h-5 text-[#B71C1C]" />;
      case 'anggaran': return <BarChart2 className="w-5 h-5 text-[#1B5E20]" />;
      case 'kebijakan': return <FileText className="w-5 h-5 text-[#003087]" />;
      default: return <Bell className="w-5 h-5 text-[#003087]" />;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-[#003087]">
              <Bell className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0D1B3E] relative inline-block">
              Notifikasi
              <div className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full bg-[#003087]"></div>
            </h1>
          </div>
          <p className="text-[#4A5568] text-lg mt-6">Pembaruan terbaru dari artikel dan topik yang Anda ikuti.</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-sm font-bold text-[#003087] hover:text-[#E31B23] transition-colors flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4" /> Tandai semua dibaca
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8EFF9] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#003087] mb-4" />
            <p className="font-bold text-[#8899AA]">Memuat notifikasi...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-[#E8EFF9]">
            {notifications.map((notif) => (
              <Link
                key={notif.id}
                to={notif.link || '#'}
                onClick={() => {
                  if (!notif.is_read) markAsRead(notif.id);
                }}
                className={`p-4 sm:p-6 flex gap-4 transition-all hover:bg-[#F4F6FA] cursor-pointer group ${!notif.is_read ? 'bg-[#003087]/5' : ''}`}
              >
                <div className="shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${!notif.is_read ? 'bg-white shadow-md border border-[#E8EFF9] scale-110' : 'bg-[#F4F6FA]'}`}>
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className={`text-base font-bold transition-colors ${!notif.is_read ? 'text-[#0D1B3E]' : 'text-[#4A5568] group-hover:text-[#003087]'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs font-medium text-[#8899AA] whitespace-nowrap">
                      {new Date(notif.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${!notif.is_read ? 'text-[#4A5568] font-medium' : 'text-[#8899AA]'}`}>
                    {notif.message}
                  </p>

                  {notif.link && (
                    <span className="text-xs font-bold text-[#003087] group-hover:text-[#E31B23] transition-colors">
                      Lihat Detail &rarr;
                    </span>
                  )}
                </div>
                {!notif.is_read && (
                  <div className="shrink-0 flex items-center justify-center w-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E31B23] shadow-sm animate-pulse"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <Bell className="w-16 h-16 text-[#C5D3E8] mx-auto mb-4 opacity-30" />
            <h3 className="font-bold text-[#0D1B3E] mb-1">Tidak ada notifikasi</h3>
            <p className="text-sm text-[#8899AA]">Anda akan menerima notifikasi saat ada artikel atau investigasi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
}
