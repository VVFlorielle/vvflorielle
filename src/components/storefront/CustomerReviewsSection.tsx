import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerReview } from '../../types';
import { useBodyScrollLock } from '../../utils/scrollLock';
import {
  Star,
  CheckCircle2,
  Sparkles,
  Camera,
  Pin,
  MessageCircle,
  Truck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Store,
  Flower2,
  Search
} from 'lucide-react';

type FilterType = 'ALL' | '5_STAR' | '4_STAR' | '3_STAR' | '2_STAR' | '1_STAR' | 'HAS_PHOTO' | 'PINNED';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, openReviewModalForCustomer } = useStore();

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedReviewDetail, setSelectedReviewDetail] = useState<CustomerReview | null>(null);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [allReviewsFilter, setAllReviewsFilter] = useState<FilterType>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const popupBodyRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when any modal or lightbox is active
  useBodyScrollLock(Boolean(isAllReviewsModalOpen || selectedReviewDetail || lightboxImage));

  // Horizontal scroll carousel controls
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Filter pills horizontal scroll controls & cues
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [canFilterScrollLeft, setCanFilterScrollLeft] = useState(false);
  const [canFilterScrollRight, setCanFilterScrollRight] = useState(false);

  const checkFilterScroll = useCallback(() => {
    if (!filterScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = filterScrollRef.current;
    setCanFilterScrollLeft(scrollLeft > 6);
    setCanFilterScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  // 1. Tất cả đánh giá ĐÃ DUYỆT VÀ CÓ PHẢN HỒI (dùng làm nguồn dữ liệu chuẩn cho toàn bộ hệ thống)
  const allApprovedReviews = useMemo(() => {
    return reviews.filter(
      (r) => r.status === 'APPROVED' && Boolean(r.adminReply && r.adminReply.trim())
    );
  }, [reviews]);

  // 2. Thống kê toàn bộ cửa hàng (Dùng hiển thị số lượng ở cả hàng nút lọc bên ngoài trang chủ VÀ trong Popup)
  // USER REQUIREMENT (Ảnh 1): Thông số trên hàng nút lọc bên ngoài là thông số của TỔNG toàn bộ đánh giá, không phải của riêng 4 cái ghim!
  const stats = useMemo(() => {
    const total = allApprovedReviews.length;
    if (total === 0) return { avg: 5.0, count: 0, fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0, hasPhoto: 0, pinned: 0 };

    const sum = allApprovedReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = Math.round((sum / total) * 10) / 10;
    const fiveStar = allApprovedReviews.filter((r) => r.rating === 5).length;
    const fourStar = allApprovedReviews.filter((r) => r.rating === 4).length;
    const threeStar = allApprovedReviews.filter((r) => r.rating === 3).length;
    const twoStar = allApprovedReviews.filter((r) => r.rating === 2).length;
    const oneStar = allApprovedReviews.filter((r) => r.rating === 1).length;
    const hasPhoto = allApprovedReviews.filter((r) => r.images && r.images.length > 0).length;
    const pinned = allApprovedReviews.filter((r) => r.isPinned).length;

    return { avg, count: total, fiveStar, fourStar, threeStar, twoStar, oneStar, hasPhoto, pinned };
  }, [allApprovedReviews]);

  // 3. Bộ lọc cho Carousel Trang Chủ:
  // Lọc từ allApprovedReviews theo filter được chọn (ALL, 5_STAR, 4_STAR, HAS_PHOTO, PINNED...)
  // Luôn sắp xếp ưu tiên: Ghim (nổi bật) lên đầu -> Có ảnh -> Điểm sao cao nhất
  const displayReviews = useMemo(() => {
    let list = [...allApprovedReviews];

    if (activeFilter === '5_STAR') {
      list = list.filter((r) => r.rating === 5);
    } else if (activeFilter === '4_STAR') {
      list = list.filter((r) => r.rating === 4);
    } else if (activeFilter === '3_STAR') {
      list = list.filter((r) => r.rating === 3);
    } else if (activeFilter === '2_STAR') {
      list = list.filter((r) => r.rating === 2);
    } else if (activeFilter === '1_STAR') {
      list = list.filter((r) => r.rating === 1);
    } else if (activeFilter === 'HAS_PHOTO') {
      list = list.filter((r) => r.images && r.images.length > 0);
    } else if (activeFilter === 'PINNED') {
      list = list.filter((r) => r.isPinned);
    }

    return list.sort((a, b) => {
      // Ghim trước
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Có ảnh thực tế trước
      const aHasPhoto = a.images && a.images.length > 0 ? 1 : 0;
      const bHasPhoto = b.images && b.images.length > 0 ? 1 : 0;
      if (aHasPhoto !== bHasPhoto) return bHasPhoto - aHasPhoto;
      // Điểm sao cao nhất
      return (b.rating || 5) - (a.rating || 5);
    });
  }, [allApprovedReviews, activeFilter]);

  // Tối đa 9 đánh giá hiển thị ở thanh cuộn trang chủ
  const limitedReviews = useMemo(() => {
    return displayReviews.slice(0, 9);
  }, [displayReviews]);

  // Bộ lọc & phân trang cho Popup Tất Cả Đánh Giá (2-3 cột x tối đa 3 hàng = 6 đánh giá/trang)
  const pageSize = 6;
  const popupFilteredReviews = useMemo(() => {
    let list = [...allApprovedReviews];

    if (allReviewsFilter === '5_STAR') {
      list = list.filter((r) => r.rating === 5);
    } else if (allReviewsFilter === '4_STAR') {
      list = list.filter((r) => r.rating === 4);
    } else if (allReviewsFilter === '3_STAR') {
      list = list.filter((r) => r.rating === 3);
    } else if (allReviewsFilter === 'HAS_PHOTO') {
      list = list.filter((r) => r.images && r.images.length > 0);
    } else if (allReviewsFilter === 'PINNED') {
      list = list.filter((r) => r.isPinned);
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      list = list.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          (r.productName && r.productName.toLowerCase().includes(q)) ||
          r.comment.toLowerCase().includes(q) ||
          (r.title && r.title.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [allApprovedReviews, allReviewsFilter, searchKeyword]);

  const totalPages = Math.max(1, Math.ceil(popupFilteredReviews.length / pageSize));
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return popupFilteredReviews.slice(start, start + pageSize);
  }, [popupFilteredReviews, currentPage, pageSize]);

  // Check scroll boundary to toggle arrow states
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Approximate active card index for dot indicator
    if (limitedReviews.length > 0 && clientWidth > 0) {
      const cardWidth = scrollWidth / limitedReviews.length;
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveCardIndex(Math.min(idx, limitedReviews.length - 1));
    }
  };

  useEffect(() => {
    checkScroll();
  }, [limitedReviews]);

  useEffect(() => {
    checkFilterScroll();
    const handleResize = () => checkFilterScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkFilterScroll, stats]);

  const scrollPrev = () => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    scrollContainerRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    scrollContainerRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2');
  };

  return (
    <section id="customer-reviews-section" className="relative pt-8 sm:pt-14 pb-4 sm:pb-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Unified White Glass Card Container for Reviews (Gộp phần tiêu đề và bảng scorecard vào chung khung trắng nổi bật) */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-emerald-100/90 shadow-xl shadow-emerald-900/5 p-6 sm:p-10 mb-8 sm:mb-10 transition-all">
        {/* 1. Header & Title */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 space-y-2">
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

        {/* 2. Rating & Trust Scorecard Banner (3 commitments in 1 row of 3 columns on Mobile & Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
          {/* Left: Overall Rating */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-3.5 sm:p-6 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-teal-50/40 border border-emerald-100">
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-4xl sm:text-6xl font-black text-emerald-700 tracking-tight">
                {stats.avg.toFixed(1)}
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 my-1.5 sm:my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400 drop-shadow-2xs" />
              ))}
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-700">Độ Hài Lòng Tuyệt Đối (99.8%)</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
              Dựa trên {stats.count} lượt đánh giá thực tế đã xác thực
            </p>
          </div>

          {/* Middle: 3 Core Commitments - Exactly 1 Row of 3 Columns on Mobile & Desktop */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-1.5 sm:gap-3">
            <div className="p-2 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="font-bold text-slate-800 text-[10px] sm:text-xs leading-tight">100% Hoa Tươi</div>
              <div className="text-[8px] sm:text-[10.5px] text-slate-500 mt-0.5 leading-tight">Loại 1 tuyển chọn</div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-1.5 shadow-2xs">
                <Camera className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="font-bold text-slate-800 text-[10px] sm:text-xs leading-tight">Chụp Ảnh Mẫu</div>
              <div className="text-[8px] sm:text-[10.5px] text-slate-500 mt-0.5 leading-tight">Duyệt trước khi ship</div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5 shadow-2xs">
                <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="font-bold text-slate-800 text-[10px] sm:text-xs leading-tight">Giao Siêu Tốc</div>
              <div className="text-[8px] sm:text-[10.5px] text-slate-500 mt-0.5 leading-tight">15-60p Hà Nội</div>
            </div>
          </div>

          {/* Right: CTA Submit Review Button */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center text-center lg:text-right">
            <button
              type="button"
              onClick={() => openReviewModalForCustomer()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
              <span>Gửi Đánh Giá Của Bạn</span>
            </button>
            <p className="text-[10.5px] text-slate-500 mt-1.5 text-center lg:text-right">
              🌸 Dành riêng cho quý khách đã từng đặt hoa tại tiệm
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filter Pills Frame with Horizontal Scroll & Visual Cue */}
      <div className="relative max-w-4xl mx-auto mb-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-1 sm:p-1.5 border border-emerald-100/90 shadow-2xs">
          <div
            ref={filterScrollRef}
            onScroll={checkFilterScroll}
            className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 py-0.5 px-0.5"
          >
            {/* Tất cả */}
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeFilter === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tất cả ({stats.count})
            </button>

            {/* 5 Sao */}
            <button
              type="button"
              onClick={() => setActiveFilter('5_STAR')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5 ${
                activeFilter === '5_STAR'
                  ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>5 Sao ({stats.fiveStar})</span>
            </button>

            {/* 4 Sao (khi có đánh giá 4 sao) */}
            {stats.fourStar > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('4_STAR')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5 ${
                  activeFilter === '4_STAR'
                    ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4 Sao ({stats.fourStar})</span>
              </button>
            )}

            {/* 3 Sao (khi có đánh giá 3 sao) */}
            {stats.threeStar > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('3_STAR')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5 ${
                  activeFilter === '3_STAR'
                    ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>3 Sao ({stats.threeStar})</span>
              </button>
            )}

            {/* 2 Sao (khi có đánh giá 2 sao) */}
            {stats.twoStar > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('2_STAR')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5 ${
                  activeFilter === '2_STAR'
                    ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>2 Sao ({stats.twoStar})</span>
              </button>
            )}

            {/* 1 Sao (khi có đánh giá 1 sao) */}
            {stats.oneStar > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('1_STAR')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5 ${
                  activeFilter === '1_STAR'
                    ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>1 Sao ({stats.oneStar})</span>
              </button>
            )}

            {/* Có ảnh (Rút ngắn để 4 nút không bị tràn màn hình điện thoại) */}
            <button
              type="button"
              onClick={() => setActiveFilter('HAS_PHOTO')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5 ${
                activeFilter === 'HAS_PHOTO'
                  ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-emerald-500" />
              <span>Có ảnh ({stats.hasPhoto})</span>
            </button>

            {/* Nổi bật */}
            {stats.pinned > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('PINNED')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5 ${
                  activeFilter === 'PINNED'
                    ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <span>Nổi bật ({stats.pinned})</span>
              </button>
            )}
          </div>
        </div>

        {/* Khung thể hiện cuộn ngang: Chỉ báo mờ dần + mũi tên trượt sang phải khi có nút bị khuất */}
        {canFilterScrollRight && (
          <div
            onClick={() => filterScrollRef.current?.scrollBy({ left: 100, behavior: 'smooth' })}
            className="absolute right-0 top-0 bottom-0 w-8 rounded-r-2xl bg-gradient-to-l from-white via-white/80 to-transparent flex items-center justify-end pr-1 text-emerald-700 sm:hidden cursor-pointer"
            title="Cuộn ngang xem thêm bộ lọc"
          >
            <ChevronRight className="w-4 h-4 animate-pulse stroke-[2.5]" />
          </div>
        )}

        {/* Chỉ báo cuộn sang trái khi đã cuộn */}
        {canFilterScrollLeft && (
          <div
            onClick={() => filterScrollRef.current?.scrollBy({ left: -100, behavior: 'smooth' })}
            className="absolute left-0 top-0 bottom-0 w-8 rounded-l-2xl bg-gradient-to-r from-white via-white/80 to-transparent flex items-center justify-start pl-1 text-emerald-700 sm:hidden cursor-pointer"
            title="Cuộn ngang về trước"
          >
            <ChevronLeft className="w-4 h-4 animate-pulse stroke-[2.5]" />
          </div>
        )}
      </div>

      {/* 4. Framed Reviews Carousel: Exactly 3 Columns in 1 Row on Desktop, Horizontal Scroll (Max 9 Reviews) */}
      <div className="relative bg-gradient-to-b from-white/95 to-emerald-50/25 backdrop-blur-md rounded-3xl p-3.5 sm:p-6 lg:p-7 border border-emerald-100/90 shadow-md shadow-emerald-900/5">
        {/* Frame Top Header: Title & Navigation Controls */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">
              Đánh Giá Thực Tế Từ Khách Hàng
            </h3>
          </div>

          {/* Prev / Next & Xem tất cả Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAllReviewsModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-bold hover:bg-emerald-50 hover:border-emerald-300 shadow-2xs transition-all cursor-pointer mr-0.5"
              title="Mở trang xem toàn bộ đánh giá"
            >
              <span>Xem tất cả ({allApprovedReviews.length})</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollLeft}
              aria-label="Xem đánh giá trước"
              className="p-1.5 sm:p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              title="Xem đánh giá trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollRight}
              aria-label="Xem đánh giá tiếp theo"
              className="p-1.5 sm:p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              title="Xem đánh giá tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {limitedReviews.length === 0 ? (
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
          <>
            {/* Horizontal Scrolling Track: 3 Columns Visible per View on Desktop */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex gap-3.5 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-2 px-0.5"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {limitedReviews.map((review) => {
                const initial = review.customerName ? review.customerName.charAt(0).toUpperCase() : 'K';

                return (
                  <div
                    key={review.id}
                    onClick={() => setSelectedReviewDetail(review)}
                    className={`w-[85vw] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] shrink-0 snap-start flex flex-col justify-between bg-white rounded-3xl p-3.5 sm:p-5 border transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-0.5 cursor-pointer ${
                      review.isPinned
                        ? 'border-emerald-300 ring-2 ring-emerald-500/10 shadow-sm'
                        : 'border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Top Row: Customer Info, Star Rating & Verified Purchase */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 text-xs sm:text-[13px] leading-tight flex items-center gap-1 truncate">
                              <span className="truncate">{review.customerName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              {review.customerPhone && (
                                <span>{maskPhone(review.customerPhone)}</span>
                              )}
                              <span>•</span>
                              <span>{review.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stars Rating & Pinned Badge */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= review.rating
                                    ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          {review.isPinned && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold">
                              <Pin className="w-2 h-2 fill-amber-500 text-amber-500" />
                              <span>Nổi bật</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Compact Product Tag & Verified Badge (Không chiếm nguyên khoảng trống rộng) */}
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {review.productName && (
                          <span className="text-[9.5px] sm:text-[10px] font-semibold text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                            <Flower2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[210px]">{review.productName}</span>
                          </span>
                        )}
                        <span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-50/60 px-1.5 py-0.5 rounded-md border border-emerald-100/60">
                          ✓ Đã mua hoa
                        </span>
                      </div>

                      {/* Review Comment: Cắt gọn 2 dòng với dấu ba chấm, bấm vào để xem đầy đủ */}
                      <p className="text-slate-600 text-xs sm:text-[12.5px] leading-relaxed line-clamp-2">
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Bottom Row: 1 Ảnh to (bên trái) + Phản hồi của shop (vị trí 2 ảnh nhỏ bên phải) */}
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100/90 flex items-stretch gap-2.5">
                      {/* 1 Ảnh thực tế to bên trái (nếu có ảnh) */}
                      {review.images && review.images.length > 0 ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReviewDetail(review);
                          }}
                          className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 cursor-pointer group shadow-2xs"
                          title="Bấm để xem ảnh phóng to & chi tiết"
                        >
                          <img
                            src={review.images[0]}
                            alt="Ảnh hoa thực tế"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {review.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold">
                              +{review.images.length - 1}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            🔍
                          </div>
                        </div>
                      ) : null}

                      {/* Vị trí hai ảnh nhỏ kia bố trí phản hồi của shop! */}
                      <div className="flex-1 min-w-0 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-center text-xs">
                        <div className="flex items-center gap-1 font-bold text-emerald-900 text-[10px] sm:text-[11px]">
                          <Store className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Shop phản hồi:</span>
                        </div>
                        <p className="text-slate-600 text-[10.5px] sm:text-[11px] leading-relaxed italic line-clamp-2 mt-0.5">
                          "{review.adminReply}"
                        </p>
                        <div className="text-right mt-1">
                          <span className="text-[9.5px] font-bold text-emerald-700 hover:underline">
                            Chi tiết →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centered Indicator Dots */}
            <div className="mt-3 pt-2 border-t border-emerald-100/60 flex items-center justify-center">
              <div className="flex items-center gap-1.5">
                {limitedReviews.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeCardIndex
                        ? 'w-5 bg-emerald-600'
                        : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Button Xem Tất Cả Đánh Giá ở chân section */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsAllReviewsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-50 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Xem tất cả {allApprovedReviews.length} đánh giá có phản hồi từ shop</span>
          <ChevronRight className="w-4 h-4 text-emerald-600" />
        </button>
      </div>

      {/* 5. Modal Chi Tiết Đánh Giá (Mở khi bấm vào thẻ đánh giá) */}
      {selectedReviewDetail && (
        <div
          className="glass-overlay z-[100000] flex items-center justify-center p-3 sm:p-5 md:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedReviewDetail(null)}
        >
          <div
            className="glass-modal-content w-full max-w-xl my-auto max-h-[92dvh] sm:max-h-[88vh] flex flex-col relative overflow-hidden border border-emerald-100/90 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="glass-modal-header shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/90">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-sm text-slate-800">Chi Tiết Đánh Giá Thực Tế</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng cửa sổ"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="glass-modal-body flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
              {/* Customer Info & Stars */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {selectedReviewDetail.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{selectedReviewDetail.customerName}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      {selectedReviewDetail.customerPhone && (
                        <span>{maskPhone(selectedReviewDetail.customerPhone)}</span>
                      )}
                      <span>•</span>
                      <span>{selectedReviewDetail.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= selectedReviewDetail.rating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    ✓ Đã mua hoa tại tiệm
                  </span>
                </div>
              </div>

              {/* Product tag */}
              {selectedReviewDetail.productName && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-700">
                  <Flower2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">Mẫu hoa đã đặt:</span>
                  <span className="text-slate-600 font-medium">{selectedReviewDetail.productName}</span>
                </div>
              )}

              {/* Full Title & Comment */}
              <div>
                {selectedReviewDetail.title && (
                  <h5 className="font-extrabold text-slate-900 text-sm mb-1.5">
                    "{selectedReviewDetail.title}"
                  </h5>
                )}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                  {selectedReviewDetail.comment}
                </p>
              </div>

              {/* Bố trí chuẩn: 1 ảnh to + 2 ảnh nhỏ xếp dọc bên cạnh cao bằng ảnh to */}
              {selectedReviewDetail.images && selectedReviewDetail.images.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Ảnh hoa thực tế khách gửi ({selectedReviewDetail.images.length} ảnh):</span>
                  </div>

                  {selectedReviewDetail.images.length >= 3 ? (
                    <div className="flex gap-2 h-56 sm:h-64 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
                      {/* 1 ảnh to bên trái */}
                      <div
                        onClick={() => setLightboxImage(selectedReviewDetail.images![0])}
                        className="relative w-[65%] h-full rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                      >
                        <img
                          src={selectedReviewDetail.images[0]}
                          alt="Ảnh hoa to 1"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          🔍 Phóng to
                        </div>
                      </div>

                      {/* 2 ảnh nhỏ bố trí dọc bên cạnh cao bằng ảnh to */}
                      <div className="flex flex-col gap-2 w-[35%] h-full">
                        <div
                          onClick={() => setLightboxImage(selectedReviewDetail.images![1])}
                          className="relative flex-1 rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                        >
                          <img
                            src={selectedReviewDetail.images[1]}
                            alt="Ảnh hoa nhỏ 2"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            🔍
                          </div>
                        </div>
                        <div
                          onClick={() => setLightboxImage(selectedReviewDetail.images![2])}
                          className="relative flex-1 rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                        >
                          <img
                            src={selectedReviewDetail.images[2]}
                            alt="Ảnh hoa nhỏ 3"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            🔍
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedReviewDetail.images.length === 2 ? (
                    <div className="grid grid-cols-2 gap-2 h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
                      {selectedReviewDetail.images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setLightboxImage(img)}
                          className="relative h-full rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                        >
                          <img
                            src={img}
                            alt={`Ảnh hoa ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => setLightboxImage(selectedReviewDetail.images![0])}
                      className="relative h-52 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group"
                    >
                      <img
                        src={selectedReviewDetail.images[0]}
                        alt="Ảnh hoa thực tế"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Phản hồi chính thức từ chủ tiệm */}
              {selectedReviewDetail.adminReply && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200 text-xs text-slate-700 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs sm:text-sm">
                    <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Phản hồi từ chủ tiệm V&V Florielle:</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed italic pl-6">
                    "{selectedReviewDetail.adminReply}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal Xem Tất Cả Đánh Giá (Popup nổi chuẩn glass-overlay & glass-modal-content, tự co giãn dọc vừa vặn không tràn khung) */}
      {isAllReviewsModalOpen && (
        <div
          className="glass-overlay z-[100000] flex items-center justify-center p-3 sm:p-5 md:p-6 animate-in fade-in duration-200"
          onClick={() => setIsAllReviewsModalOpen(false)}
        >
          <div
            className="glass-modal-content w-full max-w-5xl my-auto max-h-[92dvh] sm:max-h-[88vh] flex flex-col relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header cố định ở đầu Popup */}
            <div className="glass-modal-header shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-emerald-100/80 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-base text-slate-800 tracking-tight truncate flex items-center gap-1.5">
                    <span>Tất Cả Đánh Giá Thực Tế</span>
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                      {allApprovedReviews.length}
                    </span>
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden sm:block">
                    🌸 Đánh giá có tâm từ khách hàng đã đặt hoa và có phản hồi chính thức từ V&V Florielle
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAllReviewsModalOpen(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                title="Đóng cửa sổ"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>

            {/* Thanh Phân Loại, Bộ Lọc & Tìm Kiếm */}
            <div className="shrink-0 px-3 sm:px-6 py-2.5 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              {/* Nút lọc sao & ảnh */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => { setAllReviewsFilter('ALL'); setCurrentPage(1); }}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    allReviewsFilter === 'ALL'
                      ? 'bg-emerald-600 text-white shadow-2xs scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tất cả ({allApprovedReviews.length})
                </button>

                <button
                  type="button"
                  onClick={() => { setAllReviewsFilter('5_STAR'); setCurrentPage(1); }}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    allReviewsFilter === '5_STAR'
                      ? 'bg-emerald-600 text-white shadow-2xs scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>5 Sao ({stats.fiveStar})</span>
                </button>

                {stats.fourStar > 0 && (
                  <button
                    type="button"
                    onClick={() => { setAllReviewsFilter('4_STAR'); setCurrentPage(1); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                      allReviewsFilter === '4_STAR'
                        ? 'bg-emerald-600 text-white shadow-2xs scale-[1.02]'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>4 Sao ({stats.fourStar})</span>
                  </button>
                )}

                {stats.threeStar > 0 && (
                  <button
                    type="button"
                    onClick={() => { setAllReviewsFilter('3_STAR'); setCurrentPage(1); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                      allReviewsFilter === '3_STAR'
                        ? 'bg-emerald-600 text-white shadow-2xs scale-[1.02]'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>3 Sao ({stats.threeStar})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { setAllReviewsFilter('HAS_PHOTO'); setCurrentPage(1); }}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    allReviewsFilter === 'HAS_PHOTO'
                      ? 'bg-emerald-600 text-white shadow-2xs scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Camera className="w-3 h-3 text-emerald-600" />
                  <span>Có ảnh ({stats.hasPhoto})</span>
                </button>

                {stats.pinned > 0 && (
                  <button
                    type="button"
                    onClick={() => { setAllReviewsFilter('PINNED'); setCurrentPage(1); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                      allReviewsFilter === 'PINNED'
                        ? 'bg-emerald-600 text-white shadow-2xs scale-[1.02]'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Pin className="w-3 h-3 text-amber-500" />
                    <span>Nổi bật ({stats.pinned})</span>
                  </button>
                )}
              </div>

              {/* Ô tìm kiếm nhanh */}
              <div className="relative shrink-0 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
                  placeholder="Tìm theo tên, loại hoa..."
                  className="w-full pl-8 pr-7 py-1 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => { setSearchKeyword(''); setCurrentPage(1); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Nội dung danh sách đánh giá: Lưới 2-3 cột trên Desktop, cuộn mượt */}
            <div
              ref={popupBodyRef}
              className="glass-modal-body flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 no-scrollbar"
            >
              {paginatedReviews.length === 0 ? (
                <div className="text-center py-16 bg-white/70 rounded-3xl border border-dashed border-slate-200">
                  <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-600">Không tìm thấy đánh giá nào phù hợp.</p>
                  <button
                    type="button"
                    onClick={() => { setAllReviewsFilter('ALL'); setSearchKeyword(''); setCurrentPage(1); }}
                    className="mt-2 text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
                  {paginatedReviews.map((rev) => {
                    const revInitial = rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'K';

                    return (
                      <div
                        key={rev.id}
                        className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          {/* Khách hàng & Sao */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                                {revInitial}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 text-xs sm:text-[13px] leading-tight flex items-center gap-1 truncate">
                                  <span className="truncate">{rev.customerName}</span>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                  {rev.customerPhone && <span>{maskPhone(rev.customerPhone)}</span>}
                                  <span>•</span>
                                  <span>{rev.createdAt}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-0.5 shrink-0">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rev.rating
                                        ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                                        : 'text-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              {rev.isPinned && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[8.5px] font-bold">
                                  <Pin className="w-2 h-2 fill-amber-500 text-amber-500" />
                                  <span>Nổi bật</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Thẻ mẫu hoa đã mua */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {rev.productName && (
                              <span className="text-[9.5px] font-semibold text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                                <Flower2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate max-w-[190px]">{rev.productName}</span>
                              </span>
                            )}
                            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50/60 px-1.5 py-0.5 rounded-md border border-emerald-100/60">
                              ✓ Đã mua
                            </span>
                          </div>

                          {/* Tiêu đề & Nội dung đánh giá */}
                          <div>
                            {rev.title && (
                              <h5 className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">
                                "{rev.title}"
                              </h5>
                            )}
                            <p className="text-slate-600 text-xs sm:text-[12.5px] leading-relaxed line-clamp-3">
                              "{rev.comment}"
                            </p>
                          </div>

                          {/* Bố cục 3 ảnh thực tế chuẩn: 1 ảnh to bên trái + 2 ảnh nhỏ xếp dọc bên cạnh cao bằng ảnh to */}
                          {rev.images && rev.images.length >= 3 ? (
                            <div className="flex gap-1.5 h-36 sm:h-40 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
                              <div
                                onClick={() => setLightboxImage(rev.images![0])}
                                className="relative w-[65%] h-full rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                              >
                                <img
                                  src={rev.images[0]}
                                  alt="Ảnh hoa 1"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                  🔍 Phóng to
                                </div>
                              </div>
                              <div className="flex flex-col gap-1.5 w-[35%] h-full">
                                <div
                                  onClick={() => setLightboxImage(rev.images![1])}
                                  className="relative flex-1 rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                                >
                                  <img
                                    src={rev.images[1]}
                                    alt="Ảnh hoa 2"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div
                                  onClick={() => setLightboxImage(rev.images![2])}
                                  className="relative flex-1 rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                                >
                                  <img
                                    src={rev.images[2]}
                                    alt="Ảnh hoa 3"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : rev.images && rev.images.length === 2 ? (
                            <div className="grid grid-cols-2 gap-1.5 h-32 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
                              {rev.images.map((img, i) => (
                                <div
                                  key={i}
                                  onClick={() => setLightboxImage(img)}
                                  className="relative h-full rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                                >
                                  <img
                                    src={img}
                                    alt={`Ảnh hoa ${i + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : rev.images && rev.images.length === 1 ? (
                            <div
                              onClick={() => setLightboxImage(rev.images![0])}
                              className="relative h-32 sm:h-36 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group"
                            >
                              <img
                                src={rev.images[0]}
                                alt="Ảnh hoa thực tế"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : null}
                        </div>

                        {/* Phản hồi từ shop */}
                        {rev.adminReply && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100/90">
                            <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-xs">
                              <div className="flex items-center gap-1 font-bold text-emerald-900 text-[10px] sm:text-[10.5px]">
                                <Store className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>Phản hồi từ shop:</span>
                              </div>
                              <p className="text-slate-600 text-[10.5px] leading-relaxed italic line-clamp-2 mt-0.5">
                                "{rev.adminReply}"
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Thanh phân trang cố định ở đáy Popup (Chọn trang 1 2 3...) */}
            {totalPages > 1 && (
              <div className="glass-modal-footer shrink-0 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-between gap-2">
                <div className="text-[10.5px] sm:text-xs text-slate-500 font-medium">
                  Trang <span className="font-bold text-emerald-700">{currentPage}</span> / {totalPages} ({popupFilteredReviews.length} đánh giá)
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  {/* Nút Trước */}
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage((p) => p - 1);
                        popupBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Trước</span>
                  </button>

                  {/* Nút số trang 1 2 3 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => {
                        setCurrentPage(page);
                        popupBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        page === currentPage
                          ? 'bg-emerald-600 text-white shadow-2xs scale-105'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Nút Sau */}
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((p) => p + 1);
                        popupBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5"
                  >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100050] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
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
    </section>
  );
};
