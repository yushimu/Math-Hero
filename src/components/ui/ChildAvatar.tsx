import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface ChildAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  avatarIcon?: string;
  accessoryIcon?: string;
  themeClass?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
}

export function ChildAvatar({ 
  avatarIcon = '🧑‍🌾', 
  accessoryIcon, 
  themeClass = 'bg-blue-100', 
  size = 'md',
  className,
  ...props 
}: ChildAvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-[2rem] border-4 border-white shadow-sm flex-col items-center justify-end",
        themeClass,
        {
          "h-12 w-12 border-2 rounded-xl": size === 'sm',
          "h-20 w-20 border-2 rounded-2xl": size === 'md',
          "h-32 w-32 rounded-[2rem]": size === 'lg',
          "h-40 w-40 rounded-[2.5rem]": size === 'xl',
          "h-64 w-64 rounded-[3rem]": size === 'xxl',
        },
        className
      )}
      {...props}
    >
      <div 
        className={cn(
          "relative z-10 leading-none transition-transform hover:scale-105",
          {
            "text-3xl mb-1": size === 'sm',
            "text-5xl mb-2": size === 'md',
            "text-7xl mb-4": size === 'lg',
            "text-[6rem] mb-6": size === 'xl',
            "text-[9rem] mb-8": size === 'xxl',
          }
        )}
      >
        {avatarIcon}
        
        {accessoryIcon && (
          <div 
            className={cn(
              "absolute top-0 right-0 -mt-2 -mr-2 drop-shadow-md",
              {
                "text-lg": size === 'sm',
                "text-2xl": size === 'md',
                "text-4xl": size === 'lg',
                "text-5xl": size === 'xl',
                "text-7xl -mt-6 -mr-4": size === 'xxl',
              }
            )}
            style={{ transform: 'rotate(15deg)' }}
          >
            {accessoryIcon}
          </div>
        )}
      </div>
      
      {/* Decorative floor glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/5 blur-xl rounded-full scale-150 translate-y-1/2"></div>
    </div>
  );
}
