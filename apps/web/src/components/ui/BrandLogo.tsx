import * as React from 'react';
import { cn } from '../../lib/utils';

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  badgeText?: string;
}

export function BrandLogo({
  size = 'md',
  showText = true,
  badgeText = 'UMKM AI',
  className,
  ...props
}: BrandLogoProps) {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', badge: 'text-[9px] px-1 py-0.2' },
    md: { icon: 'w-9 h-9', text: 'text-base', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 'w-11 h-11', text: 'text-xl', badge: 'text-[11px] px-2 py-0.5' },
    xl: { icon: 'w-14 h-14', text: 'text-2xl', badge: 'text-xs px-2.5 py-0.5' },
  };

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)} {...props}>
      <div className={cn('relative shrink-0 rounded-xl overflow-hidden shadow-lg shadow-amber-500/10 transition-transform hover:scale-105', sizeMap[size].icon)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <rect width="48" height="48" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5"/>
          <circle cx="24" cy="24" r="14" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3"/>
          <path d="M18 20C18 16.6863 20.6863 14 24 14C27.3137 14 30 16.6863 30 20C30 22.3869 28.6085 24.4485 26.6 25.4V28C26.6 28.5523 26.1523 29 25.6 29H22.4C21.8477 29 21.4 28.5523 21.4 28V25.4C19.3915 24.4485 18 22.3869 18 20Z" fill="url(#brainGlowBrand)" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 33H27" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22.5 36H25.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="24" cy="20" r="2.5" fill="#f59e0b"/>
          <defs>
            <radialGradient id="brainGlowBrand" cx="24" cy="20" r="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" stopOpacity="0.45"/>
              <stop offset="1" stopColor="#f59e0b" stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-2">
          <span className={cn('font-black tracking-tight text-white font-sans', sizeMap[size].text)}>
            AI <span className="text-amber-500">COO</span>
          </span>
          {badgeText && (
            <span className={cn('rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider', sizeMap[size].badge)}>
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
