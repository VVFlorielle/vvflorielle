import React from 'react';

export const StoreCommitmentSection: React.FC = () => {
  return (
    <section className="container">
      <div className="glass-panel p-8 bg-gradient-to-r from-emerald-50/70 via-white/80 to-emerald-50/70 rounded-[32px] border border-white/80">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-lg font-bold text-slate-900">
            Quy Trình Phục Vụ Tại V&amp;V Florielle
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Chuyên nghiệp, nhanh chóng và tận tâm trong từng cánh hoa trao tay
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-xs">
          <div className="p-3 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs">
                1
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800">Chọn mẫu hoa</h4>
              <p className="text-slate-500 text-[10.5px] sm:text-[11px] leading-relaxed">
                Chọn mẫu có sẵn hoặc thiết kế theo tone màu và ngân sách của bạn.
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs">
                2
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800">Cắm hoa &amp; In thiệp</h4>
              <p className="text-slate-500 text-[10.5px] sm:text-[11px] leading-relaxed">
                Florist cắm hoa tươi và in thiệp/băng rôn chúc mừng sang trọng.
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs">
                3
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800">Duyệt ảnh thực tế</h4>
              <p className="text-slate-500 text-[10.5px] sm:text-[11px] leading-relaxed">
                Chụp ảnh hoa gửi Zalo cho bạn duyệt trước khi shipper giao.
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs">
                4
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800">Giao hoa tận tay</h4>
              <p className="text-slate-500 text-[10.5px] sm:text-[11px] leading-relaxed">
                Giao đúng giờ hẹn, lịch sự và gửi thông báo hoàn thành đơn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
