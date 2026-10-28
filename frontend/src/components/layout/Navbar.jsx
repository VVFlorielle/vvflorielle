import React from 'react';
import { Search, PackageCheck, Smartphone, Monitor, ShieldAlert, Sparkles } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  onOpenTracking,
  currentView,
  setCurrentView,
  deviceMode,
  setDeviceMode,
  currentTheme,
  setCurrentTheme
}) {
  const categories = [
    'Tất cả',
    'Bó Hoa Sinh Nhật',
    'Hoa Khai Trương',
    'Bó Hoa Tình Yêu',
    'Giỏ Hoa Để Bàn',
    'Lan Hồ Điệp'
  ];

  return (
    <header className="glass-panel rounded-3xl p-4 sm:px-6 mb-6 shadow-md border border-white/70 space-y-3">
      {/* Top row: Brand & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('storefront')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            LP
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-1.5">
              <span>HOA TƯƠI LINH PHƯƠNG</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-200 uppercase tracking-wider">
                Boutique
              </span>
            </div>
            <p className="text-xs text-slate-500 font-serif italic">
              Trao gửi yêu thương qua từng đóa hoa tươi nghệ thuật
            </p>
          </div>
        </div>

        {/* Controls: Search, Theme, Tracking, Device Switcher, Admin */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <input 
              type="text"
              placeholder="Tìm theo hoa, mã MS (LP-108)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input text-xs rounded-full pl-9 pr-4 py-2 w-48 sm:w-60 text-slate-700 focus:w-64 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Tra cứu đơn hàng */}
          <button
            onClick={onOpenTracking}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/70 hover:bg-white text-slate-700 border border-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PackageCheck className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Tra cứu đơn</span>
          </button>

          {/* Theme switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/50 p-1 rounded-xl border border-white/70">
            <button
              onClick={() => setCurrentTheme('theme-rose')}
              title="Theme Romance Rose"
              className={`w-6 h-6 rounded-full bg-rose-400 border-2 ${currentTheme === 'theme-rose' ? 'border-rose-600 ring-2 ring-rose-300' : 'border-white'} shadow-sm`}
            />
            <button
              onClick={() => setCurrentTheme('theme-sage')}
              title="Theme Botanic Sage"
              className={`w-6 h-6 rounded-full bg-emerald-400 border-2 ${currentTheme === 'theme-sage' ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-white'} shadow-sm`}
            />
            <button
              onClick={() => setCurrentTheme('theme-lavender')}
              title="Theme Sweet Lavender"
              className={`w-6 h-6 rounded-full bg-purple-400 border-2 ${currentTheme === 'theme-lavender' ? 'border-purple-600 ring-2 ring-purple-300' : 'border-white'} shadow-sm`}
            />
          </div>

          {/* Device Mockup Toggle (Desktop vs Mobile) */}
          {currentView === 'storefront' && (
            <div className="hidden md:flex items-center gap-1 bg-white/60 p-1 rounded-xl border border-white/80 shadow-inner">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${deviceMode === 'desktop' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-rose-600'}`}
                title="Xem giao diện Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${deviceMode === 'mobile' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-rose-600'}`}
                title="Xem mô phỏng Mobile trong khung điện thoại"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Mobile Frame</span>
              </button>
            </div>
          )}

          {/* Admin Switcher Button (Mở Link riêng của Chủ Quán) */}
          <button
            onClick={() => setCurrentView(currentView === 'admin' ? 'storefront' : 'admin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${currentView === 'admin' ? 'bg-slate-900 text-white ring-2 ring-amber-400' : 'bg-amber-100/90 text-amber-800 border border-amber-300 hover:bg-amber-200'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>{currentView === 'admin' ? '⬅ Về Web Khách' : 'Portal Chủ Quán'}</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Category Pills (Chỉ hiện khi ở Storefront) */}
      {currentView === 'storefront' && (
        <div className="pt-2 border-t border-white/40 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-rose-500 text-white shadow-sm scale-105'
                  : 'bg-white/60 text-slate-700 hover:bg-white/90 border border-white/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
