// src/app/config/slippage.ts

export const SLIPPAGE_PRESETS = [
  { label: "0.1%", value: 0.1, description: "Muy conservador (stablecoins)" },
  { label: "0.5%", value: 0.5, description: "Conservador (recomendado)" },
  { label: "1%", value: 1.0, description: "Estándar" },
  { label: "3%", value: 3.0, description: "Alto riesgo" },
] as const;

export const DEFAULT_SLIPPAGE = 0.5;
export const MAX_SLIPPAGE = 50;
export const MIN_SLIPPAGE = 0.01;

// Slippage inteligente basado en el par de tokens y tamaño
export function calculateSmartSlippage(
  fromSymbol: string, 
  toSymbol: string, 
  swapSizeUSD: number
): number {
  // Detectar pares de stablecoins
  const stablecoins = ['USDC', 'USDT', 'DAI', 'BUSD'];
  const isStablePair = stablecoins.includes(fromSymbol) && stablecoins.includes(toSymbol);
  
  if (isStablePair) {
    return 0.1; // Stablecoins = 0.1%
  }
  
  // Slippage basado en tamaño del swap
  if (swapSizeUSD < 100) return 0.3;     // Swaps pequeños
  if (swapSizeUSD < 1000) return 0.5;    // Swaps medianos  
  if (swapSizeUSD < 10000) return 0.8;   // Swaps grandes
  return 1.2;                            // Swaps muy grandes
}

// Calcular minimum output con slippage
export function calculateMinimumOutput(
  expectedOutput: bigint, 
  slippagePercent: number
): bigint {
  const slippageMultiplier = BigInt(Math.floor((100 - slippagePercent) * 100));
  return (expectedOutput * slippageMultiplier) / BigInt(10000);
}

// Validar slippage
export function validateSlippage(slippage: number): { valid: boolean; warning?: string } {
  if (isNaN(slippage) || slippage < 0) {
    return { valid: false, warning: "Valor inválido" };
  }

  if (slippage < MIN_SLIPPAGE) {
    return { valid: false, warning: `Slippage mínimo: ${MIN_SLIPPAGE}%` };
  }
  
  if (slippage > MAX_SLIPPAGE) {
    return { valid: false, warning: `Slippage máximo: ${MAX_SLIPPAGE}%` };
  }
  
  if (slippage > 5) {
    return { valid: true, warning: "⚠️ Slippage alto - riesgo de pérdidas por MEV" };
  }
  
  if (slippage > 2) {
    return { valid: true, warning: "⚠️ Slippage elevado - considere reducir" };
  }
  
  return { valid: true };
}