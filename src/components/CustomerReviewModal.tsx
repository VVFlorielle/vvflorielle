import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { compressImage } from '../utils/imageCompressor';
import {
  X,
  Star,
  Upload,
  Camera,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  HeartHandshake
} from 'lucide-react';

const STAR_LABELS: Record<number, string> = {
  1: 'Chưa hài lòng 😞',
  2: 'Tạm được 😐',
  3: 'Bình thường 🙂',
  4: 'Hài lòng & Hoa đẹp 😊',
  5: 'Rất hài lòng & Tuyệt vời! ⭐🌸'
};

export const CustomerReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    reviewTargetProduct,
    setReviewTargetProduct,
    customer,
    orders,
    submitCustomerReview
  } = useStore();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract products ordered by this customer
  const customerOrders = customer
    ? orders.filter((o) => o.senderPhone === customer.phone)
    : [];

  // Collect distinct product names from their past orders
  const pastOrderedProducts: string[] = [];
  customerOrders.forEach((o) => {
    o.items?.forEach((it) => {
      if (it.productName && !pastOrderedProducts.includes(it.productName)) {
        pastOrderedProducts.push(it.productName);
      }
    });
  });

  // Initialize selected product when modal opens
  useEffect(() => {
    if (isReviewModalOpen) {
      setErrorMsg('');
      setRating(5);
      setHoverRating(0);
      setTitle('');
      setComment('');
      setImages([]);

      if (reviewTargetProduct) {
        setSelectedProduct(reviewTargetProduct);
      } else if (pastOrderedProducts.length > 0) {
        setSelectedProduct(pastOrderedProducts[0]);
      } else {
        setSelectedProduct('Bó hoa / Giỏ hoa tươi');
      }

      if (customerOrders.length > 0) {
        setSelectedOrderId(customerOrders[0].id);
      }
    }
  }, [isReviewModalOpen, reviewTargetProduct]);

  if (!isReviewModalOpen) return null;

  const handleClose = () => {
    setIsReviewModalOpen(false);
    setReviewTargetProduct(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 3) {
      setErrorMsg('Bạn chỉ có thể tải lên tối đa 3 ảnh hoa thực tế.');
      return;
    }

    setIsUploadingPhoto(true);
    setErrorMsg('');

    try {
      const newCompressedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file, {
          maxWidth: 900,
          maxHeight: 900,
          quality: 0.75
        });
        newCompressedImages.push(compressed);
      }
      setImages((prev) => [...prev, ...newCompressedImages].slice(0, 3));
    } catch (err) {
      setErrorMsg('Không thể xử lý ảnh tải lên. Vui lòng thử lại với ảnh khác.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 5) {
      setErrorMsg('Vui lòng viết cảm nhận chi tiết từ ít nhất 5 ký tự.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = submitCustomerReview({
      rating,
      title: title.trim() || undefined,
      comment: comment.trim(),
      productName: selectedProduct.trim() || 'Mẫu hoa nghệ thuật',
      orderId: selectedOrderId || undefined,
      images: images.length > 0 ? images : undefined
    });

    setIsSubmitting(false);

    if (res.success) {
      handleClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const activeStarDisplay = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Florist Floral Gradient */}
        <div className="relative px-6 pt-5 pb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shrink-0">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Đóng cửa sổ"
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Góc Tri Ân & Đánh Giá</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Gửi Đánh Giá Hoa Tươi V&V Florielle
          </h3>
          <p className="text-emerald-100 text-xs mt-1 leading-relaxed">
            Chia sẻ cảm nhận chân thực của bạn để giúp tiệm ngày càng hoàn thiện nghệ thuật cắm hoa!
          </p>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-700 text-sm">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Identity Badge */}
          {customer && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'K'}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{customer.fullName}</div>
                  <div className="text-slate-500 text-[11px]">
                    SĐT: {customer.phone.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2')}
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Khách hàng đã mua</span>
              </div>
            </div>
          )}

          {/* Star Rating Picker */}
          <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Mức độ hài lòng của bạn <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 transition-all hover:scale-115 active:scale-95 cursor-pointer focus:outline-hidden"
                  aria-label={`${star} sao`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= activeStarDisplay
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-600 animate-in fade-in duration-150">
              {STAR_LABELS[activeStarDisplay] || 'Chọn mức độ đánh giá'}
            </p>
          </div>

          {/* Product Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Mẫu hoa bạn đã nhận <span className="text-slate-400 font-normal">(hoặc chọn từ đơn hàng)</span>
            </label>
            {pastOrderedProducts.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  {pastOrderedProducts.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="Mẫu hoa thiết kế theo yêu cầu riêng">
                    🌸 Mẫu hoa thiết kế theo yêu cầu riêng
                  </option>
                </select>
              </div>
            ) : (
              <input
                type="text"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                placeholder="Nhập tên mẫu hoa (Ví dụ: Bó hoa hồng Ecuador đỏ)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            )}
          </div>

          {/* Review Title (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Tiêu đề ngắn gọn <span className="text-slate-400 font-normal">(tùy chọn)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Hoa rất tươi, chụp duyệt trước rất ưng ý!"
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Review Comment (Required) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Chi tiết cảm nhận của bạn <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{comment.length}/500</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm về độ tươi của hoa, kiểu dáng cắm, tốc độ giao hàng, thái độ shipper hoặc sự hỗ trợ của florist..."
              rows={4}
              maxLength={500}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Photo Upload (Up to 3 photos of actual flowers) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ảnh hoa thực tế nhận được</span>
                <span className="text-slate-400 font-normal text-[11px]">(Tối đa 3 ảnh)</span>
              </label>
              <span className="text-[11px] text-slate-500">{images.length}/3 ảnh</span>
            </div>

            {/* Thumbnail previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 py-1">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-emerald-200 group bg-slate-100 shadow-2xs"
                  >
                    <img src={img} alt={`Ảnh review ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-90 hover:opacity-100 transition-all shadow-xs cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 3 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="customer-review-photo-input"
                />
                <label
                  htmlFor="customer-review-photo-input"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer ${
                    isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>{isUploadingPhoto ? 'Đang nén và tải ảnh...' : '+ Thêm ảnh hoa thực tế'}</span>
                </label>
              </div>
            )}
          </div>

          {/* Moderation Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11.5px] text-amber-900 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Quy trình kiểm duyệt công khai: </span>
              Để đảm bảo 100% đánh giá là trải nghiệm thực từ khách hàng thật, sau khi gửi, đánh giá sẽ được
              Ban Quản Trị V&V Florielle kiểm duyệt và duyệt hiển thị lên Trang Chủ trong thời gian sớm nhất.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingPhoto || comment.trim().length < 5}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-bold hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Đang gửi đánh giá...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Gửi Đánh Giá Ngay</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
