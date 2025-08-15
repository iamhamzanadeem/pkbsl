import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyPKR(amount: number, options?: { showInMillions?: boolean; decimals?: number }): string {
  const { showInMillions = amount >= 1000000, decimals = showInMillions ? 1 : 0 } = options || {};
  
  if (showInMillions && amount >= 1000000) {
    const millions = amount / 1000000;
    return `PKR ${millions.toFixed(decimals)}M`;
  }
  
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}
