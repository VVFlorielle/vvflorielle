import React, { useState } from 'react';
import { Search, Eye, Award, KeyRound, Edit3, Trash2, ArrowLeft, UserPlus } from 'lucide-react';
import { CustomerUser, Order } from '../../../types';
import { ActionConfirmModal } from '../ManagementModals';

interface CustomersSubpageProps {
  customers: CustomerUser[];
  onBackToDashboard: () => void;
  formatPrice: (p: number) => string;
  getCustomerOrderHistory: (phone: string) => Order[];
  onSelectCustomer: (cust: CustomerUser) => void;
  onAdjustPoints: (cust: CustomerUser) => void;
  onResetPassword: (cust: CustomerUser) => void;
  onEditNotes: (cust: CustomerUser) => void;
  onEditCustomer?: (cust: CustomerUser) => void;
  onOpenAddCustomer?: () => void;
  onDeleteCustomer: (id: string) => void;
  title?: string;
}

export const CustomersSubpage: React.FC<CustomersSubpageProps> = ({
  customers,
  onBackToDashboard,
  formatPrice,
  getCustomerOrderHistory,
  onSelectCustomer,
  onAdjustPoints,
  onResetPassword,
  onEditNotes,
  onEditCustomer,
  onOpenAddCustomer,
  onDeleteCustomer,
  title = 'Quản Lý Khách Hàng & Hạng Thành Viên VIP'
}) => {
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTierFilter, setCustomerTierFilter] = useState('ALL');
  const [customerToDelete, setCustomerToDelete] = useState<CustomerUser | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.fullName.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) ||
      (c.notes && c.notes.toLowerCase().includes(customerSearch.toLowerCase()));
    const matchTier = customerTierFilter === 'ALL' || c.tier === customerTierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div className="glass-panel p-4 sm:p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200">
      {/* Header and Back Button */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Tổng Quan</span>
          </button>
          <h2 className="font-bold text-base sm:text-lg text-slate-800">{title}</h2>
        </div>

        {onOpenAddCustomer && (
          <button
            type="button"
            onClick={onOpenAddCustomer}
            className="btn-primary text-xs py-2 px-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm Khách Hàng Mới</span>
            <span className="sm:hidden">Thêm Khách</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-800">
            Quản Lý Khách Hàng Thân Thiết ({customers.length})
          </h3>
          <p className="text-xs text-slate-500">
            Tra cứu hồ sơ khách hàng, phân hạng VIP, lịch sử chi tiêu và cấp lại mật khẩu tạm thời
          </p>
        </div>

        {/* Tier Filters */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {['ALL', 'Thành viên mới', 'Bạc', 'Vàng', 'Kim Cương'].map((tier) => (
            <button
              key={tier}
              onClick={() => setCustomerTierFilter(tier)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                customerTierFilter === tier
                  ? 'bg-purple-700 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tier === 'ALL' ? 'Tất cả hạng' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Search box (Fixed padding and perfectly centered icon, no overlap) */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Tìm theo tên, số điện thoại, ghi chú hoặc email..."
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
          className="glass-input w-full text-xs py-2.5 !pl-10 !pr-4 rounded-xl"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs col-span-2">
            Không tìm thấy khách hàng nào phù hợp với điều kiện tìm kiếm.
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const history = getCustomerOrderHistory(cust.phone);
            return (
              <div
                key={cust.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3 min-w-0 overflow-hidden"
              >
                {/* Responsive Customer Header: No overflow on small mobile */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 min-w-0">
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
                      {cust.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 truncate max-w-[150px] sm:max-w-none">
                          {cust.fullName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            cust.tier === 'Kim Cương'
                              ? 'bg-purple-100 text-purple-800'
                              : cust.tier === 'Vàng'
                              ? 'bg-amber-100 text-amber-800'
                              : cust.tier === 'Bạc'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {cust.tier}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            cust.isVerified
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {cust.isVerified ? 'Hội viên xác thực' : 'Thành viên thường'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                        <span className="font-mono font-medium">{cust.phone}</span>
                        {cust.email && <span className="truncate">• {cust.email}</span>}
                      </div>
                      {cust.address && (
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">{cust.address}</div>
                      )}
                    </div>
                  </div>

                  {/* Customer Spending & Points Summary (Responsive Row on Mobile) */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end bg-slate-50/80 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none shrink-0 border border-slate-100 sm:border-0">
                    <div className="text-sm font-extrabold text-emerald-700">
                      {cust.points} <span className="text-[10px] font-semibold">điểm</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {cust.ordersCount} đơn • {formatPrice(cust.totalSpent)}
                    </div>
                  </div>
                </div>

                {/* Florist Notes & Preferences */}
                {(cust.notes || cust.favoriteFlowers) && (
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                    {cust.favoriteFlowers && (
                      <div>
                        <strong className="text-slate-700">Hoa yêu thích:</strong>{' '}
                        {Array.isArray(cust.favoriteFlowers)
                          ? cust.favoriteFlowers.join(', ')
                          : cust.favoriteFlowers}
                      </div>
                    )}
                    {cust.notes && (
                      <div className="text-slate-500 italic">
                        <strong className="text-slate-700 not-italic">Ghi chú florist:</strong> {cust.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 shrink-0">ĐK: {cust.registeredAt || 'Gần đây'}</span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onSelectCustomer(cust)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Chi tiết ({history.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAdjustPoints(cust)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3 h-3" />
                      <span>+/- Điểm</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onResetPassword(cust)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-[11px] flex items-center gap-1 border border-amber-200 cursor-pointer"
                      title="Cấp lại mật khẩu tạm thời cho khách hàng"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Cấp MK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onEditCustomer) {
                          onEditCustomer(cust);
                        } else {
                          onEditNotes(cust);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
                      title="Chỉnh sửa hồ sơ khách hàng"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomerToDelete(cust)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Xóa khách hàng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* In-App Action Confirm Modal: No Browser Dialogs! */}
      <ActionConfirmModal
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          if (customerToDelete) {
            onDeleteCustomer(customerToDelete.id);
            setCustomerToDelete(null);
          }
        }}
        title="Xóa Khách Hàng Thân Thiết"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${customerToDelete?.fullName}" (${customerToDelete?.phone}) khỏi hệ thống không? Toàn bộ điểm tích lũy và hồ sơ sẽ bị xóa vĩnh viễn.`}
        confirmText="Xóa Khách Hàng"
        type="danger"
      />
    </div>
  );
};
