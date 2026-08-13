import React from 'react';
import { cn } from '../../lib/utils';
import { User2 } from 'lucide-react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export function Avatar({ src, alt, size = 'md', fallback, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm",
        {
          "h-10 w-10 border-2": size === 'sm',
          "h-16 w-16 border-2": size === 'md',
          "h-24 w-24": size === 'lg',
          "h-32 w-32": size === 'xl',
        },
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600 font-bold">
          {fallback ? fallback : <User2 className={size === 'sm' ? 'h-5 w-5' : 'h-8 w-8'} />}
        </div>
      )}
    </div>
  );
}
