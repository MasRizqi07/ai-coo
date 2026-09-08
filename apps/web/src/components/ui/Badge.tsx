import * as React from 'react';
import { Crown, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'info'
    | 'vip'
    | 'loyal'
    | 'outline';
  dot?: boolean;
  pulsing?: boolean;
}

function Badge({
  className,
  variant = 'default',
  dot = false,
  pulsing = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'border-slate-700/60 bg-slate-800 text-slate-200',
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
    destructive: 'border-red-500/20 bg-red-500/10 text-red-400',
    info: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
    vip: 'border-purple-500/30 bg-purple-500/10 text-purple-300 font-bold shadow-sm shadow-purple-500/10',
    loyal: 'border-blue-500/30 bg-blue-500/10 text-blue-300 font-bold',
    outline: 'border-slate-700 bg-slate-900/40 text-slate-300',
  };

  const dotColors = {
    default: 'bg-slate-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    destructive: 'bg-red-400',
    info: 'bg-blue-400',
    vip: 'bg-purple-400',
    loyal: 'bg-blue-400',
    outline: 'bg-slate-400',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none transition-colors',
        variants[variant] || variants.default,
        className,
      )}
      {...props}
    >
      {variant === 'vip' && <Crown className="h-3 w-3 text-purple-400 shrink-0" />}
      {variant === 'loyal' && <Star className="h-3 w-3 text-blue-400 shrink-0" />}
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          {pulsing && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                dotColors[variant],
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-2 w-2', dotColors[variant])} />
        </span>
      )}
      {children}
    </div>
  );
}

export { Badge };

