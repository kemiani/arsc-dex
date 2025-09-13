"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SLIPPAGE, calculateSmartSlippage, validateSlippage } from '../config/slippage';

interface SlippageContextType {
  slippage: number;
  setSlippage: (slippage: number) => void;
  isProtectedMode: boolean;
  setProtectedMode: (enabled: boolean) => void;
  getSmartSlippage: (fromSymbol: string, toSymbol: string, swapSizeUSD: number) => number;
  validateSlippageValue: (slippage: number) => { valid: boolean; warning?: string };
  getEffectiveSlippage: (fromSymbol: string, toSymbol: string, swapSizeUSD: number) => number;
}

const SlippageContext = createContext<SlippageContextType | undefined>(undefined);

export function SlippageProvider({ children }: { children: React.ReactNode }) {
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);
  const [isProtectedMode, setProtectedMode] = useState<boolean>(false);

  // Cargar configuración del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dex-slippage-settings');
    if (saved) {
      try {
        const { slippage: savedSlippage, protectedMode } = JSON.parse(saved);
        if (typeof savedSlippage === 'number') {
          setSlippage(savedSlippage);
        }
        if (typeof protectedMode === 'boolean') {
          setProtectedMode(protectedMode);
        }
      } catch (error) {
        console.warn('Error loading slippage settings:', error);
      }
    }
  }, []);

  // Guardar configuración en localStorage
  useEffect(() => {
    localStorage.setItem('dex-slippage-settings', JSON.stringify({
      slippage,
      protectedMode: isProtectedMode,
    }));
  }, [slippage, isProtectedMode]);

  const getSmartSlippage = (fromSymbol: string, toSymbol: string, swapSizeUSD: number) => {
    return calculateSmartSlippage(fromSymbol, toSymbol, swapSizeUSD);
  };

  const validateSlippageValue = (slippage: number) => {
    return validateSlippage(slippage);
  };

  // Obtener slippage efectivo (manual o automático según modo protegido)
  const getEffectiveSlippage = (fromSymbol: string, toSymbol: string, swapSizeUSD: number) => {
    if (isProtectedMode) {
      const smartSlippage = calculateSmartSlippage(fromSymbol, toSymbol, swapSizeUSD);
      // En modo protegido, usar el menor entre smart slippage y slippage manual
      return Math.min(smartSlippage, slippage);
    }
    return slippage;
  };

  return (
    <SlippageContext.Provider
      value={{
        slippage,
        setSlippage,
        isProtectedMode,
        setProtectedMode,
        getSmartSlippage,
        validateSlippageValue,
        getEffectiveSlippage,
      }}
    >
      {children}
    </SlippageContext.Provider>
  );
}

export function useSlippage() {
  const context = useContext(SlippageContext);
  if (!context) {
    throw new Error('useSlippage must be used within SlippageProvider');
  }
  return context;
}