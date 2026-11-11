import React from 'react';
import { X } from 'lucide-react';
import { CustomDesignModal } from './popups/CustomDesignModal';
import { FlowerCareModal } from './popups/FlowerCareModal';
import { ShippingPolicyModal } from './popups/ShippingPolicyModal';
import { WeddingEventModal } from './popups/WeddingEventModal';
import {
  GuaranteeModalContent,
  LocationsModalContent,
  ServicesModalContent,
  AboutUsModalContent
} from './popups/StoreStoryModals';
import {
  VouchersModalContent,
  PromotionsModalContent,
  AppDownloadModalContent
} from './popups/PromotionsAndAppModals';
import { useBodyScrollLock } from '../utils/scrollLock';

export type PopupType =
  | 'guarantee'
  | 'voucher'
  | 'locations'
  | 'care'
  | 'promotions'
  | 'services'
  | 'shipping'
  | 'wedding-event'
  | 'about'
  | 'app-download'
  | 'custom-design'
  | null;

interface InfoPopupsProps {
  activePopup: PopupType;
  onClose: () => void;
}

export const InfoPopups: React.FC<InfoPopupsProps> = ({ activePopup, onClose }) => {
  useBodyScrollLock(Boolean(activePopup));
  if (!activePopup) return null;

  const isWideModal =
    activePopup === 'services' ||
    activePopup === 'care' ||
    activePopup === 'custom-design' ||
    activePopup === 'shipping' ||
    activePopup === 'wedding-event';

  return (
    <div
      className="glass-overlay z-[100000] flex items-center justify-center p-3 pb-28 sm:p-5 sm:pb-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`glass-modal-content w-full relative transition-all duration-300 overflow-hidden ${
          isWideModal
            ? 'max-w-2xl sm:max-w-3xl md:max-w-4xl'
            : activePopup === 'app-download'
            ? 'max-w-lg md:max-w-2xl'
            : 'max-w-md md:max-w-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors z-20 cursor-pointer"
          title="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Inner Contents (no-scrollbar, safe max-height above bottom dock) */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100dvh-130px)] sm:max-h-[85vh] no-scrollbar">
          {activePopup === 'custom-design' && <CustomDesignModal onClose={onClose} />}
          {activePopup === 'care' && <FlowerCareModal onClose={onClose} />}
          {activePopup === 'shipping' && <ShippingPolicyModal onClose={onClose} />}
          {activePopup === 'wedding-event' && <WeddingEventModal onClose={onClose} />}
          {activePopup === 'guarantee' && <GuaranteeModalContent onClose={onClose} />}
          {activePopup === 'locations' && <LocationsModalContent onClose={onClose} />}
          {activePopup === 'services' && <ServicesModalContent onClose={onClose} />}
          {activePopup === 'about' && <AboutUsModalContent onClose={onClose} />}
          {activePopup === 'voucher' && <VouchersModalContent onClose={onClose} />}
          {activePopup === 'promotions' && <PromotionsModalContent onClose={onClose} />}
          {activePopup === 'app-download' && <AppDownloadModalContent onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};
