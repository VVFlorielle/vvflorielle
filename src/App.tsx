import React, { useState, useEffect } from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { MarqueeBanner } from './components/MarqueeBanner';
import { Footer } from './components/Footer';
import { PublicStore } from './pages/PublicStore';
import { CatalogPage } from './pages/CatalogPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CarePage } from './pages/CarePage';
import { CustomerPortal } from './pages/CustomerPortal';
import { AdminPortal } from './pages/AdminPortal';
import { OwnerPortal } from './pages/OwnerPortal';
import { ManagementHeader } from './components/management/ManagementHeader';
import { ManagementBottomDock } from './components/management/ManagementBottomDock';
import { AdminWeatherAssistant } from './components/management/AdminWeatherAssistant';
import { QrScannerModal } from './components/management/QrScannerModal';
import { AdminLockScreenModal } from './components/management/AdminLockScreenModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CustomerReviewModal } from './components/CustomerReviewModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { CustomerOrderQrModal } from './components/CustomerOrderQrModal';
import { MobileBottomDock } from './components/MobileBottomDock';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { FloatingCartWidget } from './components/FloatingCartWidget';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { MascotAssistant } from './components/MascotAssistant';
import { InfoPopups, PopupType } from './components/InfoPopups';
import { GlobalInAppToast } from './components/GlobalInAppToast';
import { useBodyScrollLock } from './utils/scrollLock';
import { useResponsiveLayout } from './utils/responsiveLayout';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const AppContent: React.FC = () => {
  useResponsiveLayout();

  const {
    currentView,
    toasts,
    isAdmin,
    activeAdminUser,
    activeAdminTab,
    setActiveAdminTab,
    orders,
    products,
    completeOrder,
    selectedProduct,
    isCartOpen,
    isAuthModalOpen,
    isReviewModalOpen,
    setIsReviewModalOpen,
    isSessionLocked
  } = useStore();
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState(false);
  const [isCustomerQrOpen, setIsCustomerQrOpen] = useState(false);

  // Lock body scroll whenever any global modal is open
  const isAnyModalOpen = Boolean(
    selectedProduct ||
    isCartOpen ||
    isAuthModalOpen ||
    isReviewModalOpen ||
    activePopup ||
    (isQrScannerOpen && Boolean(isAdmin)) ||
    isOrderLookupOpen ||
    isCustomerQrOpen ||
    isSessionLocked
  );
  useBodyScrollLock(isAnyModalOpen);

  const pendingDepositOrdersCount = (orders || []).filter(
    (o) => !o.isDepositPaid && (o.status === 'WAITING_DEPOSIT' || o.status === 'PENDING')
  ).length;

  // Synchronized scroll-dimming for sticky top navigation & announcement banner (60fps rAF throttled, zero jank)
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 30;
          setIsHeaderScrolled((prev) => (prev !== shouldScroll ? shouldScroll : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const handleOpenCustomDesign = () => setActivePopup('custom-design');
    const handleOpenShipping = () => setActivePopup('shipping');
    const handleOpenWeddingEvent = () => setActivePopup('wedding-event');
    const handleOpenPolicy = () => setActivePopup('policy');
    window.addEventListener('open-custom-design-modal', handleOpenCustomDesign);
    window.addEventListener('open-shipping-modal', handleOpenShipping);
    window.addEventListener('open-wedding-event-modal', handleOpenWeddingEvent);
    window.addEventListener('open-policy-modal', handleOpenPolicy);

    const handlePopState = () => {
      const hash = window.location.hash;
      if (currentView === 'admin' || currentView === 'owner') {
        if (hash.includes('/')) {
          const tab = hash.split('/')[1];
          setActiveAdminTab(tab);
        } else {
          setActiveAdminTab('dashboard');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('open-custom-design-modal', handleOpenCustomDesign);
      window.removeEventListener('open-shipping-modal', handleOpenShipping);
      window.removeEventListener('open-wedding-event-modal', handleOpenWeddingEvent);
      window.removeEventListener('open-policy-modal', handleOpenPolicy);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentView, setActiveAdminTab]);

  const isManagementView = currentView === 'admin' || currentView === 'owner';

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden w-full">
      {/* Background Decorative Ambient Blobs for Glass Effect */}
      <div className="bg-ambient-layer">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
        <div className="ambient-blob-3" />
        <div className="ambient-blob-4" />
        <div className="ambient-blob-5" />
      </div>

      {/* Top Navigation: ManagementHeader for Admin/Owner OR Public Floating Header for Customers */}
      {isManagementView ? (
        <div className={`fixed top-2 sm:top-3 left-0 right-0 z-40 w-full pointer-events-none transition-all duration-300 management-header-wrapper ${
          isAnyModalOpen ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100'
        }`}>
          <div className="pointer-events-auto">
            <ManagementHeader
              role={currentView === 'owner' ? 'owner' : 'admin'}
              onNavigateTab={(tab) => setActiveAdminTab(tab)}
            />
          </div>
        </div>
      ) : (
        <div className={`fixed top-2 sm:top-3 left-0 right-0 z-50 w-full pointer-events-none flex flex-col gap-2 sm:gap-2.5 transition-all duration-200 public-header-wrapper ${
          isAnyModalOpen ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100'
        }`}>
          <div className="pointer-events-auto relative z-20">
            <Header isScrolled={isHeaderScrolled} onOpenPopup={(type) => setActivePopup(type)} />
          </div>
          <div className="pointer-events-auto relative z-10">
            <MarqueeBanner isScrolled={isHeaderScrolled} onOpenPopup={(type) => setActivePopup(type)} />
          </div>
        </div>
      )}

      {/* Active View (Clean dedicated layout for management; spacious top padding for homepage hero & subpages so fixed Header & Marquee never overlap or tuck underneath) */}
      <main className={`flex-1 ${isManagementView ? 'pt-[68px] sm:pt-[84px] pb-8' : currentView === 'store' ? 'pt-[118px] sm:pt-32 pb-2' : 'pt-[124px] sm:pt-[156px] pb-2'}`}>
        {currentView === 'store' && <PublicStore />}
        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'care' && <CarePage />}
        {currentView === 'customer' && <CustomerPortal />}
        {currentView === 'admin' && <AdminPortal />}
        {currentView === 'owner' && <OwnerPortal />}
      </main>

      {/* Customer-Only Elements (Hidden during Management Mode for 100% focus and zero overlap) */}
      {!isManagementView && (
        <>
          {/* Main Footer (Public Storefront Only: store, catalog, about, contact, care - NEVER in admin or customer management) */}
          {!isManagementView && currentView !== 'customer' && (
            <Footer onOpenPopup={(type) => setActivePopup(type)} />
          )}

          {/* Mobile Glass Dock for Guests / Customers (Only when NOT logged in as Admin/Owner) */}
          {!isAdmin && (
            <MobileBottomDock
              onOpenPopup={(type) => setActivePopup(type)}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
              onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
              onOpenCustomerQr={() => setIsCustomerQrOpen(true)}
            />
          )}

          {/* Floating Speed Dial & Contact Tooltip (Right Side) */}
          <FloatingContactWidget />

          {/* Floating Draggable Cart Widget (Bottom Right) */}
          <FloatingCartWidget />

          {/* Floating AI Mascot Assistant (Left Side) */}
          <MascotAssistant />
        </>
      )}

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <AuthModal />
      <CustomerReviewModal />
      <InfoPopups activePopup={activePopup} onClose={() => setActivePopup(null)} />

      {/* Management Bottom Dock (Mobile Only when logged in as Admin/Owner - Desktop uses Top Navbar) */}
      {isAdmin && (
        <ManagementBottomDock
          role={activeAdminUser === 'admin' ? 'admin' : 'owner'}
          activeTab={activeAdminTab}
          onSelectTab={(tab) => setActiveAdminTab(tab)}
          pendingOrdersCount={pendingDepositOrdersCount}
          productsCount={products.length}
          onOpenQrScanner={() => setIsQrScannerOpen(true)}
        />
      )}

      {/* Floating Admin Weather & Mascot Assistant (Management View Only) */}
      {isManagementView && <AdminWeatherAssistant />}

      {/* Global QR Scanner Modal for Admin & Owner */}
      <QrScannerModal
        isOpen={isQrScannerOpen && Boolean(isAdmin)}
        onClose={() => setIsQrScannerOpen(false)}
        orders={orders}
        onCompleteOrder={completeOrder}
      />

      {/* Guest Order Lookup Modal */}
      <OrderLookupModal
        isOpen={isOrderLookupOpen}
        onClose={() => setIsOrderLookupOpen(false)}
      />

      {/* Customer QR Delivery & Point Claim Modal */}
      <CustomerOrderQrModal
        isOpen={isCustomerQrOpen}
        onClose={() => setIsCustomerQrOpen(false)}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
      />

      {/* Global Scroll-to-top Floating Button (Storefront & Management) */}
      <ScrollToTopButton />

      {/* Global In-App Center Toast & Alert Notification (Fixed Center, Frosted Glass Backdrop) */}
      <GlobalInAppToast />

      {/* Global Auto-Lock Screen on 30-min Inactivity (Mounted at root with 0 top gaps) */}
      <AdminLockScreenModal />
    </div>
  );
};

export default AppContent;
