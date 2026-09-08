import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numeric value to Indonesian Rupiah (IDR).
 * Example: 50000 -> "Rp 50.000" (no trailing decimals)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

/**
 * Format date string or object to standard Indonesian locale (Asia/Jakarta WIB).
 * Example: "2026-09-08" -> "Selasa, 8 Sep 2026"
 */
export function formatDateIndonesian(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
    ...options,
  };

  return new Intl.DateTimeFormat('id-ID', defaultOptions).format(d);
}

/**
 * Format date and time in WIB format.
 * Example: "8 Sep 2026, 14:30 WIB"
 */
export function formatDateTimeIndonesian(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const datePart = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(d);

  const timePart = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(d);

  return `${datePart}, ${timePart} WIB`;
}

/**
 * Normalize Indonesian phone numbers to standard 628... format for WhatsApp links.
 * Example: "08123456789" -> "628123456789"
 * Example: "+62 812-3456-789" -> "628123456789"
 */
export function formatPhoneNumberIndonesian(phone?: string | null): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

import type { Variants } from 'framer-motion';

/**
 * Framer Motion Animation Variants for consistent page transitions
 */
export const pageMotionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

/**
 * Framer Motion Variants for Modal Dialogs
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalDialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } },
};


