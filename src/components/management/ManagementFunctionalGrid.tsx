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
          Đảm bảo mỗi nút chỉ có đúng 1 icon gọn gàng, không bị trùng lặp icon
          ================================================================ */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
        <button
          type="button"
          onClick={() => setSelectedGroupFilter('ALL')}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
            selectedGroupFilter === 'ALL'
              ? 'theme-active-tab text-white shadow-xs'
              : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
          style={selectedGroupFilter === 'ALL' ? { backgroundColor: 'var(--primary-color, #059669)', color: '#ffffff' } : undefined}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Tất cả</span>
          <span className="text-[9.5px] opacity-75">({totalActionsCount})</span>
        </button>

        {groups.map((group, idx) => {
          const gId = group.groupId || `group-${idx}`;
          const isSelected = selectedGroupFilter === gId;
          // Lấy vế đầu ngắn gọn trước dấu '&' và loại bỏ emoji thừa
          const cleanShortTitle = group.groupTitle
            .split('&')[0]
            .replace(/[^\p{L}\p{N}\s]/gu, '')
            .trim();

          return (
            <button
              key={gId}
              type="button"
              onClick={() => setSelectedGroupFilter(gId)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'theme-active-tab text-white shadow-xs'
                  : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
              style={isSelected ? { backgroundColor: 'var(--primary-color, #059669)', color: '#ffffff' } : undefined}
            >
              <span className="text-xs shrink-0 flex items-center">{group.groupIcon}</span>
              <span>{cleanShortTitle}</span>
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
              {/* Group Header (Căn chính giữa chuẩn chỉn chu, hỗ trợ chạm thu gọn/mở rộng) */}
              <div
                onClick={() => toggleGroupCollapse(gId)}
                className="relative flex items-center justify-between cursor-pointer select-none border-b border-slate-100 pb-2.5"
                title="Bấm để thu gọn / mở rộng nhóm"
              >
                <div className="w-6 sm:w-8 shrink-0" />
                <div className="flex items-center gap-2 mx-auto">
                  <span className="text-base sm:text-lg">{group.groupIcon}</span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
                    {group.groupTitle.replace(/[^\p{L}\p{N}\s&]/gu, '').trim()}
                  </h3>
                  <span
                    className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ml-1"
                    style={{
                      backgroundColor: 'var(--primary-light, #ecfdf5)',
                      color: 'var(--primary-color, #059669)',
                      borderColor: 'var(--primary-border, rgba(16, 185, 129, 0.35))'
                    }}
                  >
                    {group.items.length} mục
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 hover:text-slate-600 shrink-0">
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
                        className="group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white border border-slate-200/90 hover:border-[var(--primary-color)]/50 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_var(--primary-glow,rgba(5,150,105,0.12))] transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.98] text-center"
                        title={item.title}
                      >
                        {/* Title (In đậm căn giữa chuẩn PhotoTiin) */}
                        <div className="mb-1.5 sm:mb-2">
                          <b className="block text-xs sm:text-[14.5px] font-bold text-slate-800 group-hover:text-[var(--primary-color)] transition-colors line-clamp-1 leading-snug">
                            {item.title}
                          </b>
                          {/* Description (Rút gọn 1 dòng trên mobile để cực kỳ ngăn nắp) */}
                          <p className="text-[10px] sm:text-[12.5px] text-slate-500 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Action Button / Pill at bottom (Đồng bộ theo màu thương hiệu Branding, viền sắc nét nhẹ nhàng) */}
                        <div className="pt-1.5 sm:pt-2 border-t border-slate-100/90 flex justify-center mt-auto">
                          <span
                            className="management-action-btn w-full max-w-[140px] sm:max-w-none text-center py-1 sm:py-1.5 px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 shadow-2xs border"
                            style={{
                              borderColor: 'var(--primary-border, rgba(16, 185, 129, 0.35))',
                              backgroundColor: 'var(--primary-light, #ecfdf5)',
                              color: 'var(--primary-color, #059669)'
                            }}
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
