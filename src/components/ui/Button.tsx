import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-black transition-all duration-200 active:scale-[0.97] active:border-b-0 active:translate-y-1 disabled:pointer-events-none disabled:opacity-50 disabled:grayscale focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50",
          {
            "bg-green-500 hover:bg-green-400 text-white border-b-4 border-green-700 shadow-md": variant === 'primary',
            "bg-blue-500 hover:bg-blue-400 text-white border-b-4 border-blue-700 shadow-md": variant === 'secondary',
            "bg-pink-500 hover:bg-pink-400 text-white border-b-4 border-pink-700 shadow-md": variant === 'danger',
            "bg-slate-100 hover:bg-slate-200 text-slate-800 border-b-4 border-slate-300 shadow-sm": variant === 'default',
            "border-4 border-blue-100 bg-white hover:border-blue-300 text-blue-500": variant === 'outline',
            "hover:bg-blue-50 text-blue-500": variant === 'ghost',
            "h-10 px-4 py-2 text-sm": size === 'sm',
            "h-14 px-6 py-3 text-lg rounded-2xl": size === 'md',
            "h-16 px-8 py-4 text-xl rounded-3xl border-b-8 active:translate-y-2": size === 'lg',
            "h-12 w-12": size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
