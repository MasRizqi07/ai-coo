import * as React from 'react';
import { cn } from '../../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-xs font-semibold tracking-wide uppercase text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 inline-flex items-center gap-1',
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="text-amber-400 font-bold">*</span>}
    </label>
  ),
);
Label.displayName = 'Label';

export { Label };

