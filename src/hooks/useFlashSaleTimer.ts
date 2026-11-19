import { useState, useEffect } from 'react';
import { getFlashSaleState, FlashSaleState } from '../utils/voucherVisibility';

export interface FlashSaleTimerResult {
  isLive: boolean;
  activeSlot: '12:00 - 13:00' | '20:00 - 21:00';
  statusLabel: string;
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
}

export function useFlashSaleTimer(simulated = false): FlashSaleTimerResult {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const state: FlashSaleState = getFlashSaleState(simulated);
  const diffMs = Math.max(0, state.targetDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const hours = String(h).padStart(2, '0');
  const minutes = String(m).padStart(2, '0');
  const seconds = String(s).padStart(2, '0');

  return {
    isLive: state.isLive,
    activeSlot: state.activeSlot,
    statusLabel: state.statusLabel,
    hours,
    minutes,
    seconds,
    totalSeconds
  };
}
