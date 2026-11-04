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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-800">Chọn mẫu hoa</h4>
            <p className="text-slate-500 text-[11px]">
              Chọn mẫu có sẵn hoặc yêu cầu thiết kế theo tone màu và ngân sách của bạn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-800">Cắm hoa &amp; In thiệp</h4>
            <p className="text-slate-500 text-[11px]">
              Florist lành nghề tiến hành cắm hoa tươi và in băng rôn chúc mừng sang trọng.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-800">Duyệt ảnh thực tế</h4>
            <p className="text-slate-500 text-[11px]">
              Chụp ảnh hoa gửi qua Zalo cho bạn duyệt trước khi shipper lên đường giao.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-slate-800">Giao hoa tận tay</h4>
            <p className="text-slate-500 text-[11px]">
              Giao hoa đúng giờ hẹn, lịch sự và gửi thông báo xác nhận hoàn thành đơn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
