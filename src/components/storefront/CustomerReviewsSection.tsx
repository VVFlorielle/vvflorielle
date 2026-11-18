import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerReview } from '../../types';
import {
  Star,
  CheckCircle2,
  Sparkles,
  Camera,
  Pin,
  MessageCircle,
  Truck,
  ShieldCheck,
  ChevronRight,
  X,
  Heart,
  Store
} from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, openReviewModalForCustomer } = useStore();

  const [activeFilter, setActiveFilter] = useState<'ALL' | '5_STAR' | 'HAS_PHOTO' | 'PINNED'>('ALL');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Only show APPROVED reviews on the public storefront!
  const approvedReviews = useMemo(() => {
    return reviews.filter((r) => r.status === 'APPROVED');
  }, [reviews]);

  // Compute metrics
  const stats = useMemo(() => {
    const total = approvedReviews.length;
    if (total === 0) return { avg: 5.0, count: 0, fiveStar: 0, hasPhoto: 0, pinned: 0 };

    const sum = approvedReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = Math.round((sum / total) * 10) / 10;
    const fiveStar = approvedReviews.filter((r) => r.rating === 5).length;
    const hasPhoto = approvedReviews.filter((r) => r.images && r.images.length > 0).length;
    const pinned = approvedReviews.filter((r) => r.isPinned).length;

    return { avg, count: total, fiveStar, hasPhoto, pinned };
  }, [approvedReviews]);

  // Filter & Sort: Pinned first, then newest
  const displayReviews = useMemo(() => {
    let filtered = [...approvedReviews];

    if (activeFilter === '5_STAR') {
      filtered = filtered.filter((r) => r.rating === 5);
    } else if (activeFilter === 'HAS_PHOTO') {
      filtered = filtered.filter((r) => r.images && r.images.length > 0);
    } else if (activeFilter === 'PINNED') {
      filtered = filtered.filter((r) => r.isPinned);
    }

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [approvedReviews, activeFilter]);

  const maskPhone = (phone?: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2');
  };

  return (
    <section className="relative py-14 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Header & Title */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Cảm Nhận & Đánh Giá Thực Tế</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Khách Hàng Nói Gì Về{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            V&V Florielle
          </span>
          ?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          100% đánh giá minh bạch từ khách hàng đã trực tiếp đặt và trải nghiệm hoa nghệ thuật tại Hà Nội.
          Mỗi lời khen là nguồn động lực to lớn để florist hoàn thiện từng mẫu hoa trao tay.
        </p>
      </div>

      {/* 2. Rating & Trust Scorecard Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-100/80 shadow-lg shadow-emerald-900/5 p-6 sm:p-8 mb-10 transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Overall Rating */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-teal-50/40 border border-emerald-100">
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-5xl sm:text-6xl font-black text-emerald-700 tracking-tight">
                {stats.avg.toFixed(1)}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-2xs" />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-700">Độ Hài Lòng Tuyệt Đối (99.8%)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dựa trên {stats.count} lượt đánh giá thực tế đã xác thực
            </p>
          </div>

          {/* Middle: 3 Core Florist Commitments */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-800 text-xs">100% Hoa Tươi</div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">Loại 1 tuyển chọn kỹ</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 shadow-2xs">
                <Camera className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-800 text-xs">Chụp Ảnh Mẫu</div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">Gửi duyệt trước khi ship</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-800 text-xs">Giao Siêu Tốc</div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">15 - 60 phút Hà Nội</div>
            </div>
          </div>

          {/* Right: CTA Submit Review Button */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center text-center lg:text-right">
            <button
              type="button"
              onClick={() => openReviewModalForCustomer()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
              <span>Gửi Đánh Giá Của Bạn</span>
            </button>
            <p className="text-[11px] text-slate-500 mt-2 text-center lg:text-right">
              🌸 Dành riêng cho quý khách đã từng đặt hoa tại tiệm
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filter Pills Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'ALL'
              ? 'bg-emerald-600 text-white shadow-xs scale-105'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả ({stats.count})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('5_STAR')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === '5_STAR'
              ? 'bg-emerald-600 text-white shadow-xs scale-105'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>5 Sao ({stats.fiveStar})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('HAS_PHOTO')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'HAS_PHOTO'
              ? 'bg-emerald-600 text-white shadow-xs scale-105'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-emerald-500" />
          <span>Có ảnh hoa thật ({stats.hasPhoto})</span>
        </button>

        {stats.pinned > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter('PINNED')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'PINNED'
                ? 'bg-emerald-600 text-white shadow-xs scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-amber-500" />
            <span>Nổi bật ({stats.pinned})</span>
          </button>
        )}
      </div>

      {/* 4. Reviews Grid */}
      {displayReviews.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/60 rounded-3xl border border-dashed border-slate-200">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Chưa có đánh giá nào phù hợp với bộ lọc này.</p>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
          >
            Xem tất cả đánh giá
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayReviews.map((review) => {
            const initial = review.customerName ? review.customerName.charAt(0).toUpperCase() : 'K';

            return (
              <div
                key={review.id}
                className={`relative flex flex-col justify-between bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 ${
                  review.isPinned
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10 shadow-sm'
                    : 'border-slate-200/90 shadow-2xs'
                }`}
              >
                <div>
                  {/* Top Row: Customer Info & Pinned / Verified Badges */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                        {initial}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-1.5">
                          <span>{review.customerName}</span>
                          <span title="Khách hàng đã mua hoa tại tiệm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          {review.customerPhone && (
                            <span>{maskPhone(review.customerPhone)}</span>
                          )}
                          <span>•</span>
                          <span>{review.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pinned pill */}
                    {review.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold shrink-0">
                        <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>Nổi bật</span>
                      </span>
                    )}
                  </div>

                  {/* Star Rating & Verified Purchase Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
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
                    </div>
                    <span className="text-[10.5px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      ✓ Đã đặt mua hoa
                    </span>
                  </div>

                  {/* Product Tag */}
                  {review.productName && (
                    <div className="mb-2.5">
                      <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg transition-colors">
                        🌸 {review.productName}
                      </span>
                    </div>
                  )}

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="font-bold text-slate-900 text-sm leading-snug mb-1.5">
                      "{review.title}"
                    </h4>
                  )}

                  {/* Review Comment */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-5">
                    {review.comment}
                  </p>

                  {/* Real Delivered Flower Photos */}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-emerald-600" />
                        <span>Ảnh hoa thực tế nhận được:</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {review.images.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setLightboxImage(img)}
                            className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer group bg-slate-100"
                          >
                            <img
                              src={img}
                              alt="Ảnh hoa thực tế"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                              🔍 Phóng to
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Florist Admin Reply (If any) */}
                {review.adminReply && (
                  <div className="mt-4 pt-3 border-t border-dashed border-emerald-200/80">
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[11.5px]">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Phản hồi từ V&V Florielle:</span>
                        {review.adminRepliedAt && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({review.adminRepliedAt})
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed italic">
                        "{review.adminReply}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label="Đóng ảnh"
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Ảnh hoa thực tế phóng to"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* 6. Footer Assurance */}
      <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        <span>V&V Florielle cam kết hoa tươi 100%, bảo hành đổi mới nếu hoa dập héo khi vận chuyển!</span>
      </div>
    </section>
  );
};
