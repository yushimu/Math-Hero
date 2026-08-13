import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors",
        {
          "bg-slate-100 text-slate-800": variant === 'default',
          "bg-green-100 text-green-800": variant === 'success',
          "bg-yellow-100 text-yellow-800": variant === 'warning',
          "bg-rose-100 text-rose-800": variant === 'danger',
          "bg-blue-100 text-blue-800": variant === 'info',
        },
        className
      )}
      {...props}
    />
  );
}
