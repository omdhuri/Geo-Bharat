import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArea(sqm: number): string {
  if (sqm >= 10000) {
    return `${(sqm / 10000).toFixed(2)} ha`;
  }
  return `${Math.round(sqm).toLocaleString()} m²`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'text-emerald-700';
  if (confidence >= 70) return 'text-amber-700';
  return 'text-rose-700';
}
