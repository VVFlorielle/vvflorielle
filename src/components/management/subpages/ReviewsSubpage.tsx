import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import { CustomerReview, ReviewStatus } from '../../../types';
import { compressImage } from '../../../utils/imageCompressor';
import {
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Pin,
  Trash2,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Camera,
  Sparkles,
  ShieldAlert,
  ArrowUpDown,
  Upload,
  Clock,
  Phone,
  ShoppingBag,
  ExternalLink,
  Store
} from 'lucide-react';

export const ReviewsSubpage: React.FC = () => {
  const {
    reviews,
    approveReview,
    hideReview,
    togglePinReview,
    deleteReview,
    replyReview,
    addManualReview
  } = useStore();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'HIDDEN'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [starFilter, setStarFilter] = useState<string>('ALL');
  const [reviewPage, setReviewPage] = useState<number>(1);
  const [reviewPageSize, setReviewPageSize] = useState<number | 'ALL'>(10);

  useEffect(() => {
    setReviewPage(1);
  }, [activeTab, starFilter, searchQuery]);

  // Modals & Inline Editors
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Manual Review Form State
  const [manualName, setManualName] = useState<string>('');
  const [manualPhone, setManualPhone] = useState<string>('');
  const [manualRating, setManualRating] = useState<number>(5);
  const [manualProduct, setManualProduct] = useState<string>('');
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualComment, setManualComment] = useState<string>('');
  const [manualImages, setManualImages] = useState<string[]>([]);
  const [manualSource, setManualSource] = useState<'CUSTOMER_WEB' | 'ZALO_FEEDBACK' | 'HOTLINE'>('ZALO_FEEDBACK');
  const [manualStatus, setManualStatus] = useState<ReviewStatus>('APPROVED');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  // Metrics
  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === 'PENDING').length;
    const approved = reviews.filter((r) => r.status === 'APPROVED').length;
    const hidden = reviews.filter((r) => r.status === 'HIDDEN').length;
    const pinned = reviews.filter((r) => r.isPinned).length;

    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = total > 0 ? Math.round((sum / total) * 10) / 10 : 5.0;

    return { total, pending, approved, hidden, pinned, avg };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Tab filter
      if (activeTab === 'PENDING' && r.status !== 'PENDING') return false;
      if (activeTab === 'APPROVED' && r.status !== 'APPROVED') return false;
      if (activeTab === 'HIDDEN' && r.status !== 'HIDDEN') return false;

      // Star filter
      if (starFilter !== 'ALL' && r.rating !== parseInt(starFilter, 10)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.customerName?.toLowerCase().includes(q);
        const matchPhone = r.customerPhone?.toLowerCase().includes(q);
        const matchProd = r.productName?.toLowerCase().includes(q);
        const matchComment = r.comment?.toLowerCase().includes(q);
        const matchTitle = r.title?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchProd && !matchComment && !matchTitle) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, activeTab, starFilter, searchQuery]);

  // Phân trang đánh giá
  const totalReviewPages =
    reviewPageSize === 'ALL'
      ? 1
      : Math.max(1, Math.ceil(filteredReviews.length / Number(reviewPageSize)));

  const displayedReviews =
    reviewPageSize === 'ALL'
      ? filteredReviews
      : filteredReviews.slice(
          (reviewPage - 1) * Number(reviewPageSize),
          reviewPage * Number(reviewPageSize)
        );

  const handleOpenReply = (review: CustomerReview) => {
    setReplyingReviewId(review.id);
    setReplyText(review.adminReply || '');
  };

  const handleSaveReply = (id: string) => {
    if (!replyText.trim()) return;
    replyReview(id, replyText.trim());
    setReplyingReviewId(null);
    setReplyText('');
  };

  const handleManualPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file, {
          maxWidth: 900,
          maxHeight: 900,
          quality: 0.75
        });
        newImages.push(compressed);
      }
      setManualImages((prev) => [...prev, ...newImages].slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveManualReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualComment.trim()) return;

    addManualReview({
      customerName: manualName.trim(),
      customerPhone: manualPhone.trim() || undefined,
      rating: manualRating,
      title: manualTitle.trim() || undefined,
      comment: manualComment.trim(),
      productName: manualProduct.trim() || undefined,
      images: manualImages.length > 0 ? manualImages : undefined,
      status: manualStatus,
      isPinned: false,
      source: manualSource
    });

    // Reset form
    setManualName('');
    setManualPhone('');
    setManualRating(5);
    setManualProduct('');
    setManualTitle('');
    setManualComment('');
    setManualImages([]);
    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Stats Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Hệ Thống Đánh Giá & Vote Sao Chuẩn Phototiinlove</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Quản Lý Đánh Giá Khách Hàng
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Kiểm duyệt đánh giá của khách mua hoa, duyệt hiển thị lên trang chủ, ghim nổi bật và trả lời cảm ơn.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Đánh Giá Thủ Công</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng Đánh Giá</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{stats.total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Điểm TB: {stats.avg} ⭐</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <span>Chờ Duyệt</span>
              {stats.pending > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
            </div>
            <div className="text-2xl font-black text-amber-700 mt-1">{stats.pending}</div>
            <div className="text-[10px] text-amber-600 mt-0.5">Cần duyệt lên web</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Đang Hiển Thị</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{stats.approved}</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Đã xuất hiện trang chủ</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Đã Ghim Nổi Bật</div>
            <div className="text-2xl font-black text-purple-700 mt-1">{stats.pinned}</div>
            <div className="text-[10px] text-purple-600 mt-0.5">Xếp đầu trang chủ</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200">
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Đã Ẩn</div>
            <div className="text-2xl font-black text-rose-700 mt-1">{stats.hidden}</div>
            <div className="text-[10px] text-rose-600 mt-0.5">Tạm ẩn khỏi web</div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        {/* Top bar: Tabs (2x2 grid trên mobile, flex trên desktop, 0 scroll ngang) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer justify-center flex items-center ${
              activeTab === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            Tất cả ({stats.total})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer justify-center flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Chờ duyệt ({stats.pending})</span>
            {stats.pending > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer justify-center flex items-center gap-1.5 ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Đang hiển thị ({stats.approved})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HIDDEN')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer justify-center flex items-center gap-1.5 ${
              activeTab === 'HIDDEN'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Đã ẩn ({stats.hidden})</span>
          </button>
        </div>

        {/* Search & Star dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên khách, số điện thoại, sản phẩm hoặc nội dung đánh giá..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="ALL">⭐ Tất cả số sao</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 Sao</option>
              <option value="4">⭐⭐⭐⭐ 4 Sao</option>
              <option value="3">⭐⭐⭐ 3 Sao</option>
              <option value="2">⭐⭐ 2 Sao</option>
              <option value="1">⭐ 1 Sao</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Review Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Không tìm thấy đánh giá nào</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery || starFilter !== 'ALL'
              ? 'Thử thay đổi từ khóa hoặc bộ lọc để xem các đánh giá khác.'
              : 'Chưa có đánh giá nào trong danh mục này.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((review) => {
            const isReplying = replyingReviewId === review.id;

            return (
              <div
                key={review.id}
                className={`bg-white rounded-3xl p-4 sm:p-6 border transition-all ${
                  review.status === 'PENDING'
                    ? 'border-amber-300 ring-2 ring-amber-500/15 shadow-md shadow-amber-900/5'
                    : review.status === 'APPROVED'
                    ? 'border-slate-200/90 shadow-2xs hover:border-emerald-200'
                    : 'border-slate-200 opacity-75 bg-slate-50/50'
                }`}
              >
                {/* Header row: Status badges & Customer info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'K'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">{review.customerName}</span>
                        {review.customerPhone && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{review.customerPhone}</span>
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">({review.createdAt})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        {review.productName && (
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            🌸 {review.productName}
                          </span>
                        )}
                        {review.source && (
                          <span className="text-[10px] text-slate-400">
                            Nguồn: {review.source === 'CUSTOMER_WEB' ? 'Web khách' : review.source === 'ZALO_FEEDBACK' ? 'Zalo' : 'Hotline'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center gap-2 shrink-0">
                    {review.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>🟡 Chờ Duyệt</span>
                      </span>
                    )}

                    {review.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>🟢 Đang Hiển Thị</span>
                      </span>
                    )}

                    {review.status === 'HIDDEN' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>⚪ Đã Ẩn</span>
                      </span>
                    )}

                    {review.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200">
                        <Pin className="w-3 h-3 fill-purple-600 text-purple-600" />
                        <span>Ghim đầu</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating & Content */}
                <div className="py-4 space-y-2.5">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= review.rating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-600 ml-1.5">{review.rating} / 5 sao</span>
                  </div>

                  {review.title && (
                    <h4 className="font-bold text-slate-900 text-sm">"{review.title}"</h4>
                  )}

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {review.comment}
                  </p>

                  {/* Customer Photos */}
                  {review.images && review.images.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-emerald-600" />
                        <span>Ảnh hoa thực tế gửi kèm ({review.images.length} ảnh):</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {review.images.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setZoomImage(img)}
                            className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer group bg-slate-100"
                          >
                            <img src={img} alt="Ảnh hoa" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">
                              🔍
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Florist Admin Reply Section */}
                <div className="pt-3 border-t border-slate-100">
                  {review.adminReply && !isReplying ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-slate-700 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Phản hồi từ V&V Florielle:</span>
                          {review.adminRepliedAt && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({review.adminRepliedAt})
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 italic">"{review.adminReply}"</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenReply(review)}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline shrink-0 cursor-pointer"
                      >
                        Sửa phản hồi
                      </button>
                    </div>
                  ) : isReplying ? (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Viết phản hồi công khai của tiệm hoa:</span>
                      </label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Ví dụ: V&V Florielle xin cảm ơn quý khách đã tin tưởng và ủng hộ tiệm ạ! Chúc quý khách luôn vui vẻ và hạnh phúc nha! 🌸"
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingReviewId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveReply(review.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Lưu phản hồi
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Bottom Actions Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* If PENDING -> Primary action is APPROVE */}
                    {review.status === 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => approveReview(review.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✓ Duyệt Hiển Thị Lên Trang Chủ</span>
                      </button>
                    )}

                    {/* If APPROVED -> Allow Toggle Pin or Hide */}
                    {review.status === 'APPROVED' && (
                      <>
                        <button
                          type="button"
                          onClick={() => togglePinReview(review.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            review.isPinned
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                          <span>{review.isPinned ? 'Bỏ ghim' : '📌 Ghim đầu'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => hideReview(review.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                          <span>Ẩn khỏi web</span>
                        </button>
                      </>
                    )}

                    {/* If HIDDEN -> Restore */}
                    {review.status === 'HIDDEN' && (
                      <button
                        type="button"
                        onClick={() => approveReview(review.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Khôi phục hiển thị</span>
                      </button>
                    )}

                    {/* Add reply if not exists */}
                    {!review.adminReply && !isReplying && (
                      <button
                        type="button"
                        onClick={() => handleOpenReply(review)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>+ Trả lời</span>
                      </button>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa vĩnh viễn đánh giá này không?')) {
                        deleteReview(review.id);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                    title="Xóa đánh giá"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Phân trang danh sách đánh giá */}
          {filteredReviews.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200/80 text-xs font-medium text-slate-600 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              <div className="flex items-center gap-2">
                <span>Hiển thị</span>
                <select
                  value={reviewPageSize}
                  onChange={(e) => {
                    const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                    setReviewPageSize(val);
                    setReviewPage(1);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value={5}>5 đánh giá / trang</option>
                  <option value={10}>10 đánh giá / trang</option>
                  <option value={20}>20 đánh giá / trang</option>
                  <option value="ALL">Tất cả ({filteredReviews.length})</option>
                </select>
                <span>trong tổng số <strong>{filteredReviews.length}</strong> đánh giá</span>
              </div>

              {reviewPageSize !== 'ALL' && totalReviewPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={reviewPage <= 1}
                    onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Trước
                  </button>
                  <div className="px-3 py-1 font-bold text-emerald-900 bg-emerald-50 rounded-xl border border-emerald-200/60">
                    {reviewPage} / {totalReviewPages}
                  </div>
                  <button
                    type="button"
                    disabled={reviewPage >= totalReviewPages}
                    onClick={() => setReviewPage((p) => Math.min(totalReviewPages, p + 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Manual Review Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-800 text-white flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Thêm Đánh Giá Khách Hàng Thủ Công</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualReview} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tên khách hàng *</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Ví dụ: Ninh Vũ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số điện thoại</label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="0829440654"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số sao đánh giá *</label>
                  <select
                    value={manualRating}
                    onChange={(e) => setManualRating(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-amber-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Sao</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Sao</option>
                    <option value={3}>⭐⭐⭐ 3 Sao</option>
                    <option value={2}>⭐⭐ 2 Sao</option>
                    <option value={1}>⭐ 1 Sao</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nguồn thu thập</label>
                  <select
                    value={manualSource}
                    onChange={(e) => setManualSource(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                  >
                    <option value="ZALO_FEEDBACK">Tin nhắn Zalo</option>
                    <option value="CUSTOMER_WEB">Web khách gửi</option>
                    <option value="HOTLINE">Gọi Hotline / Trực tiếp</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mẫu hoa khách đã đặt</label>
                <input
                  type="text"
                  value={manualProduct}
                  onChange={(e) => setManualProduct(e.target.value)}
                  placeholder="Ví dụ: Bó Hoa Hồng Ecuador Đỏ Say Đắm"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tiêu đề đánh giá</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Ví dụ: Hoa rất tươi và giao nhanh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Chi tiết nhận xét *</label>
                <textarea
                  required
                  value={manualComment}
                  onChange={(e) => setManualComment(e.target.value)}
                  placeholder="Nội dung lời khen của khách..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ảnh hoa thực tế (tối đa 3 ảnh)</span>
                </label>
                {manualImages.length > 0 && (
                  <div className="flex gap-2">
                    {manualImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setManualImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-rose-600 text-white rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {manualImages.length < 3 && (
                  <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:bg-slate-50 cursor-pointer font-semibold text-slate-600">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isUploadingPhoto ? 'Đang nén ảnh...' : '+ Chọn ảnh tải lên'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleManualPhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Trạng thái xuất bản</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="manualStatus"
                      checked={manualStatus === 'APPROVED'}
                      onChange={() => setManualStatus('APPROVED')}
                    />
                    <span className="font-bold text-emerald-700">Duyệt hiển thị trang chủ ngay</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="manualStatus"
                      checked={manualStatus === 'PENDING'}
                      onChange={() => setManualStatus('PENDING')}
                    />
                    <span className="font-bold text-amber-700">Lưu vào hàng đợi chờ duyệt</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Lưu Đánh Giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Lightbox Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] bg-white rounded-3xl p-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80"
            >
              ✕
            </button>
            <img src={zoomImage} alt="Ảnh hoa phóng to" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};
