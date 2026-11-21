import React, { useState, useEffect } from 'react';
import { Search, Eye, Award, KeyRound, Edit3, Trash2, ArrowLeft, UserPlus, Download, Ban, ShieldCheck, CheckCircle2, Gift } from 'lucide-react';
import { CustomerUser, Order } from '../../../types';
import { ActionConfirmModal } from '../ManagementModals';
import { PrivilegeVoucherModal } from '../PrivilegeVoucherModal';

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
  onToggleBlockCustomer?: (cust: CustomerUser) => void;
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
  onToggleBlockCustomer,
  onOpenAddCustomer,
  onDeleteCustomer,
  title = 'Quản Lý Khách Hàng & Hạng Thành Viên VIP'
}) => {
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTierFilter, setCustomerTierFilter] = useState('ALL');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BLOCKED' | 'DELETED'>('ALL');
  const [customerToDelete, setCustomerToDelete] = useState<CustomerUser | null>(null);
  const [isPrivilegeModalOpen, setIsPrivilegeModalOpen] = useState(false);
  const [selectedCustForPrivilege, setSelectedCustForPrivilege] = useState<CustomerUser | null>(null);
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  const [expandedCustId, setExpandedCustId] = useState<string | null>(null);
  const [customersPage, setCustomersPage] = useState<number>(1);
  const [customersPageSize, setCustomersPageSize] = useState<number | 'ALL'>(10);

  useEffect(() => {
    setCustomersPage(1);
  }, [customerSearch, customerTierFilter, customerStatusFilter]);

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.fullName.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      (c.accountCode && c.accountCode.toLowerCase().includes(customerSearch.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) ||
      (c.notes && c.notes.toLowerCase().includes(customerSearch.toLowerCase()));
    const matchTier = customerTierFilter === 'ALL' || c.tier === customerTierFilter;
    const matchStatus =
      customerStatusFilter === 'ALL' ||
      (customerStatusFilter === 'ACTIVE' && (c.status === 'ACTIVE' || !c.status)) ||
      c.status === customerStatusFilter;
    return matchSearch && matchTier && matchStatus;
  });

  // Phân trang khách hàng
  const totalPages =
    customersPageSize === 'ALL'
      ? 1
      : Math.max(1, Math.ceil(filteredCustomers.length / Number(customersPageSize)));
  const displayedCustomers =
    customersPageSize === 'ALL'
      ? filteredCustomers
      : filteredCustomers.slice(
          (customersPage - 1) * Number(customersPageSize),
          customersPage * Number(customersPageSize)
        );

  const handleExportCustomersCsv = () => {
    if (filteredCustomers.length === 0) return;
    const headers = [
      'Mã Định Danh',
      'Họ Và Tên',
      'Số Điện Thoại',
      'Email',
      'Hạng Hội Viên',
      'Điểm Tích Lũy',
      'Tổng Chi Tiêu (VNĐ)',
      'Số Đơn Đã Đặt',
      'Xác Thực OTP',
      'Trạng Thái',
      'Ngày Đăng Ký',
      'Địa Chỉ',
      'Nhãn Gu Khách Hàng (Tags)',
      'Ghi Chú Florist'
    ];

    const rows = filteredCustomers.map((c) => [
      `"${c.accountCode || ''}"`,
      `"${c.fullName || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${c.tier || ''}"`,
      `"${c.points || 0}"`,
      `"${c.totalSpent || 0}"`,
      `"${c.ordersCount || 0}"`,
      `"${c.isVerified ? 'Đã xác thực' : 'Thành viên thường'}"`,
      `"${c.status || 'ACTIVE'}"`,
      `"${c.registeredAt || ''}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      `"${((c.tags || []).join(', ')).replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Hoi_Vien_VVFlorielle_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel p-4 sm:p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200">
      {/* 1. Header căn giữa chuẩn Phototiinlove kèm nút Trở về Bàn Làm Việc (Icon gọn gàng) */}
      <div className="relative flex items-center justify-between min-h-[44px] pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 flex items-center justify-center border border-slate-200/80 transition-all cursor-pointer shrink-0 shadow-2xs"
          title="Trở về Bàn làm việc"
          aria-label="Trở về Bàn làm việc"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center mx-auto px-2">
          <small className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
            KHÁCH HÀNG &amp; HỘI VIÊN
          </small>
          <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        <div className="w-8 h-8 shrink-0" />
      </div>

      {/* 2. Tiêu đề phụ & Mô tả căn giữa kèm Action Bar hàng 2 */}
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-3">
        <div className="text-center space-y-0.5">
          <h3 className="font-bold text-base text-slate-800">
            Quản Lý Khách Hàng Thân Thiết ({customers.length})
          </h3>
          <p className="text-xs text-slate-500">
            Tra cứu hồ sơ khách hàng, phân hạng VIP, lịch sử chi tiêu và cấp lại mật khẩu tạm thời
          </p>
        </div>

        {/* Action Buttons & Tier Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCustomersCsv}
              disabled={filteredCustomers.length === 0}
              className={`btn-secondary text-xs py-1.5 sm:py-2 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs font-bold ${
                filteredCustomers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Xuất danh sách hội viên ra file CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Xuất CSV ({filteredCustomers.length})</span>
              <span className="sm:hidden">CSV</span>
            </button>

            {onOpenAddCustomer && (
              <button
                type="button"
                onClick={onOpenAddCustomer}
                className="btn-primary text-xs py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 font-bold"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Thêm Khách Hàng Mới</span>
                <span className="sm:hidden">Thêm Khách</span>
              </button>
            )}
          </div>

          {/* Tier & Status Filters (2 hàng sạch sẽ, 0 scroll ngang) */}
          <div className="flex flex-col sm:items-end gap-1.5 text-xs w-full sm:w-auto">
            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto">
              {['ALL', 'Thành viên mới', 'Bạc', 'Vàng', 'Kim Cương'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setCustomerTierFilter(tier)}
                  className={`px-2 sm:px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer text-center justify-center flex items-center ${
                    customerTierFilter === tier
                      ? 'bg-purple-700 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="truncate">{tier === 'ALL' ? 'Tất cả hạng' : tier}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:flex items-center gap-1.5 w-full sm:w-auto">
            {(['ALL', 'ACTIVE', 'BLOCKED', 'DELETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setCustomerStatusFilter(st)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer text-center justify-center flex items-center ${
                  customerStatusFilter === st
                    ? 'bg-slate-800 text-white font-bold shadow-2xs'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <span className="truncate">
                  {st === 'ALL' && 'Tất cả trạng thái'}
                  {st === 'ACTIVE' && '✓ Hoạt động'}
                  {st === 'BLOCKED' && '🚫 Tạm khóa'}
                  {st === 'DELETED' && 'Ẩn danh (NĐ13)'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

      {/* Search box & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-md flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Tìm theo tên, số điện thoại, ghi chú hoặc email..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="glass-input w-full text-xs py-2.5 !pl-10 !pr-4 rounded-xl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Chế độ xem Compact 1 dòng */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setIsCompactMode(false)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              !isCompactMode
                ? 'bg-white text-purple-950 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🗂️ Thẻ hội viên
          </button>
          <button
            type="button"
            onClick={() => setIsCompactMode(true)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              isCompactMode
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Thu gọn 1 dòng
          </button>
        </div>
      </div>

      {/* Customers List */}
      <div className={isCompactMode ? "space-y-2.5" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {filteredCustomers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs col-span-2">
            Không tìm thấy khách hàng nào phù hợp với điều kiện tìm kiếm.
          </div>
        ) : (
          displayedCustomers.map((cust) => {
            const history = getCustomerOrderHistory(cust.phone);
            const isExpanded = expandedCustId === cust.id;

            if (isCompactMode && !isExpanded) {
              return (
                <div
                  key={cust.id}
                  onClick={() => setExpandedCustId(cust.id)}
                  className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-2.5 text-xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                      {cust.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 truncate">{cust.fullName}</span>
                        <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 hidden sm:inline">
                          {cust.accountCode || `VVF-${cust.id.slice(-4)}`}
                        </span>
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
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
                        {cust.status === 'BLOCKED' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            🚫 KHÓA
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                        {cust.phone} {cust.email ? `• ${cust.email}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 text-right">
                    <div>
                      <div className="text-xs font-extrabold text-emerald-700">{cust.points} điểm</div>
                      <div className="text-[10px] text-slate-400">{cust.ordersCount} đơn • {formatPrice(cust.totalSpent)}</div>
                    </div>
                    <button
                      type="button"
                      className="p-1.5 rounded-xl bg-slate-100 group-hover:bg-purple-50 text-slate-400 group-hover:text-purple-700 transition-colors"
                      title="Xem chi tiết & thao tác"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={cust.id}
                className={`p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3 min-w-0 overflow-hidden ${
                  isCompactMode && isExpanded ? 'border-purple-300 ring-2 ring-purple-500/20' : ''
                }`}
              >
                {isCompactMode && isExpanded && (
                  <div className="flex justify-end pb-1 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setExpandedCustId(null)}
                      className="text-[11px] font-bold text-slate-500 hover:text-purple-700 underline cursor-pointer"
                    >
                      ▲ Thu gọn lại
                    </button>
                  </div>
                )}
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
                        <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                          {cust.accountCode || `VVF-CUST-${cust.id.slice(-6)}`}
                        </span>
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
                        {cust.status === 'BLOCKED' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                            🚫 TẠM KHÓA
                          </span>
                        )}
                        {cust.status === 'DELETED' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300 shrink-0">
                            ẨN DANH (NĐ13)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                        <span className="font-mono font-medium">{cust.phone}</span>
                        {cust.email && <span className="truncate">• {cust.email}</span>}
                      </div>
                      {cust.address && (
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">{cust.address}</div>
                      )}
                      {cust.tags && cust.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cust.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center gap-1 shadow-2xs"
                            >
                              <span>🏷️</span>
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
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
                      onClick={() => {
                        setSelectedCustForPrivilege(cust);
                        setIsPrivilegeModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-pink-200"
                      title="Cấp voucher đặc quyền trực tiếp vào ví hội viên"
                    >
                      <Gift className="w-3 h-3 text-pink-600" />
                      <span>Tặng Mã</span>
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

                    {onToggleBlockCustomer && (
                      <button
                        type="button"
                        onClick={() => onToggleBlockCustomer(cust)}
                        className={`p-1 rounded-lg cursor-pointer transition-colors ${
                          cust.status === 'BLOCKED'
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-amber-600 hover:bg-amber-50'
                        }`}
                        title={cust.status === 'BLOCKED' ? 'Mở khóa tài khoản' : 'Tạm khóa tài khoản'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}

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

      {/* Phân trang danh sách khách hàng */}
      {filteredCustomers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200/80 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select
              value={customersPageSize}
              onChange={(e) => {
                const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                setCustomersPageSize(val);
                setCustomersPage(1);
              }}
              className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value={10}>10 hội viên / trang</option>
              <option value={20}>20 hội viên / trang</option>
              <option value={50}>50 hội viên / trang</option>
              <option value="ALL">Tất cả ({filteredCustomers.length})</option>
            </select>
            <span>trong tổng số <strong>{filteredCustomers.length}</strong> khách hàng</span>
          </div>

          {customersPageSize !== 'ALL' && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={customersPage <= 1}
                onClick={() => setCustomersPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer"
              >
                Trước
              </button>
              <div className="px-3 py-1 font-bold text-purple-900 bg-purple-50 rounded-xl border border-purple-200/60">
                {customersPage} / {totalPages}
              </div>
              <button
                type="button"
                disabled={customersPage >= totalPages}
                onClick={() => setCustomersPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}

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

      {/* Cấp Voucher Đặc Quyền Trực Tiếp Cho Hội Viên */}
      <PrivilegeVoucherModal
        isOpen={isPrivilegeModalOpen}
        onClose={() => {
          setIsPrivilegeModalOpen(false);
          setSelectedCustForPrivilege(null);
        }}
        initialCustomerId={selectedCustForPrivilege?.id}
      />
    </div>
  );
};
