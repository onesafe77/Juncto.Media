import React from 'react';
import Logo from './Logo';

export default function FullScreenLoader({ message = 'Memuat...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center">
                <div className="absolute inset-0 bg-[#003087]/20 rounded-full blur-xl animate-pulse scale-150"></div>

                <div className="relative animate-bounce">
                    <Logo className="w-20 h-20 text-[#003087]" />
                </div>

                <h2 className="mt-6 text-2xl font-heading font-extrabold text-[#0D1B3E] tracking-tight">Juncto.Media</h2>
                <p className="mt-2 text-sm font-bold text-[#8899AA] animate-pulse">{message}</p>
            </div>
        </div>
    );
}
