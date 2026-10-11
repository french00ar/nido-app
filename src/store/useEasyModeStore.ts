// Estado global del modo accesible/fácil (zustand + persistencia en este dispositivo).
import { useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface EasyModeState {
  easyMode: boolean;
  toggle: () => void;
  setEasyMode: (value: boolean) => void;
}

export const useEasyModeStore = create<EasyModeState>()(
  persist(
    (set) => ({
      easyMode: false,
      toggle: () => set((state) => ({ easyMode: !state.easyMode })),
      setEasyMode: (value) => set({ easyMode: value }),
    }),
    {
      name: 'nidoapp_easy_mode',
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
);

// Aplica la clase `easy-mode` en <html> mientras el modo está activo.
export function useApplyEasyMode(): void {
  const easyMode = useEasyModeStore((state) => state.easyMode);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('easy-mode', easyMode);
    return () => root.classList.remove('easy-mode');
  }, [easyMode]);
}
