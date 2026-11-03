import React from 'react';
import { ChevronRight, ExternalLink, Sparkles } from 'lucide-react';

export interface ManagementTileItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string; // e.g. 'bg-emerald-100 text-emerald-800'
  badge?: string;
  badgeColor?: 'emerald' | 'purple' | 'amber' | 'sky' | 'rose' | 'slate';
  actionType: 'page' | 'modal' | 'link';
  actionLabel?: string;
  onClick: () => void;
}

export interface ManagementActionGroup {
  groupTitle: string;
  groupIcon?: React.ReactNode;
  badge?: string;
  items: ManagementTileItem[];
}

interface ManagementFunctionalGridProps {
  groups: ManagementActionGroup[];
  title?: string;
  subtitle?: string;
}

export const ManagementFunctionalGrid: React.FC<ManagementFunctionalGridProps> = ({
  groups,
  title = 'Danh Mục Chức Năng Quản Trị Hệ Thống',
  subtitle = 'Nhấp vào từng khối chức năng để mở trang quản lý chi tiết hoặc bật popup thao tác nhanh'
}) => {
  const getBadgeStyle = (color: ManagementTileItem['badgeColor'] = 'emerald') => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'sky':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'rose':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'slate':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'emerald':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header section of the functional grid */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Groups list */}
      <div className="space-y-8">
        {groups.map((group, groupIdx) => (
          <section key={groupIdx} className="space-y-3.5">
            {/* Group Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {group.groupIcon && (
                  <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold shadow-xs">
                    {group.groupIcon}
                  </span>
                )}
                <h3 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wide">
                  {group.groupTitle}
                </h3>
              </div>
              {group.badge && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {group.badge}
                </span>
              )}
            </div>

            {/* Grid of Large Functional Cards (Cards to phototiinlove style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {group.items.map((item) => {
                const badgeStyle = getBadgeStyle(item.badgeColor);
                return (
                  <article
                    key={item.id}
                    onClick={item.onClick}
                    className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    {/* Top ambient highlight line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Top Bar inside Card: Icon & Badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                            item.iconBgColor || 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}
                        >
                          {item.icon}
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${badgeStyle}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors flex items-center gap-1">
                        {item.actionLabel || (item.actionType === 'modal' ? 'Mở popup' : 'Truy cập quản lý')}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-700 flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
                        {item.actionType === 'modal' ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
