"use client";

import React, { useState } from 'react';
import { Settings, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { useSlippage } from '../context/SlippageContext';
import { SLIPPAGE_PRESETS } from '../config/slippage';

interface SlippageSettingsProps {
  className?: string;
}

export default function SlippageSettings({ className }: SlippageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState('');
  
  const { 
    slippage, 
    setSlippage, 
    isProtectedMode, 
    setProtectedMode, 
    validateSlippageValue 
  } = useSlippage();

  const handlePresetClick = (value: number) => {
    setSlippage(value);
    setCustomSlippage('');
  };

  const handleCustomSlippage = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSlippage(numValue);
    }
  };

  const validation = validateSlippageValue(slippage);

  return (
    <div className={cn("relative", className)}>
      {/* Main trigger button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 bg-gray-800/60 hover:bg-gray-800/80 text-white border-gray-600",
          isProtectedMode && "ring-2 ring-green-400/50"
        )}
      >
        {isProtectedMode ? (
          <Shield className="h-4 w-4 text-green-400" />
        ) : (
          <Settings className="h-4 w-4" />
        )}
        {slippage}%
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 z-50">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Configuración de Slippage</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>

              {/* Protected Mode Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-white">Modo Protegido</span>
                </div>
                <button
                  onClick={() => setProtectedMode(!isProtectedMode)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative",
                    isProtectedMode ? "bg-green-600" : "bg-gray-600"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                      isProtectedMode ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {isProtectedMode && (
                <div className="text-xs text-green-400 bg-green-400/10 p-2 rounded border border-green-400/20">
                  Slippage automático basado en el tipo de tokens y tamaño del swap
                </div>
              )}

              {/* Slippage Presets */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Presets Comunes</label>
                <div className="grid grid-cols-2 gap-2">
                  {SLIPPAGE_PRESETS.map((preset) => (
                    <Button
                      key={preset.value}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetClick(preset.value)}
                      className={cn(
                        "text-xs justify-center",
                        slippage === preset.value
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "bg-gray-800/60 text-gray-300 border-gray-600 hover:bg-gray-800"
                      )}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Slippage */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Slippage Personalizado</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="50"
                    value={customSlippage}
                    onChange={(e) => handleCustomSlippage(e.target.value)}
                    placeholder={slippage.toString()}
                    className="bg-gray-800/60 border-gray-600 text-white text-sm"
                  />
                  <span className="text-gray-400 text-sm">%</span>
                </div>
              </div>

              {/* Validation Warning */}
              {!validation.valid && (
                <div className="text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  {validation.warning}
                </div>
              )}

              {validation.valid && validation.warning && (
                <div className="text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded border border-yellow-400/20">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  {validation.warning}
                </div>
              )}

              {/* Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Slippage bajo (0.1-0.5%): Mejor protección, más posibilidad de fallo</p>
                <p>• Slippage alto (1-3%): Menos protección, swaps más exitosos</p>
                <p>• Modo Protegido: Slippage automático según riesgo del par</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}