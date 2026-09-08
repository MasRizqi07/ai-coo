import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-800/60',
        shimmer &&
          'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-linear-to-r after:from-transparent after:via-slate-700/30 after:to-transparent',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Pre-built Skeleton for KPI Metric Card
 */
export function KpiCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-36 rounded-lg" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-3 w-24 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Pre-built Skeleton for Table Rows
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-800/60 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full max-w-[120px] rounded-md" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Pre-built Skeleton for POS Product Card Grid
 */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3">
      <Skeleton className="h-4 w-3/4 rounded-md" />
      <Skeleton className="h-3 w-1/3 rounded-md" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-4 w-12 rounded-md" />
      </div>
    </div>
  );
}
