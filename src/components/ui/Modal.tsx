import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className={cn(
          "bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl border-4 border-slate-200 flex flex-col",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
