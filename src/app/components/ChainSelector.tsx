// src/app/components/ChainSelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useChain } from "../context/ChainContext";
import { SUPPORTED_CHAINS } from "../config/chains";
import { useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

export function ChainSelector() {
  const { activeChain, setActiveChain } = useChain();
  const activeWalletChain = useActiveWalletChain();
  const currentChainId = activeWalletChain?.id;
  const switchNetwork = useSwitchActiveWalletChain();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Estado para saber si se ha montado en el cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChainChange = async (chain: (typeof SUPPORTED_CHAINS)[number]) => {
    if (chain.id === currentChainId || isLoading) return; // Prevent duplicate calls
    
    setIsLoading(true);
    setOpen(false);
    
    try {
      await switchNetwork(chain.chain);
      setActiveChain(chain);
      toast.success(`Conectado a ${chain.name}`, {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al cambiar de red:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al cambiar de red",
        { duration: 5000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentChainId) {
      const newChain = SUPPORTED_CHAINS.find((chain) => chain.id === currentChainId);
      if (newChain && newChain.id !== activeChain.id) {
        setActiveChain(newChain);
      }
    }
  }, [currentChainId, activeChain.id, setActiveChain]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  // Render with default values during SSR, then update after mount
  if (!mounted) {
    return (
      <button
        className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-800/60 text-white border border-gray-600 rounded-md min-w-[120px] opacity-60"
        disabled={true}
      >
        <div className="flex items-center gap-2">
          {activeChain?.icon ? (
            <img
              src={activeChain.icon}
              alt={activeChain.name}
              className="w-5 h-5"
            />
          ) : (
            <div className="w-5 h-5 bg-gray-500 rounded-full" />
          )}
          <span className="hidden sm:inline text-sm">{activeChain.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 shrink-0 opacity-50" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-800/60 hover:bg-gray-800/80 text-white border border-gray-600 rounded-md min-w-[120px] transition-colors"
        disabled={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          console.log('ChainSelector button clicked, toggling from', open, 'to', !open);
          setOpen(!open);
        }}
      >
        <div className="flex items-center gap-2">
          {activeChain?.icon ? (
            <img
              src={activeChain.icon}
              alt={activeChain.name}
              className="w-5 h-5"
            />
          ) : (
            <div className="w-5 h-5 bg-gray-500 rounded-full" />
          )}
          <span className="hidden sm:inline text-sm">{activeChain.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 shrink-0 opacity-50" />
      </button>
      
      {open && (
        <div 
          className="absolute top-full left-0 mt-1 w-[200px] bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-[9999] py-1"
          onClick={(e) => e.stopPropagation()}
        >
          {SUPPORTED_CHAINS.map((chain) => (
            <button
              key={chain.id}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-800/70 transition-colors",
                chain.id === currentChainId && "bg-gray-800/80 opacity-60"
              )}
              disabled={chain.id === currentChainId}
              onClick={() => {
                console.log('Chain selected:', chain.name, 'ID:', chain.id, 'Current:', currentChainId);
                if (chain.id !== currentChainId) {
                  setOpen(false);
                  handleChainChange(chain);
                }
              }}
            >
              <img
                src={chain.icon || "/placeholder.svg"}
                alt={chain.name}
                className="w-5 h-5"
              />
              <span className="text-white text-sm">{chain.name}</span>
              {chain.id === currentChainId && (
                <Check className="ml-auto h-4 w-4 text-cyan-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}