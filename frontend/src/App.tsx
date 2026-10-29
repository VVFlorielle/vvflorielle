import React, { useState } from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { MarqueeBanner } from './components/MarqueeBanner';
import { Footer } from './components/Footer';
import { PublicStore } from './pages/PublicStore';
import { CustomerPortal } from './pages/CustomerPortal';
import { AdminPortal } from './pages/AdminPortal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { MobileBottomDock } from './components/MobileBottomDock';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { MascotAssistant } from './components/MascotAssistant';
import { InfoPopups, PopupType } from './components/InfoPopups';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentView, toasts } = useStore();
  const [activePopup, setActivePopup] = useState<PopupType>(null);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Background Decorative Ambient Blobs for Glass Effect */}
      <div className="bg-ambient-layer">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
        <div className="ambient-blob-3" />
        <div className="ambient-blob-4" />
        <div className="ambient-blob-5" />
      </div>

      {/* Unified Floating Sticky Header & Announcement Banner (Maintains Unbreachable Gap) */}
      <div className="sticky top-2 sm:top-4 z-50 w-full pointer-events-none flex flex-col gap-2.5 sm:gap-3">
        <div className="pointer-events-auto relative z-20">
          <Header onOpenPopup={(type) => setActivePopup(type)} />
        </div>
        <div className="pointer-events-auto relative z-10">
          <MarqueeBanner onOpenPopup={(type) => setActivePopup(type)} />
        </div>
      </div>

      {/* Active View (extra bottom padding on mobile for MobileBottomDock) */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentView === 'store' && <PublicStore />}
        {currentView === 'customer' && <CustomerPortal />}
        {currentView === 'admin' && <AdminPortal />}
      </main>

      {/* Main Footer */}
      <Footer onOpenPopup={(type) => setActivePopup(type)} />

      {/* Mobile E-Commerce Bottom Dock */}
      <MobileBottomDock />

      {/* Floating Speed Dial & Contact Tooltip (Right Side) */}
      <FloatingContactWidget />

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
