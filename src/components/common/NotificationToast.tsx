import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationToastProps {
    show: boolean;
    title: string;
    message: string;
    link?: string;
    onClose: () => void;
}

export default function NotificationToast({ show, title, message, link, onClose }: NotificationToastProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-[100] w-[calc(100%-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E8EFF9] overflow-hidden"
                >
                    <div className="p-4 flex gap-4">
                        <div className="shrink-0">
                            <div className="w-10 h-10 rounded-full bg-[#E31B23]/10 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-[#E31B23]" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#0D1B3E] text-sm mb-1 truncate">{title}</h4>
                            <p className="text-[#8899AA] text-xs line-clamp-2 mb-3">{message}</p>

                            <div className="flex items-center gap-3">
                                {link && (
                                    <Link
                                        to={link}
                                        onClick={onClose}
                                        className="text-[11px] font-bold text-[#003087] hover:text-[#E31B23] flex items-center gap-1 transition-colors"
                                    >
                                        Baca Sekarang <ExternalLink className="w-3 h-3" />
                                    </Link>
                                )}
                                <button
                                    onClick={onClose}
                                    className="text-[11px] font-bold text-[#8899AA] hover:text-[#0D1B3E] transition-colors"
                                >
                                    Nanti Saja
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="shrink-0 self-start p-1 text-[#8899AA] hover:text-[#0D1B3E] hover:bg-[#F4F6FA] rounded-lg transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="h-1 bg-[#E31B23] w-full origin-left animate-progress"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
