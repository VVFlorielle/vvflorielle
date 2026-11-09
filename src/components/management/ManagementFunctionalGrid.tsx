import React from 'react';
import { Sparkles, LayoutGrid } from 'lucide-react';

export interface ManagementTileItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string; // e.g. 'bg-emerald-100 text-emerald-800'
  badge?: string;
  badgeColor?: 'emerald' | 'purple' | 'amber' | 'sky' | 'rose' | 'slate';
  actionType?: 'page' | 'modal' | 'link';
  actionLabel?: string;
  onClick: () => void;
}

export interface ManagementActionGroup {
  groupTitle?: string;
  groupIcon?: React.ReactNode;
  badge?: string;
  items: ManagementTileItem[];
}

interface ManagementFunctionalGridProps {
  groups?: ManagementActionGroup[];
  items?: ManagementTileItem[];
  title?: string;
  subtitle?: string;
}

export const ManagementFunctionalGrid: React.FC<ManagementFunctionalGridProps> = ({
  groups,
  items,
  title = 'Danh Mục Chức Năng Quản Trị Hệ Thống',
  subtitle = 'Nhấp vào nút để truy cập nhanh phân hệ nghiệp vụ hoặc mở popup thao tác'
}) => {
  // Flatten items if groups are passed, or use items directly
  const allItems: ManagementTileItem[] = items || (groups ? groups.flatMap((g) => g.items) : []);

  const getBadgeStyle = (color: ManagementTileItem['badgeColor'] = 'emerald') => {
    switch (color) {
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'sky':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'slate':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'emerald':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-emerald-100/90 shadow-sm bg-white/90 space-y-4 select-none animate-in fade-in duration-200">
      {/* 1. Header Khung Gọn Gàng */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700 shadow-2xs">
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            {allItems.length} Nút Nghiệp Vụ
          </span>
        </div>
      </div>

      {/* 2. Lưới Nút 1 Hàng 4 Nút Trên Desktop (2 Cột Trên Mobile), KHÔNG CÓ DẢI "MỞ..." Ở ĐÁY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {allItems.map((item) => {
          const badgeStyle = getBadgeStyle(item.badgeColor);

          return (
            <div
              key={item.id}
              onClick={item.onClick}
              className="group relative p-3 sm:p-4 rounded-2xl bg-white/85 hover:bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 active:scale-98 overflow-hidden"
              title={item.title}
            >
              {/* Top ambient highlight line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Icon & Badge Row */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs transition-transform duration-200 group-hover:scale-105 ${
                      item.iconBgColor || 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                  >
                    {item.icon}
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs whitespace-nowrap shrink-0 ${badgeStyle}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[32px] sm:min-h-[38px] mb-1 leading-snug">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-[10.5px] sm:text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
