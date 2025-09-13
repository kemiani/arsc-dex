// src/app/components/TokenSelect.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import Image from "next/image";
import { TOKENS_CONFIG, getTokenForChain } from "../constants";
import { useChain } from "../context/ChainContext";
import { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type TokenSelectProps = {
  selectedKey?: string;
  onSelect: (tokenKey?: string) => void;
  className?: string;
};

export default function TokenSelect(props: TokenSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { activeChain } = useChain();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calcula dinámicamente el token seleccionado según la red activa
  const selectedToken = useMemo(() => {
    return props.selectedKey ? getTokenForChain(TOKENS_CONFIG[props.selectedKey], activeChain.id) : undefined;
  }, [props.selectedKey, activeChain.id]);

  // Handle mount state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Calculate dropdown position - always below
  const dropdownPosition = useMemo(() => {
    if (!open || !buttonRef.current) return { top: 0, left: 0, width: 0 };
    
    const rect = buttonRef.current.getBoundingClientRect();
    
    return {
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    };
  }, [open]);

  const DropdownContent = () => (
    <div 
      ref={dropdownRef}
      className="fixed bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1 max-h-60 overflow-y-auto z-[9999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${Math.max(dropdownPosition.width, 200)}px`,
      }}
    >
      {Object.entries(TOKENS_CONFIG).map(([key, tokenConfig]) => {
        const token = getTokenForChain(tokenConfig, activeChain.id);
        return (
          <button
            key={key}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-800/70 transition-colors",
              props.selectedKey === key && "bg-gray-800/80"
            )}
            onClick={() => {
              props.onSelect(key !== props.selectedKey ? key : undefined);
              setOpen(false);
            }}
          >
            <Image
              src={token.image || "/placeholder.svg"}
              alt={token.symbol}
              width={50}
              height={50}
              className="w-4 h-4 flex-shrink-0"
            />
            <span className="text-white text-sm truncate">{token.symbol}</span>
            {props.selectedKey === key && (
              <Check className="ml-auto h-4 w-4 text-cyan-400 flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          className={cn(
            "flex items-center gap-2 px-3 py-2 bg-gray-800/60 hover:bg-gray-800/80 text-white border border-gray-600 rounded-md transition-colors relative min-w-0",
            open && "bg-gray-800/80 ring-2 ring-cyan-400/50",
            props.className
          )}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          suppressHydrationWarning={true}
        >
          {selectedToken && (
            <Image
              src={selectedToken.image || "/placeholder.svg"}
              alt={selectedToken.symbol}
              width={50}
              height={50}
              className="w-4 h-4 flex-shrink-0"
            />
          )}
          <span className="text-sm truncate">{selectedToken?.symbol ?? "Seleccionar token"}</span>
          <ChevronsUpDown className={cn(
            "h-4 w-4 flex-shrink-0 opacity-50 transition-transform",
            open && "rotate-180"
          )} />
        </button>
      </div>
      
      {open && mounted && createPortal(<DropdownContent />, document.body)}
    </>
  );
}