import { createContext, useCallback, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import { Basket, getCount, getTotal } from '@/services/products';
import { configureWebAudio, playSound, prepareAudio, releaseAudio, unlockAudio } from '@/services/audio';
interface RegisterState {
  basket: Basket; total: number; count: number; soundEnabled: boolean;
  processing: boolean; paid: boolean; paidTotal: number;
  addProduct: (id: string) => void; removeProduct: (id: string) => void;
  toggleSound: () => void; pay: (method: 'cash' | 'card') => void; reset: () => void;
}
export const RegisterContext = createContext<RegisterState | undefined>(undefined);
export function RegisterProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<Basket>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paidTotal, setPaidTotal] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const total = useMemo(() => getTotal(basket), [basket]);
  const count = useMemo(() => getCount(basket), [basket]);
  useEffect(() => {
    if (Platform.OS === 'web') {
      const browser = globalThis as any;
      configureWebAudio(browser.AudioContext || browser.webkitAudioContext);
    } else { void prepareAudio(); }
    return () => { if (timer.current) clearTimeout(timer.current); releaseAudio(); };
  }, []);
  const addProduct = useCallback((id: string) => {
    if (locked.current) return;
    if (soundEnabled) playSound('scan');
    setBasket(previous => ({ ...previous, [id]: (previous[id] || 0) + 1 }));
  }, [soundEnabled]);
  const removeProduct = useCallback((id: string) => {
    if (locked.current) return;
    setBasket(previous => ({ ...previous, [id]: Math.max(0, (previous[id] || 0) - 1) }));
  }, []);
  const toggleSound = useCallback(() => { unlockAudio(); setSoundEnabled(previous => !previous); }, []);
  const pay = useCallback((method: 'cash' | 'card') => {
    if (total <= 0 || locked.current) return;
    locked.current = true;
    setPaidTotal(total);
    const complete = () => { setProcessing(false); setPaid(true); if (soundEnabled) playSound('success'); };
    if (method === 'card') {
      if (soundEnabled) playSound('card');
      setProcessing(true);
      timer.current = setTimeout(complete, 1500);
    } else { unlockAudio(); complete(); }
  }, [total, soundEnabled]);
  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    locked.current = false; setBasket({}); setPaid(false); setProcessing(false); setPaidTotal(0);
  }, []);
  return <RegisterContext.Provider value={{ basket, total, count, soundEnabled, processing, paid, paidTotal, addProduct, removeProduct, toggleSound, pay, reset }}>{children}</RegisterContext.Provider>;
}
