import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          className={cn(
            'flex h-11 min-h-[44px] w-full rounded-xl border bg-slate-900/60 px-3.5 py-2 text-sm text-slate-100 ring-offset-slate-950',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500/50',
            'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error
              ? 'border-red-500/60 focus-visible:ring-red-500 text-red-100'
              : 'border-slate-700/80 hover:border-slate-600',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };

