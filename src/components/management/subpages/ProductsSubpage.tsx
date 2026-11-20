import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Percent,
  Sparkles,
  Search,
  Flower2,
  AlertCircle,
  Tag as TagIcon,
  Download,
  Cloud,
  CloudUpload,
  CloudDownload,
  RotateCcw,
  CheckSquare,
  Square,
  Calendar,
  HardDrive,
  CheckCircle2,
  FolderArchive,
  RefreshCw,
  FileText,
  Check,
  ShieldCheck,
  Clock,
  Layers,
  Archive,
  X
} from 'lucide-react';
import { FlowerProduct, FlowerCategory, CategoryId, ArchivedFlowerProduct } from '../../../types';
import { ActionConfirmModal } from '../ManagementModals';
import { useStore } from '../../../context/StoreContext';
import { formatBytes } from '../../../utils/googleDriveArchiver';
import { useBodyScrollLock } from '../../../utils/scrollLock';

interface ProductsSubpageProps {
  products: FlowerProduct[];
  categories?: FlowerCategory[];
  onBackToDashboard: () => void;
  onOpenAddProduct: () => void;
  onOpenEditProduct: (product: FlowerProduct) => void;
  onOpenBulkDiscount: () => void;
  deleteProduct: (id: string) => void;
  formatPrice: (p: number) => string;
  title?: string;
}

