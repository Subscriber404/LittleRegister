import { useContext } from 'react';
import { RegisterContext } from '@/contexts/RegisterContext';
export function useRegister() {
  const context = useContext(RegisterContext);
  if (!context) throw new Error('useRegister requires RegisterProvider');
  return context;
}
