import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Search,
  ArrowLeft,
  DollarSign,
  Receipt,
  Gift,
  QrCode,
  Banknote,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';
import { Order, CustomerUser } from '../../../types';

interface RevenueSubpageProps {
  orders: Order[];
  customers: CustomerUser[];
  onBackToDashboard: () => void;
  formatPrice: (p: number) => string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  title?: string;
}

type DateRangeType = 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth' | 'custom';

const isVietQR = (ord: Order): boolean => {
  return (
    ord.paymentMethod === 'BANK_TRANSFER' ||
    Boolean(ord.paymentBillImage) ||
    Boolean(ord.billImageDataUrl) ||
    Boolean(ord.isDepositPaid)
  );
};

const getOrderDiscount = (ord: Order): number => {
  return ord.discountAmount || 0;
};

const getOrderItemsSummary = (ord: Order): string => {
  if (!ord.items || ord.items.length === 0) return 'Hoa tươi nghệ thuật';
  return ord.items.map((it) => `${it.productName || 'Hoa tươi'} (x${it.quantity})`).join(', ');
};

export const RevenueSubpage: React.FC<RevenueSubpageProps> = ({
  orders,
  customers,
  onBackToDashboard,
  formatPrice,
  showToast,
  title = 'Quản Lý Doanh Thu & Báo Cáo Tài Chính'
}) => {
  const [dateRange, setDateRange] = useState<DateRangeType>('month');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'ALL' | 'VIETQR' | 'COD'>('ALL');

  // Compute date thresholds
  const { filteredOrders, totals, dailyStats } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 7 days ago
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    // First day of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    // First day of last month and last day of last month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

    // Filter by date range and search query
    const res = orders.filter((ord) => {
      // Extract YYYY-MM-DD from order.createdAt or assume today if invalid
      let ordDate = todayStr;
      if (ord.createdAt) {
        if (ord.createdAt.includes('T')) {
          ordDate = ord.createdAt.split('T')[0];
        } else if (ord.createdAt.match(/^\d{4}-\d{2}-\d{2}/)) {
          ordDate = ord.createdAt.substring(0, 10);
        }
      }

      // Range check
      let inRange = true;
      if (dateRange === 'today') {
        inRange = ordDate === todayStr;
      } else if (dateRange === 'yesterday') {
        inRange = ordDate === yesterdayStr;
      } else if (dateRange === 'week') {
        inRange = ordDate >= weekAgoStr && ordDate <= todayStr;
      } else if (dateRange === 'month') {
        inRange = ordDate >= startOfMonth && ordDate <= todayStr;
      } else if (dateRange === 'lastMonth') {
        inRange = ordDate >= startOfLastMonth && ordDate <= endOfLastMonth;
      } else if (dateRange === 'custom') {
        if (customStart && ordDate < customStart) inRange = false;
        if (customEnd && ordDate > customEnd) inRange = false;
      }

      if (!inRange) return false;

      // Payment method check
      if (paymentMethodFilter === 'VIETQR' && !isVietQR(ord)) {
        return false;
      }
      if (paymentMethodFilter === 'COD' && isVietQR(ord)) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = ord.id.toLowerCase().includes(q);
        const matchName = ord.recipientName.toLowerCase().includes(q);
        const matchPhone = ord.recipientPhone.includes(q);
        const matchVoucher = ord.voucherCode?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchVoucher) return false;
      }

      return true;
    });

    // Compute totals
    let grossRevenue = 0;
    let voucherDiscount = 0;
    let netRevenue = 0;
    let qrDepositTotal = 0;
    let codTotal = 0;
    let totalPointsAwarded = 0;

    const dailyMap: Record<
      string,
      { date: string; count: number; gross: number; discount: number; net: number; points: number }
    > = {};

    res.forEach((ord) => {
      const discount = getOrderDiscount(ord);
      const gross = (ord.totalAmount || 0) + discount;
      const net = ord.totalAmount || 0;

      grossRevenue += gross;
      voucherDiscount += discount;
      netRevenue += net;

      // VietQR vs COD breakdown
      if (isVietQR(ord)) {
        // VietQR paid amount (either deposit 50% or full amount)
        const depositAmount = ord.depositAmount || Math.round(net * 0.5);
        qrDepositTotal += depositAmount;
        codTotal += Math.max(0, net - depositAmount);
      } else {
        codTotal += net;
      }

      const pts = Math.floor(net / 10000);
      totalPointsAwarded += pts;

      // Daily grouping
      const dateKey = ord.createdAt?.substring(0, 10) || todayStr;
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { date: dateKey, count: 0, gross: 0, discount: 0, net: 0, points: 0 };
      }
      dailyMap[dateKey].count += 1;
      dailyMap[dateKey].gross += gross;
      dailyMap[dateKey].discount += discount;
      dailyMap[dateKey].net += net;
      dailyMap[dateKey].points += pts;
    });

    const dailyStatsArr = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date));

    return {
      filteredOrders: res,
      totals: {
        count: res.length,
        grossRevenue,
        voucherDiscount,
        netRevenue,
        avgOrder: res.length > 0 ? Math.round(netRevenue / res.length) : 0,
        qrDepositTotal,
        codTotal,
        totalPointsAwarded
      },
      dailyStats: dailyStatsArr
    };
  }, [orders, dateRange, customStart, customEnd, searchQuery, paymentMethodFilter]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast('Không có giao dịch nào trong khoảng thời gian đã chọn!', 'error');
      return;
    }

    const headers = [
      'Mã Đơn',
      'Ngày Giờ',
      'Khách Hàng',
      'Số Điện Thoại',
      'Địa Chỉ',
      'Mẫu Hoa',
      'Số Lượng',
      'Doanh Thu Gốc (VNĐ)',
      'Mã Voucher',
      'Giảm Giá Voucher (VNĐ)',
      'Thực Thu (VNĐ)',
      'Thanh Toán VietQR (VNĐ)',
      'Thu Tiền Mặt COD (VNĐ)',
      'Trạng Thái'
    ];

    const rows = filteredOrders.map((ord) => {
      const discount = getOrderDiscount(ord);
      const gross = (ord.totalAmount || 0) + discount;
      const net = ord.totalAmount || 0;
      const isQR = isVietQR(ord);
      const qrVal = isQR ? (ord.depositAmount || Math.round(net * 0.5)) : 0;
      const codVal = Math.max(0, net - qrVal);
      const itemsList = getOrderItemsSummary(ord);

      return [
        ord.id,
        ord.createdAt || 'Hôm nay',
        `"${ord.recipientName.replace(/"/g, '""')}"`,
        `'${ord.recipientPhone}`,
        `"${(ord.recipientAddress || '').replace(/"/g, '""')}"`,
        `"${itemsList.replace(/"/g, '""')}"`,
        ord.items?.reduce((s, i) => s + i.quantity, 0) || 1,
        gross,
        ord.voucherCode || '-',
        discount,
        net,
        qrVal,
        codVal,
        ord.status
      ].join(',');
    });

    // Add BOM for proper UTF-8 Excel rendering
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_Cao_Doanh_Thu_Florielle_${dateRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Đã xuất file báo cáo doanh thu thành công! 📈', 'success');
  };

  return (
    <div className="glass-panel p-4 sm:p-6 space-y-6 rounded-[28px] animate-in fade-in duration-200">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Tổng Quan</span>
          </button>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span>{title}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Kiểm soát toàn bộ dòng tiền, phân tích doanh thu VietQR và tiền mặt theo chuẩn hệ thống
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="btn-primary text-xs py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Báo Cáo Excel / CSV</span>
        </button>
      </div>

      {/* Filter Toolbar (Matching phototiinlove) */}
      <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Thời gian:</span>
            </span>
            {[
              { id: 'today', label: 'Hôm nay' },
              { id: 'yesterday', label: 'Hôm qua' },
              { id: 'week', label: '7 ngày qua' },
              { id: 'month', label: 'Tháng này' },
              { id: 'lastMonth', label: 'Tháng trước' },
              { id: 'custom', label: 'Tùy chỉnh' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setDateRange(p.id as DateRangeType)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  dateRange === p.id
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-semibold mr-1">Thanh toán:</span>
            {(['ALL', 'VIETQR', 'COD'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethodFilter(m)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  paymentMethodFilter === m
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m === 'ALL' ? 'Tất cả' : m === 'VIETQR' ? 'VietQR' : 'Tiền mặt/COD'}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Pickers & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100 items-center">
          {dateRange === 'custom' && (
            <div className="sm:col-span-5 flex items-center gap-2 text-xs">
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 block mb-0.5">Từ ngày</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="glass-input w-full text-xs py-1.5 px-2.5 rounded-xl font-medium"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 block mb-0.5">Đến ngày</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="glass-input w-full text-xs py-1.5 px-2.5 rounded-xl font-medium"
                />
              </div>
            </div>
          )}

          <div className={dateRange === 'custom' ? 'sm:col-span-7' : 'sm:col-span-12'}>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo mã đơn (#ORD-...), tên khách, số điện thoại hoặc mã voucher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full text-xs py-2 !pl-10 !pr-4 rounded-xl"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Financial KPI Cards (Pastel Glassmorphic Tiles) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Tổng Giao Dịch */}
        <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-purple-900">
            <span>Tổng Đơn Hàng</span>
            <Receipt className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-black text-purple-900 mt-1 font-mono">{totals.count}</div>
          <div className="text-[11px] text-purple-700 mt-0.5">Đơn hoàn tất &amp; giao</div>
        </div>

        {/* 2. Doanh Thu Gốc */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Doanh Thu Gốc</span>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono truncate">
            {formatPrice(totals.grossRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Giá niêm yết ban đầu</div>
        </div>

        {/* 3. Giảm Giá Voucher */}
        <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-900">
            <span>Giảm Voucher</span>
            <Gift className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-700 mt-1 font-mono truncate">
            -{formatPrice(totals.voucherDiscount)}
          </div>
          <div className="text-[11px] text-rose-600 mt-0.5">Khuyến mại &amp; điểm đổi</div>
        </div>

        {/* 4. Doanh Thu Thực Tế (Net Revenue) */}
        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 shadow-sm ring-1 ring-emerald-300/50">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>Thực Thu (Net)</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1 font-mono truncate">
            {formatPrice(totals.netRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Tiền tiệm nhận về</div>
        </div>

        {/* 5. Thực Thu VietQR */}
        <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-900">
            <span>Cọc VietQR</span>
            <QrCode className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-xl font-black text-cyan-900 mt-1 font-mono truncate">
            {formatPrice(totals.qrDepositTotal)}
          </div>
          <div className="text-[11px] text-cyan-700 mt-0.5">Tài khoản ngân hàng</div>
        </div>

        {/* 6. Tiền Mặt / COD */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>Tiền Mặt COD</span>
            <Banknote className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl font-black text-amber-900 mt-1 font-mono truncate">
            {formatPrice(totals.codTotal)}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Thu sau khi giao hoa</div>
        </div>
      </div>

      {/* Transactions Details Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-700" />
            <span>Chi Tiết Giao Dịch Trong Kỳ ({filteredOrders.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Trung bình: <strong className="text-slate-800">{formatPrice(totals.avgOrder)}</strong>/đơn
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Mã Đơn &amp; Ngày</th>
                <th className="py-3 px-3.5">Khách Hàng</th>
                <th className="py-3 px-3.5">Mẫu Hoa Đặt</th>
                <th className="py-3 px-3.5 text-right">Doanh Thu Gốc</th>
                <th className="py-3 px-3.5 text-center">Voucher</th>
                <th className="py-3 px-3.5 text-right">Giảm Giá</th>
                <th className="py-3 px-3.5 text-right font-black">Thực Thu</th>
                <th className="py-3 px-3.5 text-center">Thanh Toán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Không tìm thấy giao dịch nào phù hợp với bộ lọc thời gian này.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const discount = getOrderDiscount(ord);
                  const gross = (ord.totalAmount || 0) + discount;
                  const isQR = isVietQR(ord);
                  const itemsText = getOrderItemsSummary(ord);

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono">
                        <span className="font-bold text-purple-800">#{ord.id}</span>
                        <div className="text-[11px] text-slate-400">{ord.createdAt || 'Gần đây'}</div>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-800">{ord.recipientName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{ord.recipientPhone}</div>
                      </td>
                      <td className="py-3 px-3.5 max-w-xs truncate" title={itemsText}>
                        <span className="font-medium text-slate-700">{itemsText}</span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-slate-600">
                        {formatPrice(gross)}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        {ord.voucherCode ? (
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            {ord.voucherCode}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-rose-600 font-semibold">
                        {discount ? `-${formatPrice(discount)}` : '0đ'}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-black text-emerald-800 text-sm">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                            isQR
                              ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isQR ? <QrCode className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                          <span>{isQR ? 'VietQR Cọc' : 'Tiền Mặt'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (revenue-tx-card format from phototiinlove) */}
        <div className="lg:hidden space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs bg-white/80 rounded-2xl border border-slate-200">
              Không tìm thấy giao dịch nào.
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const discount = getOrderDiscount(ord);
              const gross = (ord.totalAmount || 0) + discount;
              const isQR = isVietQR(ord);
              const itemsText = getOrderItemsSummary(ord);

              return (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-purple-800">#{ord.id}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isQR ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isQR ? 'VietQR' : 'COD'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 mt-0.5">{ord.recipientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{ord.recipientPhone}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-emerald-800 font-mono">
                        {formatPrice(ord.totalAmount)}
                      </div>
                      {discount ? (
                        <div className="text-[10px] text-rose-600 font-medium">
                          Giảm {formatPrice(discount)}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 text-[11px] text-slate-600 space-y-1 border border-slate-100">
                    <div className="truncate">🌸 {itemsText}</div>
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span>{ord.createdAt || 'Gần đây'}</span>
                      {ord.voucherCode && (
                        <span className="font-bold text-rose-700">Mã: {ord.voucherCode}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Daily Aggregate Breakdown Table */}
      {dailyStats.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Tổng Hợp Doanh Thu Theo Từng Ngày</span>
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3.5">Ngày</th>
                  <th className="py-2.5 px-3.5 text-center">Số Giao Dịch</th>
                  <th className="py-2.5 px-3.5 text-right">Doanh Thu Gốc</th>
                  <th className="py-2.5 px-3.5 text-right">Giảm Voucher</th>
                  <th className="py-2.5 px-3.5 text-right font-black">Thực Thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyStats.map((d) => (
                  <tr key={d.date} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3.5 font-bold font-mono text-slate-800">{d.date}</td>
                    <td className="py-2.5 px-3.5 text-center font-bold text-purple-700">{d.count} đơn</td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">{formatPrice(d.gross)}</td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-rose-600 font-semibold">
                      {d.discount ? `-${formatPrice(d.discount)}` : '0đ'}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-black text-emerald-800">
                      {formatPrice(d.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
