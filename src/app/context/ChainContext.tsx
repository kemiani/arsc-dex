// src/app/context/ChainContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { SUPPORTED_CHAINS, DEFAULT_CHAIN, type SupportedChain } from "../config/chains";

interface ChainContextValue {
  activeChain: SupportedChain;
  setActiveChain: (chain: SupportedChain) => void;
  client: ThirdwebClient;
  isSupported: (chainId: number) => boolean;
  supportedChains: SupportedChain[];
}

const ChainContext = createContext<ChainContextValue | undefined>(undefined);

interface ChainProviderProps {
  children: ReactNode;
  client: ThirdwebClient;
}

export function ChainProvider({ children, client: initialClient }: ChainProviderProps) {
  const [activeChain, setActiveChain] = useState<SupportedChain>(DEFAULT_CHAIN);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeChain");
      if (stored) {
        try {
          const parsed: SupportedChain = JSON.parse(stored);
          // Verifica que la cadena almacenada siga siendo soportada
          const validChain = SUPPORTED_CHAINS.find((c) => c.id === parsed.id);
          if (validChain) {
            setActiveChain(validChain);
          }
        } catch (error) {
          console.error("ChainContext - Error parsing stored chain:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeChain", JSON.stringify(activeChain));
  }, [activeChain]);

  const client = useMemo(() => initialClient, [initialClient]);

  const isSupported = (chainId: number) =>
    SUPPORTED_CHAINS.some((chain) => chain.id === chainId);

  const value = useMemo(() => ({
    activeChain,
    setActiveChain,
    client,
    isSupported,
    supportedChains: SUPPORTED_CHAINS,
  }), [activeChain, client]);

  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>;
}

export function useChain() {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
}