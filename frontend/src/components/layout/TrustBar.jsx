import React from 'react';
import { Phone, Zap, Camera, Gift, ShieldCheck } from 'lucide-react';

export default function TrustBar() {
  return (
    <div className="glass-panel rounded-2xl px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between text-xs text-slate-700 shadow-sm gap-2">
      <div className="flex items-center gap-3">
        <a 
          href="tel:0906721442" 
          className="flex items-center gap-1.5 font-bold text-rose-600 hover:text-rose-700 transition-colors"
        >
          <Phone className="w-4 h-4 animate-pulse text-rose-600" />
          <span>Hotline/Zalo: 0906.721.442 - 0908.251.586</span>
        </a>
        <span className="hidden md:inline text-slate-300">|</span>
        <span className="hidden sm:flex items-center gap-1 text-slate-600">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Giao hỏa tốc 2H tại TP.HCM</span>
        </span>
      </div>

      <div className="flex items-center gap-4 text-slate-600">
        <span className="flex items-center gap-1">
          <Camera className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden lg:inline">Chụp ảnh thật trước & sau giao</span>
          <span className="lg:hidden">Chụp ảnh duyệt</span>
        </span>
        <span className="hidden md:flex items-center gap-1">
          <Gift className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tặng thiệp & banner miễn phí</span>
        </span>
        <span className="flex items-center gap-1 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>100% Hoa tươi nhập mới</span>
        </span>
      </div>
    </div>
  );
}
