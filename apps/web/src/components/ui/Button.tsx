import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    // Map 'default' to 'primary' for backward compatibility
    const activeVariant = variant === 'default' ? 'primary' : variant;

    const variants: Record<string, string> = {
      primary:
        'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 active:scale-[0.98] shadow-md shadow-amber-500/20 focus-visible:ring-amber-400',
      secondary:
        'bg-slate-800 text-slate-100 font-semibold hover:bg-slate-700 border border-slate-700 active:scale-[0.98] focus-visible:ring-slate-400',
      outline:
        'border border-slate-700 bg-transparent hover:bg-slate-800/80 text-slate-200 active:scale-[0.98] focus-visible:ring-amber-500',
      ghost:
        'hover:bg-slate-800/60 text-slate-300 hover:text-white active:scale-[0.98] focus-visible:ring-slate-500',
      danger:
        'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98] focus-visible:ring-red-400',
      glass:
        'bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] active:scale-[0.98]',
    };

    const sizes: Record<string, string> = {
      default: 'h-11 min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold',
      sm: 'h-9 min-h-[36px] px-3 rounded-lg text-xs font-semibold',
      lg: 'h-12 min-h-[48px] px-8 rounded-xl text-base font-bold',
      icon: 'h-11 w-11 min-h-[44px] rounded-xl p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 select-none cursor-pointer transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
          'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
          variants[activeVariant] || variants.primary,
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button };