// Subcomponent for safe image loading with zero broken icons
const ProductThumbnail: React.FC<{
  imageUrl?: string;
  name: string;
  tag?: string;
  discountPercent?: number;
  isAvailable?: boolean;
}> = ({ imageUrl, name, tag, discountPercent, isAvailable = true }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 relative group border border-slate-100">
      {!hasError && imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-emerald-100/60 to-teal-50 text-emerald-800 select-none">
          <div className="w-9 h-9 rounded-full bg-white/80 shadow-2xs flex items-center justify-center text-emerald-700 mb-1">
            <Flower2 className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-emerald-950 line-clamp-1">{name}</span>
          <span className="text-[9px] text-emerald-700/80">V&amp;V Florielle Studio</span>
        </div>
      )}

      {/* Floating Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
        {tag && (
          <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {tag}
          </span>
        )}
        {!isAvailable && (
          <span className="bg-slate-800/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
            Tạm hết hoa
          </span>
        )}
      </div>

      {discountPercent && discountPercent > 0 ? (
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <span className="bg-rose-500/95 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" />
            <span>-{discountPercent}%</span>
          </span>
        </div>
      ) : null}
    </div>
  );
};

export const ProductsSubpage: React.FC<ProductsSubpageProps> = ({
  products,
  categories = [],
  onBackToDashboard,
  onOpenAddProduct,
  onOpenEditProduct,
  onOpenBulkDiscount,
  deleteProduct,
  formatPrice,
  title = 'Quản Lý Danh Mục & Mẫu Hoa Tươi'
}) => {
  const {
    archivedProducts,
    deleteProductToArchive,
    restoreArchivedProduct,
    restoreMultipleArchivedProducts,
    permanentlyDeleteArchivedProduct,
    permanentlyDeleteMultipleArchivedProducts,
    backupTrashToGoogleDrive,
    restoreTrashFromGoogleDrive,
    batchUpdateProductFulfillmentType
  } = useStore();

  // Multi-selection state cho mẫu hoa đang bán
  const [selectedActiveProductIds, setSelectedActiveProductIds] = useState<string[]>([]);

  // Modal Popup Nổi Quản Lý Bản Nháp & Kho Đã Xóa
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  useBodyScrollLock(isArchiveModalOpen);

  // Active Catalog Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [productToDelete, setProductToDelete] = useState<FlowerProduct | null>(null);

  // Archive / Trash State
  const [archiveSearchQuery, setArchiveSearchQuery] = useState('');
  const [archiveCategoryFilter, setArchiveCategoryFilter] = useState<string>('all');
  const [archiveTimeFilter, setArchiveTimeFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [selectedArchiveIds, setSelectedArchiveIds] = useState<string[]>([]);
  const [isBackingUpDrive, setIsBackingUpDrive] = useState(false);

  // Action Modals for Trash
  const [archiveToRestore, setArchiveToRestore] = useState<ArchivedFlowerProduct | null>(null);
  const [archiveToHardDelete, setArchiveToHardDelete] = useState<ArchivedFlowerProduct | null>(null);
  const [isBulkRestoreModalOpen, setIsBulkRestoreModalOpen] = useState(false);
  const [isBulkHardDeleteModalOpen, setIsBulkHardDeleteModalOpen] = useState(false);

  // Filter Active Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.flowerTypes?.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Calculate Days for Archive Time Filter
  const getDaysSince = (isoDateStr: string): number => {
    if (!isoDateStr) return 0;
    const d = new Date(isoDateStr).getTime();
    if (isNaN(d)) return 0;
    return Math.max(0, (Date.now() - d) / (1000 * 60 * 60 * 24));
  };

  // Filter Archived Products
  const filteredArchived = archivedProducts.filter((item) => {
    const p = item.originalProduct;
    const matchesSearch =
      archiveSearchQuery.trim() === '' ||
      p.name.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
      p.flowerTypes?.some((f) => f.toLowerCase().includes(archiveSearchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(archiveSearchQuery.toLowerCase()));

    const matchesCategory =
      archiveCategoryFilter === 'all' ||
      item.originalCategoryId === archiveCategoryFilter ||
      p.categoryId === archiveCategoryFilter;

    let matchesTime = true;
    const days = getDaysSince(item.deletedAt);
    if (archiveTimeFilter === '7days') matchesTime = days <= 7;
    else if (archiveTimeFilter === '30days') matchesTime = days <= 30;
    else if (archiveTimeFilter === '90days') matchesTime = days <= 90;

    return matchesSearch && matchesCategory && matchesTime;
  });

  // Total Trash Size
  const totalTrashSizeBytes = archivedProducts.reduce((sum, i) => sum + (i.sizeBytes || 0), 0);

  // Export Active Catalog CSV
  const handleExportCatalogCsv = () => {
    if (filteredProducts.length === 0) return;
    const headers = ['Mã Hoa', 'Tên Mẫu Hoa', 'Danh Mục', 'Giá Bán (VNĐ)', 'Giá Gốc (VNĐ)', 'Hoa Thành Phần', 'Huy Hiệu/Tag', 'Trạng Thái', 'Số Ảnh'];
    const rows = filteredProducts.map((p) => [
      `"${p.id}"`,
      `"${p.name}"`,
      `"${p.categoryId}"`,
      `"${p.price}"`,
      `"${p.originalPrice || p.price}"`,
      `"${(p.flowerTypes || []).join('; ')}"`,
      `"${p.tag || ''}"`,
      `"${p.isAvailable !== false ? 'Còn hoa' : 'Tạm hết'}"`,
      `"${p.imageUrl ? 1 : 0}"`
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bang_Gia_Hoa_Tuoi_VVFlorielle_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Google Drive Backup trigger
  const handleTriggerDriveBackup = async () => {
    setIsBackingUpDrive(true);
    try {
      await backupTrashToGoogleDrive();
    } finally {
      setIsBackingUpDrive(false);
    }
  };

  // Multi-Select Handlers
  const handleToggleSelectAll = () => {
    if (selectedArchiveIds.length === filteredArchived.length && filteredArchived.length > 0) {
      setSelectedArchiveIds([]);
    } else {
      setSelectedArchiveIds(filteredArchived.map((i) => i.id));
    }
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedArchiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Active Catalog Multi-Select Handlers
  const handleToggleSelectActiveProduct = (id: string) => {
    setSelectedActiveProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllActive = () => {
    if (selectedActiveProductIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedActiveProductIds([]);
    } else {
      setSelectedActiveProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const discountedCount = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  ).length;

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200 select-none">
      {/* 1. Header căn giữa chuẩn Phototiinlove */}
      <div className="pb-3 border-b border-slate-200/80 text-center">
        <small className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
          KHO HOA TƯƠI &amp; BẢNG GIÁ
        </small>
        <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      {/* 2. ACTION TOOLBAR (GỌN GÀNG TỐI ƯU MOBILE & DESKTOP) */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3 flex-wrap">
        {/* Nút BẢN NHÁP (Màu đỏ cam nổi bật, bấm mở popup nổi Quản lý kho đã xóa & Drive) */}
        <button
          type="button"
          onClick={() => setIsArchiveModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 border border-orange-200 hover:border-orange-400 text-orange-950 font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          title="Mở kho Bản Nháp & Quản lý mẫu hoa đã xóa (sao lưu Google Drive, phục hồi)"
        >
          <Archive className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform shrink-0" />
          <span>Bản Nháp</span>
          {archivedProducts.length > 0 && (
            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-orange-600 text-white leading-none">
              {archivedProducts.length}
            </span>
          )}
        </button>

        {/* Các nút thao tác kho hoa: Xuất CSV, Giảm Giá, Thêm Mới */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap justify-end">
          {/* Export Catalog CSV */}
          <button
            type="button"
            onClick={handleExportCatalogCsv}
            disabled={filteredProducts.length === 0}
            className={`btn-secondary text-xs py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 cursor-pointer text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs font-bold ${
              filteredProducts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Xuất bảng giá và danh mục mẫu hoa ra file CSV Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Xuất Bảng Giá ({filteredProducts.length})</span>
            <span className="sm:hidden">CSV</span>
          </button>

          {/* Bulk Event Discount Button */}
          <button
            type="button"
            onClick={onOpenBulkDiscount}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/90 hover:border-rose-400 text-rose-800 hover:text-rose-900 font-bold text-xs shadow-2xs transition-all cursor-pointer hover:shadow-sm"
            title="Thiết lập sự kiện giảm giá đồng loạt theo % cho toàn bộ kho hoa hoặc từng danh mục dịp lễ"
          >
            <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" />
            <span className="hidden sm:inline">Sự Kiện Giảm Giá</span>
            <span className="sm:hidden">Giảm Giá</span>
          </button>

          {/* Add New Product Button */}
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="btn-primary text-xs py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer font-bold"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Thêm Mẫu Hoa Mới</span>
            <span className="sm:hidden">Thêm Hoa</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DANH SÁCH MẪU HOA ĐANG MỞ BÁN (ACTIVE PRODUCTS CATALOG) */}
      {/* ========================================================================= */}
      <div className="space-y-4 animate-in fade-in duration-150">
          {/* Control & Search Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên mẫu hoa hoặc hoa thành phần..."
                className="w-full !pl-10 !pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                Tất Cả ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('khai-truong')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === 'khai-truong'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                Khai Trương
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('sinh-nhat')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === 'sinh-nhat'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                Sinh Nhật
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('tinh-yeu')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === 'tinh-yeu'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                Tình Yêu
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('lan-ho-diep')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === 'lan-ho-diep'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                Lan Hồ Điệp
              </button>
            </div>
          </div>

          {/* Summary stats strip */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex items-center gap-3">
              <span>
                Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} mẫu hoa
              </span>
              {discountedCount > 0 && (
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/70 text-[11px]">
                  <Sparkles className="w-3 h-3" />
                  {discountedCount} mẫu đang ưu đãi
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">Bố cục 4 mẫu 1 hàng chuẩn desktop</span>
          </div>

          {/* BULK ACTION BAR KHI CHỌN NHIỀU MẪU HOA */}
          {selectedActiveProductIds.length > 0 && (
            <div className="sticky top-20 z-30 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl flex items-center justify-between gap-3 flex-wrap border border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg">
                  Đã chọn {selectedActiveProductIds.length}/{filteredProducts.length} mẫu
                </span>
                <button
                  type="button"
                  onClick={handleToggleSelectAllActive}
                  className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
                >
                  {selectedActiveProductIds.length === filteredProducts.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    batchUpdateProductFulfillmentType(selectedActiveProductIds, 'CHO_CAM');
                    setSelectedActiveProductIds([]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
                  title="Chuyển các mẫu đã chọn sang Chờ Cắm (chuẩn bị >= 90 phút)"
                >
                  <span>🌸 Chuyển sang Chờ Cắm</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    batchUpdateProductFulfillmentType(selectedActiveProductIds, 'SAN_GIAO');
                    setSelectedActiveProductIds([]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
                  title="Chuyển các mẫu đã chọn sang Sẵn Giao (chuẩn bị 15 phút)"
                >
                  <span>⚡ Chuyển sang Sẵn Giao</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    batchUpdateProductFulfillmentType(selectedActiveProductIds, 'NONE');
                    setSelectedActiveProductIds([]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-all cursor-pointer"
                  title="Ẩn nhãn cho các mẫu đã chọn"
                >
                  <span>Ẩn nhãn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedActiveProductIds([])}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Hủy chọn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 4-COLUMN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isSelected = selectedActiveProductIds.includes(product.id);
              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : undefined;

              return (
                <div
                  key={product.id}
                  className={`p-3 rounded-2xl bg-white border transition-all space-y-2 flex flex-col justify-between group ${
                    isSelected
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md'
                  }`}
                >
                  {/* Top: Checkbox chọn nhiều & Badge trạng thái Chờ Cắm / Sẵn Giao */}
                  <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleSelectActiveProduct(product.id)}
                      className="p-0.5 text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
                      title={isSelected ? 'Bỏ chọn mẫu này' : 'Tích chọn để đổi trạng thái'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">#{product.id}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const nextType = product.fulfillmentType === 'SAN_GIAO' ? 'CHO_CAM' : product.fulfillmentType === 'NONE' ? 'SAN_GIAO' : 'SAN_GIAO';
                        batchUpdateProductFulfillmentType([product.id], nextType);
                      }}
                      className="cursor-pointer transition-transform active:scale-95"
                      title="Nhấn để đổi nhanh: Chờ Cắm / Sẵn Giao"
                    >
                      {product.fulfillmentType === 'SAN_GIAO' ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                          <span>⚡</span> Sẵn Giao
                        </span>
                      ) : product.fulfillmentType === 'NONE' ? (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                          Ẩn nhãn
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-0.5">
                          <span>🌸</span> Chờ Cắm
                        </span>
                      )}
                    </button>
                  </div>
                  {/* Product Top: Thumbnail with safe error handling + badges */}
                  <div className="space-y-2">
                    <ProductThumbnail
                      imageUrl={product.imageUrl}
                      name={product.name}
                      tag={product.tag}
                      discountPercent={discountPercent}
                      isAvailable={product.isAvailable}
                    />

                    {/* Details */}
                    <div>
                      <h4
                        className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      {/* Price Row with Discount */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-black text-sm text-emerald-700">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Description / Flowers */}
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.flowerTypes?.join(', ') || product.description}
                      </p>
                    </div>
                  </div>

                  {/* Product Footer: Dịp label + Action Buttons: Sửa & Xóa */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">
                      Dịp: {product.categoryId}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Sửa Button */}
                      <button
                        type="button"
                        onClick={() => onOpenEditProduct(product)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300 text-[11px] font-bold transition-all cursor-pointer"
                        title={`Chỉnh sửa thông tin & giá mẫu hoa "${product.name}"`}
                      >
                        <Pencil className="w-3 h-3 text-emerald-600" />
                        <span>Sửa</span>
                      </button>

                      {/* Xóa Button (Soft Delete into Trash) */}
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="inline-flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-700 border border-slate-200/80 hover:border-amber-300 text-[11px] font-bold transition-all cursor-pointer"
                        title={`Chuyển mẫu hoa "${product.name}" vào Kho Bản Nháp & Đã Xóa`}
                      >
                        <Trash2 className="w-3 h-3 text-amber-600" />
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
              <Flower2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-sm text-slate-700">Không tìm thấy mẫu hoa phù hợp</p>
              <p className="text-xs text-slate-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bấm &quot;Thêm Mẫu Hoa Mới&quot; để tạo mẫu hoa thiết kế.
              </p>
            </div>
          )}
        </div>

      {/* ========================================================================= */}
      {/* POPUP NỔI: QUẢN LÝ BẢN NHÁP & KHO ĐÃ XÓA (MODAL POPUP OVERLAY VIA PORTAL) */}
      {/* ========================================================================= */}
      {isArchiveModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="glass-overlay z-[100000] p-2 sm:p-4 md:p-6 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsArchiveModalOpen(false)}
        >
          <div
            className="glass-modal-content max-w-5xl w-full max-h-[92vh] sm:max-h-[88vh] rounded-[24px] sm:rounded-[32px] border border-white/80 bg-white/95 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. POPUP HEADER */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between gap-3 bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-rose-50/90 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-600 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
                  <Archive className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                      Kho Bản Nháp &amp; Mục Đã Xóa
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                      {archivedProducts.length} mẫu hoa
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Quản lý phục hồi mẫu hoa và sao lưu dữ liệu sang Google Drive
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
                title="Đóng popup Bản Nháp"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. POPUP BODY (SCROLLABLE) */}
            <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
              {/* Sleek Minimalist Drive Sync Toolbar */}
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-2.5 flex-wrap">
                {/* Stats badge */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-1">
                  <span>Kho: <strong className="text-slate-900">{archivedProducts.length}</strong> hoa</span>
                  <span className="text-slate-300">•</span>
                  <span>Dung lượng: <strong className="text-emerald-700">{formatBytes(totalTrashSizeBytes)}</strong></span>
                </div>

                {/* Drive Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Sync to Google Drive */}
                  <button
                    type="button"
                    onClick={handleTriggerDriveBackup}
                    disabled={isBackingUpDrive || archivedProducts.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Đẩy dữ liệu mẫu hoa đã xóa sang Google Drive"
                  >
                    {isBackingUpDrive ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CloudUpload className="w-3.5 h-3.5" />
                    )}
                    <span>Sao Lưu Lên Drive</span>
                  </button>

                  {/* Restore from Drive */}
                  <button
                    type="button"
                    onClick={() => restoreTrashFromGoogleDrive()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    title="Tải lại danh sách hoa đã sao lưu từ Google Drive hoặc tệp JSON"
                  >
                    <CloudDownload className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Tải Lại Từ Drive</span>
                    <span className="sm:hidden">Tải Lại</span>
                  </button>
                </div>
              </div>

          {/* Search & Filter Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={archiveSearchQuery}
                onChange={(e) => setArchiveSearchQuery(e.target.value)}
                placeholder="Tìm hoa đã xóa theo tên hoặc thành phần..."
                className="w-full !pl-10 !pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Filter by Category */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Danh mục:</span>
              </div>
              <select
                value={archiveCategoryFilter}
                onChange={(e) => setArchiveCategoryFilter(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">Tất Cả Danh Mục ({archivedProducts.length})</option>
                <option value="khai-truong">Hoa Khai Trương</option>
                <option value="sinh-nhat">Hoa Sinh Nhật</option>
                <option value="tinh-yeu">Hoa Tình Yêu</option>
                <option value="lan-ho-diep">Lan Hồ Điệp</option>
                <option value="chuc-mung">Hoa Chúc Mừng</option>
                <option value="chia-buon">Hoa Chia Buồn</option>
              </select>

              {/* Filter by Time */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 ml-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Thời gian:</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setArchiveTimeFilter('all')}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    archiveTimeFilter === 'all'
                      ? 'bg-amber-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tất Cả
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveTimeFilter('7days')}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    archiveTimeFilter === '7days'
                      ? 'bg-amber-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  7 Ngày
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveTimeFilter('30days')}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    archiveTimeFilter === '30days'
                      ? 'bg-amber-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  30 Ngày
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveTimeFilter('90days')}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    archiveTimeFilter === '90days'
                      ? 'bg-amber-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  3 Tháng
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Action Strip (When items selected) */}
          {selectedArchiveIds.length > 0 && (
            <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500 text-white flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckSquare className="w-4 h-4" />
                <span>Đã chọn {selectedArchiveIds.length} / {filteredArchived.length} mẫu hoa</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkRestoreModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Khôi Phục Đã Chọn ({selectedArchiveIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBulkHardDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Hẳn ({selectedArchiveIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedArchiveIds([])}
                  className="text-xs text-amber-100 hover:text-white underline cursor-pointer ml-1"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          )}

          {/* TABLE / LIST OF ARCHIVED PRODUCTS */}
          {filteredArchived.length > 0 ? (
            <div className="space-y-3">
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden sm:block rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold text-[11px]">
                        <th className="py-2.5 px-3 w-10 text-center">
                          <button
                            type="button"
                            onClick={handleToggleSelectAll}
                            className="cursor-pointer inline-flex items-center justify-center text-slate-500 hover:text-amber-600"
                            title="Chọn tất cả hoặc bỏ chọn"
                          >
                            {selectedArchiveIds.length === filteredArchived.length && filteredArchived.length > 0 ? (
                              <CheckSquare className="w-4 h-4 text-amber-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="py-2.5 px-3 w-16">Hình Ảnh</th>
                        <th className="py-2.5 px-3 min-w-[180px]">Tên &amp; Thành Phần Hoa</th>
                        <th className="py-2.5 px-3 min-w-[120px]">Vị Trí Trước Khi Xóa</th>
                        <th className="py-2.5 px-3 min-w-[100px]">Dung Lượng</th>
                        <th className="py-2.5 px-3 min-w-[140px]">Ngày Xóa &amp; Drive</th>
                        <th className="py-2.5 px-3 text-right min-w-[140px]">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredArchived.map((item) => {
                        const isSelected = selectedArchiveIds.includes(item.id);
                        const p = item.originalProduct;

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-amber-50/40 transition-colors ${
                              isSelected ? 'bg-amber-50/70' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleSelectItem(item.id)}
                                className="cursor-pointer inline-flex items-center justify-center text-slate-500 hover:text-amber-600"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-amber-600" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            {/* Thumbnail */}
                            <td className="py-2.5 px-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/thumb shrink-0">
                                {p.imageUrl ? (
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                    <Flower2 className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Name & Flower types */}
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {p.flowerTypes?.join(', ') || p.description}
                              </div>
                              <div className="font-extrabold text-[11px] text-emerald-700 mt-0.5">
                                {formatPrice(p.price)}
                              </div>
                            </td>

                            {/* Original category */}
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                <Layers className="w-3 h-3 text-slate-400" />
                                <span>{item.originalCategoryName || p.categoryId}</span>
                              </span>
                            </td>

                            {/* Size */}
                            <td className="py-2.5 px-3 text-[11px] font-semibold text-slate-600">
                              <span>~{item.sizeFormatted}</span>
                            </td>

                            {/* Deleted Date & Drive status */}
                            <td className="py-2.5 px-3 space-y-1">
                              <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{item.formattedDeletedAt}</span>
                              </div>
                              <div>
                                {item.driveBackedUp ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                                    <Cloud className="w-2.5 h-2.5 text-sky-600" />
                                    <span>Đã lưu trên Drive</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                    <HardDrive className="w-2.5 h-2.5 text-slate-400" />
                                    <span>Lưu trên máy</span>
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Row Actions */}
                            <td className="py-2.5 px-3 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                {/* Restore Row Button */}
                                <button
                                  type="button"
                                  onClick={() => setArchiveToRestore(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                                  title="Khôi phục mẫu hoa này về danh mục bán"
                                >
                                  <RotateCcw className="w-3 h-3 text-emerald-600" />
                                  <span>Khôi Phục</span>
                                </button>

                                {/* Hard Delete Row Button */}
                                <button
                                  type="button"
                                  onClick={() => setArchiveToHardDelete(item)}
                                  className="inline-flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                                  title="Xóa vĩnh viễn mẫu hoa này khỏi kho lưu trữ"
                                >
                                  <Trash2 className="w-3 h-3 text-rose-600" />
                                  <span className="hidden sm:inline">Xóa Hẳn</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE 2-ROW CARD VIEW (KHÔNG CẦN CUỘN NGANG) */}
              <div className="sm:hidden space-y-2.5">
                {/* Select All on Mobile */}
                <div className="flex items-center justify-between px-1 py-0.5 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="inline-flex items-center gap-1.5 font-bold cursor-pointer text-slate-700 hover:text-amber-700"
                  >
                    {selectedArchiveIds.length === filteredArchived.length && filteredArchived.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Chọn tất cả ({filteredArchived.length})</span>
                  </button>
                  {selectedArchiveIds.length > 0 && (
                    <span className="text-[11px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                      Đã chọn {selectedArchiveIds.length}
                    </span>
                  )}
                </div>

                {filteredArchived.map((item) => {
                  const isSelected = selectedArchiveIds.includes(item.id);
                  const p = item.originalProduct;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl bg-white border transition-all space-y-2.5 shadow-2xs ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400/30'
                          : 'border-slate-200/90'
                      }`}
                    >
                      {/* HÀNG 1: Checkbox + Ảnh + Tên hoa (nhỏ lại, xuống 2 dòng) + Giá bán */}
                      <div className="flex items-start gap-2.5">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleSelectItem(item.id)}
                          className="pt-1 cursor-pointer text-slate-400 hover:text-amber-600 shrink-0"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        {/* Thumbnail vuông 44px */}
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <Flower2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Tên hoa nhỏ lại, xuống dòng 2 hàng + Giá tiền */}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                            {p.name}
                          </h4>
                          {p.flowerTypes && p.flowerTypes.length > 0 && (
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                              {p.flowerTypes.join(', ')}
                            </p>
                          )}
                          <div className="font-extrabold text-xs text-emerald-700 mt-0.5">
                            {formatPrice(p.price)}
                          </div>
                        </div>
                      </div>

                      {/* HÀNG 2: Thông số vị trí/ngày bên trái + 2 Nút thao tác Khôi Phục & Xóa bên phải */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Thông tin phụ */}
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 truncate max-w-[90px]">
                            {item.originalCategoryName || p.categoryId}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {item.formattedDeletedAt?.split(' ')[0] || ''}
                          </span>
                          {item.driveBackedUp ? (
                            <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1 py-0.2 rounded border border-sky-200">
                              Drive
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                              {item.sizeFormatted}
                            </span>
                          )}
                        </div>

                        {/* 2 Nút bấm bấm trực tiếp tại chỗ không cần cuộn ngang */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setArchiveToRestore(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                            title="Khôi phục mẫu hoa này về danh mục bán"
                          >
                            <RotateCcw className="w-3 h-3 text-emerald-600" />
                            <span>Khôi Phục</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setArchiveToHardDelete(item)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                            title="Xóa vĩnh viễn mẫu hoa này khỏi kho lưu trữ"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-12 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2.5">
              <FolderArchive className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-sm text-slate-700">Kho Bản Nháp &amp; Đã Xóa Đang Trống</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Hiện không có mẫu hoa nào nằm trong kho lưu trữ đã xóa. Khi bạn xóa bất kỳ mẫu hoa nào ở danh mục bán, mẫu hoa đó sẽ được chuyển vào đây để bảo toàn an toàn.
              </p>
            </div>
          )}
        </div>

        {/* 3. POPUP FOOTER */}
        <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Mẫu hoa khôi phục sẽ tự động quay về đúng danh mục ban đầu trên website.
          </p>
          <button
            type="button"
            onClick={() => setIsArchiveModalOpen(false)}
            className="ml-auto px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Modal Soft Delete Confirmation (Active -> Archive) */}
      <ActionConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProductToArchive(productToDelete.id);
            setProductToDelete(null);
          }
        }}
        title="Chuyển Vào Bản Nháp & Kho Đã Xóa"
        message={`Bạn có chắc muốn chuyển mẫu hoa "${productToDelete?.name}" vào Bản Nháp & Kho Lưu Trữ Đã Xóa? Mẫu hoa sẽ được lưu trữ an toàn và có thể khôi phục lại bất kỳ lúc nào mà không bị mất dữ liệu.`}
        confirmText="Chuyển Vào Bản Nháp"
        type="warning"
      />

      {/* 2. Modal Single Restore Confirmation */}
      <ActionConfirmModal
        isOpen={Boolean(archiveToRestore)}
        onClose={() => setArchiveToRestore(null)}
        onConfirm={() => {
          if (archiveToRestore) {
            restoreArchivedProduct(archiveToRestore.id);
            setArchiveToRestore(null);
          }
        }}
        title="Khôi Phục Mẫu Hoa Về Cửa Hàng"
        message={`Bạn có chắc chắn muốn khôi phục mẫu hoa "${archiveToRestore?.originalProduct?.name}" về danh mục bán trên website không? Hệ thống sẽ tự động ghép nối vào danh mục tương ứng (${archiveToRestore?.originalCategoryName}) và đảm bảo dữ liệu vận hành hoàn hảo không bị xung đột.`}
        confirmText="Đồng Ý Khôi Phục"
        type="info"
      />

      {/* 3. Modal Bulk Restore Confirmation */}
      <ActionConfirmModal
        isOpen={isBulkRestoreModalOpen}
        onClose={() => setIsBulkRestoreModalOpen(false)}
        onConfirm={() => {
          restoreMultipleArchivedProducts(selectedArchiveIds);
          setSelectedArchiveIds([]);
          setIsBulkRestoreModalOpen(false);
        }}
        title="Khôi Phục Hàng Loạt Mẫu Hoa Đã Chọn"
        message={`Bạn có chắc chắn muốn khôi phục ${selectedArchiveIds.length} mẫu hoa đã chọn về danh mục bán trên website không? Hệ thống sẽ tự động giải quyết chống xung đột ID và ghép nối đúng danh mục tương ứng.`}
        confirmText={`Khôi Phục ${selectedArchiveIds.length} Hoa`}
        type="info"
      />

      {/* 4. Modal Single Permanent Delete (Hard Delete) */}
      <ActionConfirmModal
        isOpen={Boolean(archiveToHardDelete)}
        onClose={() => setArchiveToHardDelete(null)}
        onConfirm={() => {
          if (archiveToHardDelete) {
            permanentlyDeleteArchivedProduct(archiveToHardDelete.id);
            setSelectedArchiveIds((prev) => prev.filter((x) => x !== archiveToHardDelete.id));
            setArchiveToHardDelete(null);
          }
        }}
        title="Xóa Vĩnh Viễn Khỏi Kho Lưu Trữ"
        message={`CẢNH BÁO NGUY HIỂM: Thao tác này sẽ xóa vĩnh viễn mẫu hoa "${archiveToHardDelete?.originalProduct?.name}" khỏi kho lưu trữ và KHÔNG THỂ PHỤC HỒI LẠI ĐƯỢC NỮA. Bạn có chắc chắn muốn xóa vĩnh viễn không?`}
        confirmText="Xóa Vĩnh Viễn"
        type="danger"
      />

      {/* 5. Modal Bulk Hard Delete */}
      <ActionConfirmModal
        isOpen={isBulkHardDeleteModalOpen}
        onClose={() => setIsBulkHardDeleteModalOpen(false)}
        onConfirm={() => {
          permanentlyDeleteMultipleArchivedProducts(selectedArchiveIds);
          setSelectedArchiveIds([]);
          setIsBulkHardDeleteModalOpen(false);
        }}
        title="Xóa Vĩnh Viễn Hàng Loạt Khỏi Kho Lưu Trữ"
        message={`CẢNH BÁO NGUY HIỂM: Bạn đang chuẩn bị xóa vĩnh viễn ${selectedArchiveIds.length} mẫu hoa khỏi kho lưu trữ. Toàn bộ dữ liệu này sẽ không thể khôi phục lại. Bạn có chắc chắn muốn tiếp tục không?`}
        confirmText={`Xóa Hẳn ${selectedArchiveIds.length} Mẫu Hoa`}
        type="danger"
      />
    </div>
  );
};
