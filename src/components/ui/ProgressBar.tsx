import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color = 'bg-blue-500',
  size = 'md',
  className, 
  ...props 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div 
      className={cn(
        "w-full overflow-hidden rounded-full bg-slate-100 border-2 border-slate-200", 
        {
          "h-2": size === 'sm',
          "h-4": size === 'md',
          "h-6": size === 'lg',
        },
        className
      )} 
      {...props}
    >
      <div 
        className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
