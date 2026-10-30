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
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { MobileBottomDock } from './components/MobileBottomDock';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { FloatingCartWidget } from './components/FloatingCartWidget';
import { MascotAssistant } from './components/MascotAssistant';
import { InfoPopups, PopupType } from './components/InfoPopups';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentView, toasts } = useStore();
  const [activePopup, setActivePopup] = useState<PopupType>(null);

  // Synchronized scroll-dimming for sticky top navigation & announcement banner
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  useEffect(() => {
    let timer: any = null;
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsHeaderScrolled(false);
      }, 350);
    };
    const handleTouch = () => setIsHeaderScrolled(false);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    const handleOpenCustomDesign = () => setActivePopup('custom-design');
    window.addEventListener('open-custom-design-modal', handleOpenCustomDesign);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('open-custom-design-modal', handleOpenCustomDesign);
      if (timer) clearTimeout(timer);
    };
  }, []);

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

      {/* Unified Floating Fixed Header & Announcement Banner (Always floating on top, never hidden) */}
      <div className={`fixed top-2 sm:top-3 left-0 right-0 z-50 w-full pointer-events-none flex flex-col gap-2 sm:gap-2.5 transition-opacity duration-300 ${
        isHeaderScrolled ? 'opacity-30 backdrop-blur-md hover:opacity-100' : 'opacity-100'
      }`}>
        <div className="pointer-events-auto relative z-20">
          <Header onOpenPopup={(type) => setActivePopup(type)} />
        </div>
        <div className="pointer-events-auto relative z-10">
          <MarqueeBanner onOpenPopup={(type) => setActivePopup(type)} />
        </div>
      </div>

      {/* Active View (Proper top padding for fixed header & compact bottom spacing for footer) */}
      <main className="flex-1 pt-24 sm:pt-32 pb-8 md:pb-4">
        {currentView === 'store' && <PublicStore />}
        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'care' && <CarePage />}
        {currentView === 'customer' && <CustomerPortal />}
        {currentView === 'admin' && <AdminPortal />}
      </main>

      {/* Main Footer */}
      <Footer onOpenPopup={(type) => setActivePopup(type)} />

      {/* Mobile & Desktop Management Bottom Glass Dock */}
      <MobileBottomDock onOpenPopup={(type) => setActivePopup(type)} />

      {/* Floating Speed Dial & Contact Tooltip (Right Side) */}
      <FloatingContactWidget />

      {/* Floating Draggable Cart Widget (Bottom Right) */}
      <FloatingCartWidget />

      {/* Floating AI Mascot Assistant (Left Side) */}
      <MascotAssistant />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <AuthModal />
      <InfoPopups activePopup={activePopup} onClose={() => setActivePopup(null)} />

      {/* Global Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-300 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppContent;
