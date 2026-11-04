import React from 'react';
import { Flower2, ChevronRight } from 'lucide-react';
import { Order } from '../../types';

interface ManagementRecentOrdersProps {
  orders: Order[];
  onViewAllOrders: () => void;
  onViewOrderDetail: (orderId: string) => void;
  onViewBill: (order: Order) => void;
  onApproveDeposit: (orderId: string) => void;
  formatPrice: (p: number) => string;
}

export const ManagementRecentOrders: React.FC<ManagementRecentOrdersProps> = ({
  orders,
  onViewAllOrders,
  onViewOrderDetail,
  onViewBill,
  onApproveDeposit,
  formatPrice
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-[28px] bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <Flower2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800">
              Bảng Vận Hành Tiệm Hoa V&amp;V Florielle
            </h3>
            <p className="text-xs text-slate-500">
              105 Doãn Kế Thiện • Duyệt đơn cọc VietQR 1-chạm, kiểm soát còn hoa tức thì và chăm sóc khách hàng thân thiết.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewAllOrders}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors w-fit cursor-pointer"
        >
          <span>Xem tất cả {orders.length} đơn hàng</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Orders List (Pending Deposit or Arranging) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Mã Đơn</th>
              <th className="py-2.5 px-3">Khách Đặt</th>
              <th className="py-2.5 px-3">Mẫu Hoa</th>
              <th className="py-2.5 px-3">Cọc 50%</th>
              <th className="py-2.5 px-3">Trạng Thái</th>
              <th className="py-2.5 px-3 text-right">Thao Tác Nhanh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.slice(0, 4).map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-slate-800">
                  #{ord.id}
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-800">{ord.senderName}</div>
                  <div className="text-[11px] text-slate-500">{ord.senderPhone}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="line-clamp-1 font-medium text-slate-700">
                    {ord.items.map((i) => i.productName).join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {ord.deliveryDate} • {ord.deliveryTimeSlot}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-bold text-emerald-700">
                    {formatPrice(ord.depositAmount || Math.round(ord.totalAmount * 0.5))}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {ord.paymentStatus === 'PAID'
                      ? 'Đã thu 100%'
                      : ord.paymentStatus === 'PARTIAL_PAID'
                      ? 'Đã cọc 50%'
                      : 'Chưa cọc'}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ord.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : ord.status === 'ARRANGING'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : ord.status === 'SHIPPING'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {ord.status === 'PENDING'
                      ? 'Chờ Duyệt Cọc'
                      : ord.status === 'ARRANGING'
                      ? 'Đang Cắm Hoa'
                      : ord.status === 'SHIPPING'
                      ? 'Đang Giao'
                      : ord.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                  {ord.paymentBillImage && (
                    <button
                      type="button"
                      onClick={() => onViewBill(ord)}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[11px] font-semibold cursor-pointer"
                    >
                      Xem Bill
                    </button>
                  )}
                  {ord.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => onApproveDeposit(ord.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs cursor-pointer"
                    >
                      Duyệt Cọc
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onViewOrderDetail(ord.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                  >
                    Chi Tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
