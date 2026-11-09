import React, { useState } from 'react';
import {
  Sparkles,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';

export interface ManagementTileItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'purple' | 'amber' | 'sky' | 'rose' | 'slate';
  actionType?: 'page' | 'modal' | 'link';
  actionLabel?: string;
  onClick: () => void;
}

export interface ManagementActionGroup {
  groupId?: string;
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
  subtitle = 'Phân chia nhóm quản trị chuẩn hóa theo quy trình vận hành tiệm hoa'
}) => {
  // Mobile Quick Filter Tabs
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');

  // Collapsed sections tracking (all expanded by default)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const filteredGroups = selectedGroupFilter === 'ALL'
    ? groups
    : groups.filter((g, index) => (g.groupId || `group-${index}`) === selectedGroupFilter);

  const totalActionsCount = groups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* ================================================================
          1. THANH PHÂN LOẠI NHANH TRÊN MOBILE (SEGMENTED FILTER PILLS)
          Giúp người dùng trên điện thoại bấm lọc ngay phân khu cần thao tác
          ================================================================ */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
        <button
          type="button"
          onClick={() => setSelectedGroupFilter('ALL')}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
            selectedGroupFilter === 'ALL'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ✨ Tất cả ({totalActionsCount})
        </button>

        {groups.map((group, idx) => {
          const gId = group.groupId || `group-${idx}`;
          const isSelected = selectedGroupFilter === gId;

          return (
            <button
              key={gId}
              type="button"
              onClick={() => setSelectedGroupFilter(gId)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs">{group.groupIcon}</span>
              <span>{group.groupTitle.split('&')[0].trim()}</span>
              <span className="text-[9.5px] opacity-75">({group.items.length})</span>
            </button>
          );
        })}
      </div>

      {/* ================================================================
          2. CÁC NHÓM CHỨC NĂNG (CHUẨN PHOTOTIINLOVE)
          Trên Desktop: Thẻ .voucher-tile to đẹp rộng rãi 2-3 cột
          Trên Mobile: Lưới mini 2 cột siêu gọn gàng tiết kiệm 50% diện tích
          ================================================================ */}
      <div className="space-y-6">
        {filteredGroups.map((group, idx) => {
          const gId = group.groupId || `group-${idx}`;
          const isCollapsed = Boolean(collapsedGroups[gId]);

          return (
            <section
              key={gId}
              className="glass-panel p-4 sm:p-6 rounded-[24px] sm:rounded-[28px] border border-amber-100/80 bg-white/90 shadow-sm space-y-3 sm:space-y-4"
              aria-label={group.groupTitle}
            >
              {/* Group Header (Hỗ trợ chạm thu gọn/mở rộng) */}
              <div
                onClick={() => toggleGroupCollapse(gId)}
                className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 pb-2.5"
                title="Bấm để thu gọn / mở rộng nhóm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg">{group.groupIcon}</span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
                    {group.groupTitle}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 ml-1">
                    {group.items.length} mục
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Group Items Grid */}
              {!isCollapsed && (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 animate-in fade-in duration-200">
                  {group.items.map((item) => {
                    const isModal = item.actionType === 'modal';
                    const actionLabel = item.actionLabel || (isModal ? 'Mở popup' : 'Truy cập');

                    return (
                      <article
                        key={item.id}
                        onClick={item.onClick}
                        className="group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white border border-amber-200/90 hover:border-amber-400 shadow-[0_2px_10px_rgba(251,146,60,0.06)] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.98] text-center"
                        title={item.title}
                      >
                        {/* Title (In đậm căn giữa chuẩn PhotoTiin) */}
                        <div className="mb-1.5 sm:mb-2">
                          <b className="block text-xs sm:text-[14.5px] font-bold text-slate-800 group-hover:text-amber-800 transition-colors line-clamp-1 leading-snug">
                            {item.title}
                          </b>
                          {/* Description (Rút gọn 1 dòng trên mobile để cực kỳ ngăn nắp) */}
                          <p className="text-[10px] sm:text-[12.5px] text-slate-500 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Action Button / Pill at bottom (Chuẩn PhotoTiinLove) */}
                        <div className="pt-1.5 sm:pt-2 border-t border-slate-100/90 flex justify-center mt-auto">
                          <span
                            className={`w-full max-w-[140px] sm:max-w-none text-center py-1 sm:py-1.5 px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all shadow-2xs ${
                              isModal
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/90'
                            }`}
                          >
                            {actionLabel}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
