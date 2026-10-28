import React, { useState, useEffect } from 'react';
import TrustBar from './components/layout/TrustBar';
import Navbar from './components/layout/Navbar';
import HeroBanner from './components/storefront/HeroBanner';
import ProductCard from './components/storefront/ProductCard';
import ProductDetailModal from './components/pdp/ProductDetailModal';
import GuestCheckoutModal from './components/checkout/GuestCheckoutModal';
import OrderTrackingModal from './components/tracking/OrderTrackingModal';
import AdminPortal from './components/admin/AdminPortal';
import MobileFrame from './components/mobile/MobileFrame';
import Footer from './components/layout/Footer';
import { defaultProducts, initialOrders } from './data/defaultData';
import { api } from './services/api';

export default function App() {
  const [products, setProducts] = useState(defaultProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals & Navigation state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customRecipeForCheckout, setCustomRecipeForCheckout] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  
  // View & Theme
  const [currentView, setCurrentView] = useState('storefront'); // 'storefront' | 'admin'
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [currentTheme, setCurrentTheme] = useState('theme-rose'); // 'theme-rose' | 'theme-sage' | 'theme-lavender'

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = `${currentTheme} antialiased`;
  }, [currentTheme]);

  // Load products & orders from backend API if available
  useEffect(() => {
    async function loadData() {
      const serverProducts = await api.getProducts();
      if (serverProducts && serverProducts.length > 0) {
        setProducts(serverProducts);
      }
      const serverOrders = await api.getOrders();
      if (serverOrders && serverOrders.length > 0) {
        setOrders(serverOrders);
      }
    }
    loadData();
  }, []);

  // Filter products by category & search term
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = activeCategory === 'Tất cả' || prod.category.includes(activeCategory);
    const matchesSearch = !searchTerm || 
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Order Success from Guest Checkout
  const handleOrderSuccess = async (newOrderPayload) => {
    const newOrderId = 'DH-LP' + Math.floor(1000 + Math.random() * 9000);
    const completeOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...newOrderPayload,
      finishedPhotos: []
    };

    // Update local state
    setOrders([completeOrder, ...orders]);
    setCustomRecipeForCheckout(null);

    // Call backend API
    await api.createOrder(completeOrder);

    // Alert & Prompt customer
    const userChoice = window.confirm(
      `🎉 ĐẶT HOA THÀNH CÔNG!\n\nMã đơn hàng của bạn là: #${newOrderId}\nTổng thanh toán: ${completeOrder.totalPrice.toLocaleString('vi-VN')}₫\n\nVé chế tác đã được gửi tức thì về cho thợ hoa bên Admin Portal.\n\nBấm [OK] để xem màn hình Tra cứu & Theo dõi tiến độ đơn hoa này ngay bây giờ!`
    );

    if (userChoice) {
      setTrackingOrderId(newOrderId);
      setIsTrackingOpen(true);
    }
  };

  // Admin Actions
  const handleUpdatePrice = async (productId, newPrice) => {
    setProducts(products.map(p => p.id === productId ? { ...p, basePrice: newPrice } : p));
    await api.updatePrice(productId, newPrice);
  };

  const handleSurgeHolidayPrice = async (percentage) => {
    const rate = 1 + (percentage / 100);
    setProducts(products.map(p => ({
      ...p,
      basePrice: Math.round((p.basePrice * rate) / 10000) * 10000
    })));
    await api.surgeHolidayPrice(percentage);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await api.updateOrderStatus(orderId, newStatus);
  };

  const handleUploadFinishedPhoto = async (orderId, photoUrl) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'photo_sent',
          finishedPhotos: [...(o.finishedPhotos || []), photoUrl]
        };
      }
      return o;
    }));
    await api.uploadFinishedPhoto(orderId, photoUrl);
  };

  const handleApprovePhoto = async (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'approved' } : o));
    await api.approveOrderPhoto(orderId);
    alert('✅ Bạn đã bấm DUYỆT ẢNH THÀNH PHẨM! Tiệm đang đóng gói để bàn giao Shipper hỏa tốc cho bạn.');
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8 max-w-7xl mx-auto flex flex-col justify-between">
      
      <div>
        {/* Trust Bar (Hotline & Cam kết vàng theo phong cách hoatuoilinhphuong.com) */}
        <TrustBar />

        {/* Navigation Header */}
        <Navbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onOpenTracking={() => setIsTrackingOpen(true)}
          currentView={currentView}
          setCurrentView={setCurrentView}
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />

        {/* MAIN BODY: STOREFRONT VS ADMIN PORTAL */}
        {currentView === 'admin' ? (
          /* ======================================================== */
          /* 1. MÀN HÌNH QUẢN TRỊ ADMIN (LINK RIÊNG CHỦ QUÁN)         */
          /* ======================================================== */
          <AdminPortal 
            products={products}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUploadFinishedPhoto={handleUploadFinishedPhoto}
            onUpdatePrice={handleUpdatePrice}
            onSurgeHolidayPrice={handleSurgeHolidayPrice}
            onBackToStorefront={() => setCurrentView('storefront')}
          />
        ) : (
          /* ======================================================== */
          /* 2. MÀN HÌNH STOREFRONT CHO KHÁCH (DESKTOP HOẶC MOBILE)   */
          /* ======================================================== */
          deviceMode === 'mobile' ? (
            /* Khung điện thoại mô phỏng Mobile View */
            <MobileFrame 
              products={filteredProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenTracking={() => setIsTrackingOpen(true)}
            />
          ) : (
            /* Desktop Web View */
            <main className="space-y-8 animate-fadeIn">
              {/* Hero Banner */}
              <HeroBanner 
                onSelectFeatured={() => setSelectedProduct(products[0])}
              />

              {/* Product Grid */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                      {activeCategory === 'Tất cả' ? 'Tất Cả Mẫu Hoa Mới Trong Ngày' : activeCategory}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chọn bất kỳ mẫu nào để xem chi tiết ảnh HD và tùy biến màu giấy gói, ruy băng
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/70 text-slate-600 border border-white">
                    {filteredProducts.length} Mẫu Sẵn Có
                  </span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="glass-card rounded-3xl p-12 text-center text-slate-500 text-sm">
                    Không tìm thấy mẫu hoa phù hợp với từ khóa "{searchTerm}".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id}
                        product={product}
                        onSelect={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </main>
          )
        )}
      </div>

      {/* Footer */}
      <Footer onOpenAdmin={() => setCurrentView('admin')} />

      {/* ======================================================== */}
      {/* MODALS: PDP CUSTOMIZER, GUEST CHECKOUT, ORDER TRACKING    */}
      {/* ======================================================== */}

      {/* 1. Modal Chi Tiết Mẫu Hoa & Tùy Biến (PDP) */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onProceedToCheckout={(customRecipe) => {
            setSelectedProduct(null);
            setCustomRecipeForCheckout(customRecipe);
          }}
        />
      )}

      {/* 2. Modal Đặt Hàng Nhanh (Guest Checkout - Không cần đăng nhập) */}
      {customRecipeForCheckout && (
        <GuestCheckoutModal 
          customRecipe={customRecipeForCheckout}
          onClose={() => setCustomRecipeForCheckout(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* 3. Modal Tra Cứu Tiến Độ & Duyệt Ảnh Thành Phẩm */}
      {isTrackingOpen && (
        <OrderTrackingModal 
          orders={orders}
          initialOrderId={trackingOrderId}
          onClose={() => {
            setIsTrackingOpen(false);
            setTrackingOrderId(null);
          }}
          onApprovePhoto={handleApprovePhoto}
        />
      )}

    </div>
  );
}
