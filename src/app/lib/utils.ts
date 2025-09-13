import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bigIntMax = (...args: bigint[]) => args.reduce((m, e) => (e ?? 0) > (m ?? 0) ? e : m);

export function withTimeout(promise: () => Promise<any>, timeout: number) {
  return Promise.race([
    promise(),
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeout);
    })
  ]);
}

export function formatNumber(value: string | number, maxDecimals: number = 6): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num) || num === 0) return '0';

  // Para números muy pequeños, mostrar en notación científica
  if (num > 0 && num < 0.000001) {
    return num.toExponential(2);
  }

  // Para números grandes, usar separadores de miles
  if (num >= 1000000) {
    return num.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
  }

  // Para números normales, limitar decimales
  const formatted = num.toFixed(maxDecimals);
  // Remover ceros innecesarios al final
  return formatted.replace(/\.?0+$/, '');
}